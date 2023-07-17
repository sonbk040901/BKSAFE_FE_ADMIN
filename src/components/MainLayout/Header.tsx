import { Layout,Input } from "antd";
import { FC } from "react";
const { Header: AntdHeader } = Layout;

const Header: FC = () => {
  return (
    <AntdHeader className="rounded-md bg-white shadow-md flex items-center">
      <Input.Search
        placeholder="Search"
        className="w-2/5"
        size="large"
      />
    </AntdHeader>
  );
};

export default Header;
