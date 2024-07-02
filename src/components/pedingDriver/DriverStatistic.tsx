import { StarFilled } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { DatePicker, Segmented, Space, Table, Tooltip, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import Link from "antd/es/typography/Link";
import "chart.js/auto";
import { ChartData } from "chart.js/auto";
import dayjs, { Dayjs } from "dayjs";
import { useState, type FC } from "react";
import { Chart } from "react-chartjs-2";
import { driverApi } from "../../api";
import { Booking } from "../../api/types";
import timeDiff from "../../utils/timeDiff";

interface DriverStatisticProps {
  driverId: number;
}

const DriverStatistic: FC<DriverStatisticProps> = ({ driverId }) => {
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [type, setType] = useState<"month" | "year">("month");
  const { data: { statistic, bookings, reject } = {}, isLoading } = useQuery({
    queryFn: () => driverApi.getBookingStatistic(driverId, date.toDate(), type),
    queryKey: ["get-driver-booking-statistic", driverId, date.toString(), type],
    refetchOnWindowFocus: false,
  });
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
  const DoughData: ChartData<"bar" | "line", number[], string> = {
    labels: statistic?.map((item) => item.value.toString()) || [],
    datasets: [
      {
        type: "bar",
        data: statistic?.map((item) => item.price) || [],
        backgroundColor: "#ff69b4aa",
        hoverBackgroundColor: "hotpink",
        label: "Thu nhập",
        yAxisID: "y",
      },

      {
        type: "line",
        data: statistic?.map((item) => item.total) || [],
        backgroundColor: "#53c41ac7",
        hoverBackgroundColor: "#52c41a",
        label: "Số chuyến thành công",
        yAxisID: "y1",
      },
    ],
  };

  return (
    <div className="space-y-2 w-full h-[465px] overflow-y-auto">
      <div className="flex justify-between w-full items-center">
        <Space>
          <Typography className="text-gray-500 font-semibold text-base mb-1">
            Thống kê tài xế theo
          </Typography>
          <Segmented
            options={["Tháng", "Năm"]}
            onChange={(value) => {
              setType(value === "Tháng" ? "month" : "year");
            }}
          />
          <DatePicker
            value={date}
            onChange={setDate}
            picker={type}
            format={type === "month" ? "MM/YYYY" : "YYYY"}
            maxDate={dayjs()}
            allowClear={false}
          />
        </Space>
        <div className="flex gap-2 pr-1 items-baseline">
          <Typography className="text-gray-500 font-semibold text-base">
            Số chuyến từ chối trong tháng này:
          </Typography>
          <span className="font-semibold text-lg text-red-500">{reject}</span>
        </div>
      </div>
      <div className="h-60 relative">
        <Chart
          type="bar"
          data={DoughData}
          options={{
            // responsive: true,
            maintainAspectRatio: false,
            onClick(_, elements) {
              console.log(elements[0]?.index);
            },
            scales: {
              y: {
                type: "linear",
                position: "left",
                title: {
                  display: true,
                  text: "Thu nhập",
                },
                ticks: {
                  callback: (value) => {
                    return value.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    });
                  },
                },
              },
              y1: {
                type: "linear",
                position: "right",
                title: {
                  display: true,
                  text: "Số chuyến",
                },
                grid: { drawOnChartArea: false },
              },
            },
          }}
        />
      </div>
      <div>
        <Typography className="text-gray-500 font-semibold text-base mb-1">
          Danh sách chuyến đi
        </Typography>
        <Table
          loading={isLoading}
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
