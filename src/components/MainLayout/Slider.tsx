import {
  CarOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import Icon from "@ant-design/icons";
import { Button, Layout, Menu, MenuProps } from "antd";
import { FC, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../states";
import { removeAccount } from "../../states/slices/account";
import { DriverIcon } from "../../icons";
const { Sider } = Layout;
const items: MenuProps["items"] = [
  { type: "divider" },
  { key: "/", icon: <HomeOutlined />, label: "Trang chủ" },
  {
    key: "/bookings",
    icon: <CarOutlined />,
    label: "Yêu cầu",
  },
  {
    key: "/drivers",
    icon: <Icon component={() => <DriverIcon size={14} />} />,
    label: "Tài xế",
  },
];
const Slider: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Sider
      theme="light"
      collapsed={collapsed}
      className="rounded-md shadow-md"
    >
      <div className="flex flex-col h-full">
        <div className="rounded-md p-2 grid place-items-center">
          <Button
            block
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
        </div>
        <div className="flex-1">
          <Menu
            defaultSelectedKeys={[pathname]}
            theme="light"
            mode="inline"
            items={items}
            onSelect={(item) => {
              navigate(item.key);
            }}
          />
        </div>
        <Menu
          selectable={false}
          items={[
            { type: "divider" },
            {
              key: "/logout",
              icon: <LogoutOutlined />,
              label: "Đăng xuất",
              onClick: () => {
                dispatch(removeAccount());
              },
            },
          ]}
        ></Menu>
      </div>
    </Sider>
  );
};

export default Slider;
