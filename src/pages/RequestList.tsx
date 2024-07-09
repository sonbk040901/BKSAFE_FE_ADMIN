import { EyeOutlined, SettingFilled } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Space, Table, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "antd/es/typography/Link";
import { useMemo, useRef, useState } from "react";
import { bookingApi } from "../api";
import { GetAllPagingAndSortDto } from "../api/booking";
import { Booking, PagingAndSortResponse, User } from "../api/types";
import UserInfoModal from "../components/Request/UserInfoModal";
import BookingDetailModal from "../components/booking/BookingDetailModal";
import SelectDriverDrawer from "../components/booking/SelectDriverDrawer";
import StatisticBar, {
  StatisticBarRef,
} from "../components/booking/StatisticBar";
import { getTagStatus } from "../utils";
import timeDiff from "../utils/timeDiff";
const initialData: PagingAndSortResponse<Booking> = {
  data: [],
  skip: 0,
  take: 10,
  total: 0,
  order: "desc",
  sort: "id",
};
const RequestList = () => {
  const [bookingId, setBookingId] = useState<number>();
  const [booking, setBooking] = useState<Booking>();
  const [user, setUser] = useState<User>();
  const [query, setQuery] = useState<GetAllPagingAndSortDto>(initialData);
  const statisticBarRef = useRef<StatisticBarRef>(null);
  const { data, isFetching, refetch } = useQuery({
    queryFn: () => bookingApi.getAll(query),
    initialData,
    queryKey: [query, "bookings"],
    refetchOnWindowFocus: false,
  });
  const selectedBookingUserId = data.data.find(
    (item) => item.id === bookingId,
  )?.user?.id;
  const columns: ColumnsType<Booking> = useMemo(
    () => [
      {
        title: "STT",
        key: "id",
        dataIndex: "id",
        width: 60,
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
        title: "Điểm đón",
        key: "pickup",
        render: (_, record) => {
          const address = record.locations[0].address;
          return (
            <Tooltip
              color="white"
              title={<p className="text-slate-900">{address}</p>}
            >
              <p className="truncate">{address}</p>
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
              <p className="truncate">{address}</p>
            </Tooltip>
          );
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
        title: "Trạng thái",
        key: "status",
        dataIndex: "status",
        width: 130,
        render: getTagStatus,
        filters: [
          { text: "Đang chờ", value: "PENDING" },
          { text: "Đang tìm tài xế", value: "ACCEPTED" },
          { text: "Đang đến", value: "RECEIVED" },
          { text: "Đã từ chối", value: "REJECTED" },
          { text: "Đã hủy", value: "CANCELLED" },
          { text: "Đang thực hiện", value: "DRIVING" },
          { text: "Kết thúc", value: "COMPLETED" },
          { text: "Hết thời gian", value: "TIMEOUT" },
        ],
        filteredValue: query.status || null,
      },
      {
        title: "Người đặt",
        key: "account",
        dataIndex: ["user", "fullName"],
        render: (fullName: string, record) => (
          <Tooltip
            color="white"
            title={
              <span className="text-slate-950">
                Xem thông chi tiết người đặt
              </span>
            }
          >
            <Link onClick={() => setUser(record.user ?? undefined)}>
              {fullName}
            </Link>
          </Tooltip>
        ),
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
              title={<p className="text-slate-950">{formated}</p>}
            >
              {diff}
            </Tooltip>
          );
        },
      },
      {
        title: "Thao tác",
        key: "action",
        width: 100,
        render: (_, record) => (
          <Space>
            <Tooltip
              color="white"
              title={<p className="text-slate-950">Xem chi tiết</p>}
            >
              <Button
                size="small"
                icon={<EyeOutlined />}
                type="text"
                onClick={() => setBooking(record)}
              />
            </Tooltip>
            {(record.status === "PENDING" || record.status === "ACCEPTED") && (
              <Tooltip
                color="white"
                title={<p className="text-slate-950">Xử lý</p>}
              >
                <Button
                  size="small"
                  icon={<SettingFilled />}
                  type="text"
                  onClick={() => handleViewSuggestDrivers(record.id)}
                />
              </Tooltip>
            )}
          </Space>
        ),
      },
    ],
    [query.status],
  );
  const handleViewSuggestDrivers = (bookingId: number) => {
    setBookingId(bookingId);
  };
  const handleCloseDrawer = () => {
    setBookingId(undefined);
  };
  const handleRefresh = () => {
    void refetch();
    statisticBarRef.current?.refetch();
  };
  return (
    <Space
      className="w-full h-full"
      direction="vertical"
    >
      <SelectDriverDrawer
        bookingId={bookingId}
        userId={selectedBookingUserId}
        onClose={handleCloseDrawer}
        onChange={handleRefresh}
        onReject={handleRefresh}
      />
      <div className="flex gap-2">
        <StatisticBar
          ref={statisticBarRef}
          onSelect={(status) => {
            setQuery((prv) => ({
              ...prv,
              skip: 0,
              status: status ? [status] : [],
            }));
          }}
          onRefresh={() => void refetch()}
        />
      </div>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={data.data}
        loading={isFetching}
        scroll={{ scrollToFirstRowOnChange: false, y: 450, x: 1000 }}
        onChange={(pagination, filters) => {
          setQuery({
            ...query,
            skip:
              (pagination.current || 1) * (pagination.pageSize || 10) -
              (pagination.pageSize || 10),
            take: pagination.pageSize || 10,
            status: filters.status as string[],
          });
        }}
        pagination={{
          pageSize: data.take,
          total: data.total,
          current: data.skip / data.take + 1,
          responsive: false,
          showTotal: (total, [from, to]) => (
            <>
              {from}-{to} trên tổng <b>{total}</b> yêu cầu
            </>
          ),
        }}
      />
      <UserInfoModal
        user={user}
        onCancel={() => setUser(undefined)}
      />
      <BookingDetailModal
        booking={booking}
        onCancel={() => setBooking(undefined)}
      />
    </Space>
  );
};

export default RequestList;
