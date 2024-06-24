import { Typography } from "antd";
import type { FC, ReactNode } from "react";

export interface InfoItemProps {
  label: string;
  value: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any) => ReactNode;
}

const InfoItem: FC<InfoItemProps> = (props) => {
  const { label: lable, value, render = () => value } = props;
  return (
    <div className="w-full flex justify-between">
      <Typography.Text
        strong
        className="text-gray-500"
      >
        {lable}:
      </Typography.Text>
      <Typography.Text className="font-medium">{render(value)}</Typography.Text>
    </div>
  );
};

export default InfoItem;
