import { CarOutlined, StarFilled } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Card, DatePicker, Table, Tooltip, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import Link from "antd/es/typography/Link";
import dayjs, { Dayjs } from "dayjs";
import { useState, type FC } from "react";
import { driverApi } from "../../api";
import { Booking } from "../../api/types";
import timeDiff from "../../utils/timeDiff";

interface UserStatisticProps {
  userId: number;
}

const UserStatistic: FC<UserStatisticProps> = ({ userId }) => {
  const [month, setMonth] = useState<Dayjs>(dayjs());
  const { data: statistic } = useQuery({
    queryFn: () => driverApi.getStatisticById(userId, month.toString()),
    queryKey: ["get-driver-statistic", userId, month.toString()],
    refetchOnWindowFocus: false,
  });
  const { data: bookings } = useQuery({
    queryFn: () => driverApi.getBookings(userId, month.toString()),
    queryKey: ["get-driver-bookings", userId, month.toString()],
    refetchOnWindowFocus: false,
  });
  const isCurrentMonth = dayjs().isSame(month, "month");
  const columns: ColumnsType<Booking> = [
    {
      title: "STT",
      key: "id",
      dataIndex: "id",
      width: 40,
      render: (_, record, i) => {
        return (
          <Tooltip
            color="white"
            title={<p className="text-slate-950">id: {record.id}</p>}
          >
            {i + 1}
          </Tooltip>
        );
      },
    },
    {
      title: "Người đặt",
      key: "user",
      render: (_, record) => {
        const { user } = record;
        return <Link>{user?.fullName}</Link>;
      },
    },
    {
      title: "Giá",
      key: "price",
      dataIndex: "price",
      width: 110,
      render: (price: number) => (
        <span>
          {price.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </span>
      ),
    },
    {
      title: "Điểm đón",
      key: "pickup",
      render: (_, record) => {
        const address = record.locations[0].address;
        return (
          <Tooltip
            color="white"
            title={<p className="text-slate-900">{address}</p>}
          >
            <p className="truncate w-36">{address}</p>
          </Tooltip>
        );
      },
    },
    {
      title: "Điểm đến",
      key: "dropOff",
      render: (_, record) => {
        const address = record.locations[record.locations.length - 1].address;
        return (
          <Tooltip
            color="white"
            title={<p className="text-slate-900">{address}</p>}
          >
            <p className="truncate w-36">{address}</p>
          </Tooltip>
        );
      },
    },
    {
      title: "Đánh giá",
      key: "review",
      render: (_, record) => {
        const { rating, review } = record;
        return rating === null ? (
          "Chưa có"
        ) : (
          <div className="">
            <span>{+rating.toFixed(2)}</span>{" "}
            <StarFilled className="text-yellow-400" />
            <span className="max-w-md overflow-hidden truncate">
              {review ? <>({review})</> : null}
            </span>
          </div>
        );
      },
    },
    {
      title: "Thời gian tạo",
      key: "createdAt",
      dataIndex: "createdAt",
      render: (createdAt: string | Date) => {
        const [diff, formated] = timeDiff(createdAt);
        return (
          <Tooltip
            color="white"
            title={<span className="text-slate-950">{formated}</span>}
          >
            {diff}
          </Tooltip>
        );
      },
    },
  ];
  return (
    <div className="space-y-2">
      <Card>
        <div className="flex gap-1">
          <div className="flex-1 flex flex-col gap-2">
            <Typography className="text-gray-500 font-semibold text-base">
              Tháng {isCurrentMonth ? "hiện tại" : month.format("MM/YYYY")}
            </Typography>
            <div>
              <DatePicker
                picker="month"
                value={month}
                format={"MM/YYYY"}
                maxDate={dayjs()}
                onChange={(date) => setMonth(date)}
                allowClear={false}
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <Typography className="text-gray-500 font-semibold text-base">
              Số chuyến
            </Typography>
            <div className="space-x-1 cursor-pointer transition-transform text-lg">
              <CarOutlined />
              <span className="font-semibold">{statistic?.totalBooking}</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <Typography className="text-gray-500 font-semibold text-base">
              Số chuyến từ chối
            </Typography>
            <div className="space-x-1 cursor-pointer transition-transform text-lg">
              <CarOutlined />
              <span className="font-semibold">{statistic?.totalReject}</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <Typography className="text-gray-500 font-semibold text-base">
              Thu nhập
            </Typography>
            <div className="space-x-1 cursor-pointer transition-transform text-lg">
              <CarOutlined />
              <span className="font-semibold">
                {statistic?.totalPrice.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            </div>
          </div>
        </div>
      </Card>
      <div>
        <Typography className="text-gray-500 font-semibold text-base mb-1">
          Danh sách chuyến đi
        </Typography>
        <Table
          scroll={{ scrollToFirstRowOnChange: false }}
          size="small"
          columns={columns}
          dataSource={bookings}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default UserStatistic;
