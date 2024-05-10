import { Breadcrumb, Layout } from "antd";
import { FC } from "react";
import { useLocation } from "react-router-dom";
import { breadCrumb } from "../../router";
const { Header: AntdHeader } = Layout;

const Header: FC = () => {
  const { pathname } = useLocation();
  console.log(pathname);

  return (
    <AntdHeader className="rounded-md bg-white shadow-md flex items-center">
      <Breadcrumb
      // items={breadCrumb}
      // itemRender={({ title, path }) => {
      //   return pathname === path ? <>{title}</> : null;
      // }}
      >
        
      </Breadcrumb>
    </AntdHeader>
  );
};

export default Header;
