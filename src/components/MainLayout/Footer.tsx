import { Layout } from "antd";
import { FC } from "react";
const { Footer: AntdFooter } = Layout;

const Footer: FC = () => {
  return (
    <AntdFooter
      className="rounded-md bg-white shadow-md"
    >
      Copyright &copy; 7/2023 Created by LeDucSon
    </AntdFooter>
  );
};

export default Footer;
