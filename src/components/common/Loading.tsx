import { Spin } from "antd";

const Loading = () => (
  <div className="absolute top-0 right-0 h-full w-full bg-zinc-300 grid place-items-center">
    <Spin size="large" />
  </div>
);
export default Loading;