import { SettingOutlined } from "@ant-design/icons";
import { Button, Drawer, Form, Input, Layout, Typography } from "antd";
import { FC, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { mapApi } from "../../api";
import SwitchMode from "../booking/SwitchMode";
const { Header: AntdHeader } = Layout;
const getTitle = (pathname: string) => {
  if (pathname.startsWith("/bookings")) {
    return "Danh sách yêu cầu tìm tài xế";
  }
  if (pathname.startsWith("/drivers")) {
    return "Danh sách tài xế";
  }
  if (pathname.startsWith("/pending-drivers/")) {
    return "Chi tiết tài xế chờ duyệt";
  }
  if (pathname.startsWith("/pending-drivers")) {
    return "Danh sách tài xế chờ duyệt";
  }
  if (pathname.startsWith("/users")) {
    return "Danh sách người dùng";
  }
  if (pathname.startsWith("/")) {
    return "Trang chủ";
  }
  return "Trang không tồn tại";
};
const Header: FC = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [apiKey, setapiKey] = useState<string>();
  useEffect(() => {
    void mapApi.getApiKey().then((res) => setapiKey(res));
  }, []);
  const handleUpdateApiKey = () => {
    if (!apiKey) return;
    void mapApi.updateApiKey(apiKey);
  };
  return (
    <AntdHeader className="rounded-md bg-white shadow-md flex items-center justify-center">
      <Typography className="p-0 m-0 text-2xl font-bold">
        {getTitle(pathname)}
      </Typography>
      <div className="absolute right-2 grid place-items-center">
        <Button
          type="text"
          icon={<SettingOutlined />}
          onClick={() => setOpen(true)}
        />
      </div>
      <Drawer
        width={400}
        open={open}
        title="Cài đặt hệ thống"
        onClose={() => setOpen(false)}
      >
        <Form.Item label="Google Map API Key">
          <Input.Password
            value={apiKey}
            onChange={(e) => setapiKey(e.target.value)}
          />
        </Form.Item>
        <SwitchMode />
        <Button
          type="primary"
          onClick={handleUpdateApiKey}
        >
          Cập nhật
        </Button>
      </Drawer>
    </AntdHeader>
  );
};

export default Header;
