import { RedoOutlined, UserOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Badge, Space, Typography } from "antd";
import classNames from "classnames";
import { useState, type FC } from "react";
import { userApi } from "../../api";
import type { ActivateStatus, DriverStatus } from "../../api/types";

interface StatisticBarProps {
  onSelect?: (isActivated: boolean | undefined) => void;
}

const StatisticBar: FC<StatisticBarProps> = ({ onSelect }) => {
  const [hasNoti, setHasNoti] = useState(false);
  const {
    data: statistic,
    refetch: refetchStatistic,
    isFetching,
  } = useQuery({
    queryFn: userApi.getStatistic,
    refetchOnWindowFocus: false,
    initialData: {
      active: 0,
      inactive: 0,
      total: 0,
    },
    queryKey: ["userStatistic"],
  });
  // const handleClickStatus = (
  //   onStatus: DriverStatus | undefined,
  //   activateStatus?: ActivateStatus,
  // ) => {
  //   setHasNoti(false);
  //   // onSelect?.(onStatus, activateStatus);
  // };
  return (
    <div className="relative w-[400px] p-3 rounded-md border-[1px] border-solid border-slate-200 grid grid-cols-3 gap-3 shadow-sm">
      <span className="absolute bottom-1 right-1 cursor-pointer">
        <RedoOutlined
          spin={isFetching}
          onClick={() => void refetchStatistic()}
        />
      </span>
      <Space key="total">
        <div className="flex flex-col gap-2">
          <span>Tổng</span>
          <div
            className="space-x-1 cursor-pointer transition-transform duration-300 hover:scale-110 hover:translate-x-1"
            // onClick={() => handleClickStatus()}
          >
            <UserOutlined />
            <span className="font-semibold text-base">{statistic.total}</span>
          </div>
        </div>
      </Space>
      <Space>
        <div className="flex flex-col gap-2">
          <span>
            <Badge
              status="success"
              text={
                <Typography.Text type="success">Đã kích hoạt</Typography.Text>
              }
            />
          </span>
          <div className="space-x-1 cursor-pointer transition-transform duration-300 hover:scale-110 hover:translate-x-1">
            <UserOutlined
            // className={classNames({
            //   "text-red-500 animate-bounce": key === "PENDING" && hasNoti,
            // })}
            />
            <span className="font-semibold text-base">{statistic.active}</span>
          </div>
        </div>
      </Space>
      <Space className="">
        <div className="flex flex-col gap-2">
          <span>
            <Badge
              status="error"
              text={
                <Typography.Text type="danger">Chưa kích hoạt</Typography.Text>
              }
            />
          </span>
          <div className="space-x-1 cursor-pointer transition-transform duration-300 hover:scale-110 hover:translate-x-1">
            <UserOutlined
            // className={classNames({
            //   "text-red-500 animate-bounce": key === "PENDING" && hasNoti,
            // })}
            />
            <span className="font-semibold text-base">
              {statistic.inactive}
            </span>
          </div>
        </div>
      </Space>
    </div>
  );
};

export default StatisticBar;
