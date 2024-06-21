import { Layout, Typography } from "antd";
import { FC } from "react";
import { useLocation } from "react-router-dom";
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
  return (
    <AntdHeader className="rounded-md bg-white shadow-md flex items-center justify-center">
      <Typography className="p-0 m-0 text-2xl font-bold">{getTitle(pathname)}</Typography>
    </AntdHeader>
  );
};

export default Header;
