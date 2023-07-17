import { Layout, Button, Menu, MenuProps } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  CarOutlined,
} from "@ant-design/icons";
import { FC, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const { Sider } = Layout;
const items: MenuProps["items"] = [
  { type: "divider" },
  { key: "/", icon: <HomeOutlined />, label: "Home" },
  {
    key: "/request",
    icon: <CarOutlined />,
    label: "Request list",
  },
];
const Slider: FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Sider
      theme="light"
      collapsed={collapsed}
      className="rounded-md shadow-md"
    >
      <div className=" rounded-md p-2 grid place-items-center">
        <Button
          block
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
        />
      </div>
      <Menu
        defaultSelectedKeys={[pathname]}
        theme="light"
        mode="inline"
        items={items}
        onSelect={(item) => {
          navigate(item.key);
        }}
      />
    </Sider>
  );
};

export default Slider;
