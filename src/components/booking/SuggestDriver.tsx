import { AimOutlined, PhoneOutlined, StarFilled } from "@ant-design/icons";
import { Avatar, Badge, Button, Card, Divider, Space, Typography } from "antd";
import type { FC } from "react";
import { SuggestDriver } from "../../api/types";

interface SuggestDriverItemProps {
  driver: SuggestDriver;
  onSelect: (driverId: number) => void;
}

const SuggestDriverItem: FC<SuggestDriverItemProps> = (props) => {
  const { driver, onSelect } = props;
  const priority = +((driver.priority > 1 ? 1 : driver.priority) * 100).toFixed(
    1,
  );
  const priorityColor =
    priority >= 85
      ? "green"
      : priority > 70
      ? "blue"
      : priority > 40
      ? "orange"
      : "red";
  const distance = (driver.distance / 1000).toFixed(2);
  return (
    <Badge.Ribbon
      color={priorityColor}
      text={`${priority}%`}
    >
      <Card
        size="small"
        className="shadow-sm"
      >
        <div className="flex gap-2 items-center">
          <Avatar
            size={46}
            // src={driver.avatar ?? "https://i.pravatar.cc/300"}
            src={"https://i.pravatar.cc/300"}
          />
          <Space
            direction="vertical"
            className="flex-1"
          >
            <div className="flex gap-2">
              <Typography className="font-semibold">
                {driver.fullName}
              </Typography>
              <span className="text-yellow-500">
                {+driver.rating.toFixed(2)} <StarFilled />
              </span>
            </div>
            <Typography.Link>{driver.email}</Typography.Link>
          </Space>
          <p className="self-end flex gap-1">
            <AimOutlined className="text-pink-400" />
            <span>{distance} km</span>
          </p>
        </div>
        <Divider className="m-2" />
        <div className="flex justify-end gap-2">
          <Button
            type="primary"
            onClick={() => onSelect(driver.id)}
          >
            Chọn
          </Button>
          <Button
            type="dashed"
            icon={<PhoneOutlined />}
            onClick={() => {
              window.open(`tel:${driver.phone}`);
            }}
          >
            Gọi
          </Button>
        </div>
      </Card>
    </Badge.Ribbon>
  );
};

export default SuggestDriverItem;
