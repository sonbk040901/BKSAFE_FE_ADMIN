import { CarOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Badge, Space, Tag, notification } from "antd";
import { useEffect, type FC } from "react";
import { bookingApi } from "../../api";
import { BookingStatus } from "../../api/types";
import { bookingSocket } from "../../socket";
import { isFluxStandardAction } from "@reduxjs/toolkit";
const getTagStatus = (status: BookingStatus) => {
  switch (status) {
    case "PENDING":
      return <Tag color="warning">Đang chờ</Tag>;
    case "ACCEPTED":
      return <Tag color="blue">Đang tìm tài xế</Tag>;
    case "RECEIVED":
      return <Tag color="cyan">Đang đến</Tag>;
    case "REJECTED":
      return <Tag color="volcano">Đã từ chối</Tag>;
    case "CANCELLED":
      return <Tag color="red">Đã hủy</Tag>;
    case "DRIVING":
      return (
        <Badge
          status="success"
          text="Success"
        >
          <Tag color="purple">Đang thực hiện</Tag>
        </Badge>
      );
    case "COMPLETED":
      return <Tag color="green">Kết thúc</Tag>;

    default:
      break;
  }
};
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface StatisticBarProps {}

const StatisticBar: FC<StatisticBarProps> = () => {
  const [notiApi, contextHolder] = notification.useNotification();
  const { data: statistic, refetch: refetchStatistic } = useQuery({
    queryFn: bookingApi.getStatistic,
    refetchOnWindowFocus: false,
    initialData: {
      PENDING: 0,
      ACCEPTED: 0,
      RECEIVED: 0,
      REJECTED: 0,
      CANCELLED: 0,
      DRIVING: 0,
      COMPLETED: 0,
    },
    queryKey: ["bookingStatistic"],
  });
  const total = Object.values(statistic).reduce((acc, value) => acc + value, 0);
  isFluxStandardAction;
  useEffect(() => {
    // TODO: 
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis["test"] = () => {
      notiApi.open({
        type: "warning",
        message: "Có yêu cầu mới",
        description: "Có yêu cầu mới, vui lòng kiểm tra",
        duration: 3,
      });
    };
    return bookingSocket.listenNewPendingBooking(() => {
      void refetchStatistic();
      notiApi.open({
        message: "Có yêu cầu mới",
        description: "Có yêu cầu mới, vui lòng kiểm tra",
        duration: 0,
      });
    });
  }, [notiApi, refetchStatistic]);
  return (
    <div className="w-[450px] p-3 rounded-md border-[1px] border-solid border-slate-200 grid grid-cols-4 gap-3 shadow-sm">
      {contextHolder}
      <Space key={"total"}>
        <div className="flex flex-col gap-2">
          <span>Tổng</span>
          <div className="space-x-1">
            <CarOutlined />
            <span className="font-semibold text-base">{total}</span>
          </div>
        </div>
      </Space>
      {Object.entries(statistic).map(([key, value]) => (
        <Space key={key}>
          <div className="flex flex-col gap-2">
            <span>{getTagStatus(key as BookingStatus)}</span>
            <div className="space-x-1">
              <CarOutlined />
              <span className="font-semibold text-base">{value}</span>
            </div>
          </div>
        </Space>
      ))}
    </div>
  );
};

export default StatisticBar;
