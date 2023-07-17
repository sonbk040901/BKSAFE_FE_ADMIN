import { Input } from "antd";

const Info = ({ title, value }: { title: string; value: string }) => {
  const addonBefore = (title: string) => (
    <p className="w-16 capitalize">{title}</p>
  );
  return (
    <Input
      readOnly
      addonBefore={addonBefore(title)}
      value={value}
      className="w-full"
    />
  );
};
export default Info
