import { EyeOutlined, StockOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Space } from "antd";
import { type FC } from "react";

interface PendingBookingCountProps {
  onSelectView?: () => void;
  value?: number;
}

const PendingBookingCount: FC<PendingBookingCountProps> = (props) => {
  const { onSelectView, value } = props;
  return (
    <Card>
      <div className="flex items-center gap-2">
        <Avatar
          size={50}
          className="bg-red-500"
          icon={<StockOutlined />}
        />
        <Space direction="vertical">
          <div className="text-xl font-bold">{value}</div>
          <div className="text-base text-slate-700">Yêu cầu đang chờ</div>
        </Space>
        <Space className="self-end">
          <Button
            type="dashed"
            onClick={onSelectView}
            icon={<EyeOutlined />}
          >
            Xem
          </Button>
        </Space>
      </div>
    </Card>
  );
};

export default PendingBookingCount;
