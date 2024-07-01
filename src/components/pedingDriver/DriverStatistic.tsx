import { CarOutlined, InfoCircleOutlined, StarFilled } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Card, DatePicker, Switch, Table, Tooltip, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import Link from "antd/es/typography/Link";
import "chart.js/auto";
import { ChartData } from "chart.js/auto";
import dayjs, { Dayjs } from "dayjs";
import { useState, type FC } from "react";
import { Bar } from "react-chartjs-2";
import { driverApi } from "../../api";
import { Booking } from "../../api/types";
import timeDiff from "../../utils/timeDiff";

interface DriverStatisticProps {
  driverId: number;
}

const DriverStatistic: FC<DriverStatisticProps> = ({ driverId }) => {
  const [month, setMonth] = useState<Dayjs>(dayjs());
  const { data: statistic } = useQuery({
    queryFn: () => driverApi.getStatisticById(driverId, month.toString()),
    queryKey: ["get-driver-statistic", driverId, month.toString()],
    refetchOnWindowFocus: false,
  });
  const { data: yearStatistic } = useQuery({
    queryFn: () => driverApi.getYearStatistic(driverId, month.get("year")),
    queryKey: [
      "get-driver-year-statistic",
      driverId,
      month.get("year").toString(),
    ],
    refetchOnWindowFocus: false,
  });
  const { data: bookings } = useQuery({
    queryFn: () => driverApi.getBookings(driverId, month.toString()),
    queryKey: ["get-driver-bookings", driverId, month.toString()],
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
          <Tooltip
            color="white"
            title={review && <p className="text-slate-950">{review}</p>}
          >
            <div className="flex items-center gap-1">
              <span>{+rating.toFixed(2)}</span>
              <StarFilled className="text-yellow-400" />
              <span className="w-20 overflow-hidden truncate inline-block">
                {review ? <>- {review}</> : null}
              </span>
            </div>
          </Tooltip>
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

  const DoughData: ChartData<"bar", number[], string> = {
    labels: yearStatistic?.map((item) => `Tháng ${item.month}`) || [],
    datasets: [
      {
        data: yearStatistic?.map((item) => item.price) || [],
        backgroundColor: "#ff69b4aa",
        hoverBackgroundColor: "hotpink",
        label: "Thu nhập",
      },
    ],
  };
  return (
    <div className="space-y-2">
      <Typography className="text-gray-500 font-semibold text-base mb-1">
        Thống kê tài xế
      </Typography>

      <Card className="relative">
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
          <div className="flex-1 flex flex-col gap-2">
            <Typography className="text-gray-500 font-semibold text-base">
              Số chuyến thành công
            </Typography>
            <div className="space-x-1 cursor-pointer transition-transform text-lg">
              <CarOutlined />
              <span className="font-semibold">{statistic?.totalBooking}</span>
            </div>
          </div>
          {
            <div className="flex-1 flex flex-col gap-2">
              {statistic?.totalReject !== undefined ? (
                <>
                  <Typography className="text-gray-500 font-semibold text-base">
                    Số chuyến từ chối
                  </Typography>
                  <div className="space-x-1 cursor-pointer transition-transform text-lg">
                    <CarOutlined />
                    <span className="font-semibold">
                      {statistic?.totalReject}
                    </span>
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          }
        </div>
        <div className="absolute top-2 right-2">
          <Tooltip
            color="white"
            title={
              <p className="text-slate-950">
                Chỉ xem được số chuyến từ chối của hiện tại
              </p>
            }
          >
            <InfoCircleOutlined />
          </Tooltip>
        </div>
      </Card>
      <div className="h-60">
        <Bar
          data={DoughData}
          width={500}
        />
      </div>
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

export default DriverStatistic;
