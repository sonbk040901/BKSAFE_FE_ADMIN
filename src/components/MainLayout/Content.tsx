import { Layout } from "antd";
import { FC } from "react";
import { Outlet } from "react-router-dom";

const { Content: AntdContent } = Layout;
const Content: FC = () => {
  return (
    <AntdContent className="rounded-md bg-white shadow-md p-3">
      <Outlet />
    </AntdContent>
  );
};

export default Content;
