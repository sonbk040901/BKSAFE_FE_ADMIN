import { Layout } from "antd";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { FC } from "react";
import { Outlet } from "react-router-dom";

const { Content: AntdContent } = Layout;
const Content: FC = () => {
  return (
    <OverlayScrollbarsComponent
      element={AntdContent}
      className="rounded-md bg-white shadow-md p-3"
      options={{ scrollbars: { autoHide: "scroll" } }}
    >
      <Outlet />
    </OverlayScrollbarsComponent>
  );
};

export default Content;
