import { CarOutlined, RedoOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Badge, Space, Tag, notification } from "antd";
import cn from "classnames";
import { useEffect, useState, type FC } from "react";
import { bookingApi } from "../../api";
import { BookingStatus } from "../../api/types";
import { subcribe } from "../../socket";
import { useAppSelector } from "../../states";
import { selectSocketStatus } from "../../states/slices/socket";
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
interface StatisticBarProps {
  onSelect?: (status?: BookingStatus) => void;
}

const StatisticBar: FC<StatisticBarProps> = ({ onSelect }) => {
  const [notiApi, contextHolder] = notification.useNotification();
  const socketStatus = useAppSelector(selectSocketStatus);
  const {
    data: statistic,
    refetch: refetchStatistic,
    isFetching,
  } = useQuery({
    queryFn: bookingApi.getStatistic,
    refetchOnWindowFocus: false,
    initialData: {},
    queryKey: ["bookingStatistic"],
  });
  const [hasNoti, setHasNoti] = useState(false);
  const total = Object.values(statistic).reduce((acc, value) => acc + value, 0);
  useEffect(() => {
    if (socketStatus !== "connected") return;
    const cb = () => {
      setHasNoti(true);
      void refetchStatistic();
      notiApi.open({
        message: "Có yêu cầu mới",
        description: "Có yêu cầu mới, vui lòng kiểm tra",
        duration: 10,
        type: "warning",
      });
    };
    const unsubcribe1 = subcribe("booking/new-accepted", cb);
    const unsubcribe2 = subcribe("booking/new-pending", cb);
    return () => {
      unsubcribe1();
      unsubcribe2();
    };
  }, [notiApi, refetchStatistic, socketStatus]);
  const handleClickStatus = (status?: BookingStatus) => {
    setHasNoti(false);
    onSelect?.(status);
  };
  return (
    <div className="relative w-[450px] p-3 rounded-md border-[1px] border-solid border-slate-200 grid grid-cols-4 gap-3 shadow-sm">
      {contextHolder}
      <span className="absolute bottom-1 right-1 cursor-pointer">
        <RedoOutlined
          spin={isFetching}
          onClick={() => void refetchStatistic()}
        />
      </span>
      <Space key={"total"}>
        <div className="flex flex-col gap-2">
          <span>Tổng</span>
          <div
            className="space-x-1 cursor-pointer transition-transform duration-300 hover:scale-110"
            onClick={() => handleClickStatus()}
          >
            <CarOutlined />
            <span className="font-semibold text-base">{total}</span>
          </div>
        </div>
      </Space>
      {Object.entries(statistic).map(([key, value]) => (
        <Space key={key}>
          <div className="flex flex-col gap-2">
            <span>{getTagStatus(key as BookingStatus)}</span>
            <div
              className="space-x-1 cursor-pointer transition-transform duration-300 hover:scale-110"
              onClick={() => handleClickStatus(key as BookingStatus)}
            >
              <CarOutlined
                className={cn({
                  "text-red-500 animate-bounce": key === "PENDING" && hasNoti,
                })}
              />
              <span className="font-semibold text-base">{value}</span>
            </div>
          </div>
        </Space>
      ))}
    </div>
  );
};

export default StatisticBar;
