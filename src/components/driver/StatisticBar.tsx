import Icon, { CarOutlined, RedoOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Badge, Space, Tag, notification } from "antd";
import { useState, type FC } from "react";
import { driverApi } from "../../api";
import type { ActivateStatus, DriverStatus } from "../../api/types";
import classNames from "classnames";
import { DriverIcon } from "../../icons";

interface StatisticBarProps {
  onSelect?: (
    onStatus: DriverStatus | undefined,
    activateStatus?: ActivateStatus,
  ) => void;
}

const StatisticBar: FC<StatisticBarProps> = ({ onSelect }) => {
  const [notiApi, contextHolder] = notification.useNotification();
  const [hasNoti, setHasNoti] = useState(false);
  const {
    data: { activateStatus, status, total },
    refetch: refetchStatistic,
    isFetching,
  } = useQuery({
    queryFn: driverApi.getStatistic,
    refetchOnWindowFocus: false,
    initialData: {
      status: {},
      activateStatus: {},
      total: 0,
    },
    queryKey: ["driverStatistic"],
  });
  const handleClickStatus = (
    onStatus: DriverStatus | undefined,
    activateStatus?: ActivateStatus,
  ) => {
    setHasNoti(false);
    onSelect?.(onStatus, activateStatus);
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
      <Space
        key={"total"}
        className="row-span-2"
      >
        <div className="flex flex-col gap-2">
          <span>Tổng</span>
          <div
            className="space-x-1 cursor-pointer transition-transform duration-300 hover:scale-110 hover:translate-x-1"
            onClick={() => handleClickStatus(undefined)}
          >
            <Icon component={() => <DriverIcon size={14} />} />
            <span className="font-semibold text-base">{total}</span>
          </div>
        </div>
      </Space>
      {Object.entries(activateStatus).map(([key, value]) => (
        <Space key={key}>
          <div className="flex flex-col gap-2">
            <span>
              {key === "DEACTIVATED" ? (
                <Tag color="orange">Chờ duyệt</Tag>
              ) : key === "ACTIVATED" ? (
                <Tag color="success">Đã kích hoạt</Tag>
              ) : (
                <Tag color="error">Đã từ chối</Tag>
              )}
            </span>
            <div
              className="space-x-1 cursor-pointer transition-transform duration-300 hover:scale-110 hover:translate-x-1"
              onClick={() =>
                handleClickStatus(undefined, key as ActivateStatus)
              }
            >
              <Icon
                component={() => <DriverIcon size={14} />}
                className={classNames({
                  "text-red-500 animate-bounce":
                    key === "DEACTIVATED" && hasNoti,
                })}
              />
              <span className="font-semibold text-base">{value}</span>
            </div>
          </div>
        </Space>
      ))}
      {Object.entries(status).map(([key, value]) => (
        <Space key={key}>
          <div className="flex flex-col gap-2">
            <span>
              {key === "OFFLINE" ? (
                <Badge
                  status="error"
                  text={<span className="text-[#ff4d4f]">Ngoại tuyến</span>}
                />
              ) : key === "BUSY" ? (
                <Badge
                  status="warning"
                  text={<span className="text-[#faad14]">Đang bận</span>}
                />
              ) : (
                <Badge
                  status="processing"
                  color="green"
                  text={<span className="text-[#52c41a]">Trực tuyến</span>}
                />
              )}
            </span>
            <div
              className="space-x-1 cursor-pointer transition-transform duration-300 hover:scale-110 hover:translate-x-1"
              onClick={() =>
                handleClickStatus(undefined, key as ActivateStatus)
              }
            >
              <Icon
                component={() => <DriverIcon size={14} />}
                className={classNames({
                  "text-red-500 animate-bounce":
                    key === "DEACTIVATED" && hasNoti,
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
