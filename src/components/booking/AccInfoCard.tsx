import type { FC } from "react";
import InfoItem, { InfoItemProps } from "./InfoItem";
import { Avatar, Card, Typography } from "antd";

interface InfoCardProps {
  title: string;
  avatar?: string;
  items: InfoItemProps[];
}

const AccInfoCard: FC<InfoCardProps> = (props) => {
  const { items, title, avatar } = props;
  return (
    <Card className="flex-1">
      <Typography className="text-gray-500 font-semibold text-base mb-2">{title}</Typography>
      <div className="flex gap-5 items-stretch">
        <Avatar
          size={90}
          src={avatar}
        />
        <div className="flex-1 space-y-1">
          {items.map((item) => (
            <InfoItem
              key={item.label}
              {...item}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default AccInfoCard;
