import { RedoOutlined, UserOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Space, Tag, Typography } from "antd";
import { useState, type FC } from "react";
import { userApi } from "../../api";

interface StatisticBarProps {
  onSelect?: (isActivated: boolean | undefined) => void;
}

const StatisticBar: FC<StatisticBarProps> = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [hasNoti, setHasNoti] = useState(false);
  const {
    data: statistic,
    refetch: refetchStatistic,
    isFetching,
  } = useQuery({
    queryFn: userApi.getStatistic,
    refetchOnWindowFocus: false,
    initialData: {
      activated: 0,
      blocked: 0,
      deactivated: 0,
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
    <div className="relative w-[510px] p-3 rounded-md border-[1px] border-solid border-slate-200 grid grid-cols-4 shadow-sm">
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
            <Tag
              color="success"
              children={
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
            <span className="font-semibold text-base">
              {statistic.activated}
            </span>
          </div>
        </div>
      </Space>
      <Space className="">
        <div className="flex flex-col gap-2">
          <span>
            <Tag
              color="warning"
              children={
                <Typography.Text type="warning">Chưa kích hoạt</Typography.Text>
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
              {statistic.deactivated}
            </span>
          </div>
        </div>
      </Space>
      <Space className="">
        <div className="flex flex-col gap-2">
          <span>
            <Tag
              color="error"
              children={
                <Typography.Text type="danger">Đã chặn</Typography.Text>
              }
            />
          </span>
          <div className="space-x-1 cursor-pointer transition-transform duration-300 hover:scale-110 hover:translate-x-1">
            <UserOutlined
            // className={classNames({
            //   "text-red-500 animate-bounce": key === "PENDING" && hasNoti,
            // })}
            />
            <span className="font-semibold text-base">{statistic.blocked}</span>
          </div>
        </div>
      </Space>
    </div>
  );
};

export default StatisticBar;
