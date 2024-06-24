import { Card, Typography } from "antd";
import type { FC } from "react";
import InfoItem, { InfoItemProps } from "./InfoItem";

interface BookingInfoCardProps {
  items: InfoItemProps[];
  className?: string;
}

const BookingInfoCard: FC<BookingInfoCardProps> = (props) => {
  const { items, className } = props;
  return (
    <Card className={className}>
      <Typography.Text
        strong
        className="text-gray-500 font-semibold text-lg mb-2"
      >
        Thông tin yêu cầu
      </Typography.Text>
      <div className="flex-1 space-y-1">
        {items.map((item) => (
          <InfoItem
            key={item.label}
            {...item}
          />
        ))}
      </div>
    </Card>
  );
};

export default BookingInfoCard;
