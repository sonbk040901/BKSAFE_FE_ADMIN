import {
  CloseCircleOutlined,
  EyeOutlined,
  MoreOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Badge,
  Button,
  Dropdown,
  Modal,
  Space,
  Table,
  Tag,
  Tooltip,
  message
} from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "antd/es/typography/Link";
import { useMemo, useState } from "react";
import { bookingApi } from "../api";
import { GetAllPagingAndSortDto } from "../api/booking";
import { Booking, PagingAndSortResponse } from "../api/types";
import SelectDriverDrawer from "../components/booking/SelectDriverDrawer";
import StatisticBar from "../components/booking/StatisticBar";
const initialData: PagingAndSortResponse<Booking> = {
  data: [],
  skip: 0,
  take: 10,
  total: 0,
  order: "asc",
  sort: "id",
};
const getTagStatus = (status: Booking["status"]) => {
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
const RequestList = () => {
  const [bookingId, setBookingId] = useState<number>();
  const [messageApi, contextHolder] = message.useMessage();
  const [modal, modalContext] = Modal.useModal();
  const [query, setQuery] = useState<GetAllPagingAndSortDto>(initialData);
  const { data, refetch, isFetching } = useQuery({
    queryFn: () => bookingApi.getAll(query),
    initialData,
    queryKey: [query],
    refetchOnWindowFocus: false,
  });
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
        render: getTagStatus,
        filters: [
          { text: "Đang chờ", value: "PENDING" },
          { text: "Đang tìm tài xế", value: "ACCEPTED" },
          { text: "Đang đến", value: "RECEIVED" },
          { text: "Đã từ chối", value: "REJECTED" },
          { text: "Đã hủy", value: "CANCELLED" },
          { text: "Đang thực hiện", value: "DRIVING" },
          { text: "Kết thúc", value: "COMPLETED" },
        ],
        filteredValue: query.status || null,
      },
      {
        title: "Người đặt",
        key: "account",
        dataIndex: ["user", "email"],
        render: (email: string) => (
          <Tooltip
            color="white"
            title={
              <span className="text-slate-950">
                Xem thông chi tiết người đặt
              </span>
            }
          >
            <Link>{email}</Link>
          </Tooltip>
        ),
      },
      {
        title: "Thời gian tạo",
        key: "createdAt",
        dataIndex: "createdAt",
        render: (createdAt: string | Date) => {
          const date = new Date(createdAt);
          const dateFormated = date.toLocaleString("vi", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
          const now = new Date();
          const diff = now.getTime() - date.getTime();
          let html: JSX.Element;
          if (diff < 1000 * 60) {
            html = <span>Vừa xong</span>;
          } else if (diff < 1000 * 60 * 60) {
            html = <span>{Math.floor(diff / (1000 * 60))} phút trước</span>;
          } else if (diff < 1000 * 60 * 60 * 24) {
            html = <span>{Math.floor(diff / (1000 * 60 * 60))} giờ trước</span>;
          } else if (diff < 1000 * 60 * 60 * 24 * 7) {
            html = (
              <span>{Math.floor(diff / (1000 * 60 * 60 * 24))} ngày trước</span>
            );
          } else html = <span>{dateFormated}</span>;
          return (
            <Tooltip
              color="white"
              title={<p className="text-slate-950">{dateFormated}</p>}
            >
              {html}
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
            <Button
              size="small"
              icon={<EyeOutlined />}
              type="text"
            />
            {record.status === "PENDING" && (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "list-driver",
                      icon: <SearchOutlined />,
                      label: "Tài xế phù hợp",
                      onClick: () => handleViewSuggestDrivers(record.id),
                    },
                    {
                      key: "reject",
                      icon: <CloseCircleOutlined />,
                      label: "Từ chối",
                      onClick: () => {
                        modal.confirm({
                          title: "Từ chối yêu cầu",
                          icon: null,
                          content: (
                            <p>
                              Bạn có chắc chắn muốn từ chối yêu cầu này không?
                            </p>
                          ),
                          okText: "Từ chối",
                          cancelText: "Hủy",
                          onOk() {
                            const key = "reject-booking";
                            void messageApi.open({
                              key,
                              type: "loading",
                              content: "Đang xử lý...",
                            });
                            bookingApi
                              .rejectBooking(record.id)
                              .then(() => {
                                void refetch();
                                void messageApi.success({
                                  key,
                                  content: "Từ chối thành công",
                                });
                              })
                              .catch(() => {
                                void messageApi.error({
                                  key,
                                  content: "Từ chối thất bại",
                                });
                              });
                          },
                        });
                      },
                    },
                  ],
                }}
                trigger={["click"]}
              >
                <Button
                  size="small"
                  icon={<MoreOutlined />}
                  type="text"
                />
              </Dropdown>
            )}
          </Space>
        ),
      },
    ],
    [messageApi, modal, query.status, refetch],
  );
  const handleViewSuggestDrivers = (bookingId: number) => {
    setBookingId(bookingId);
  };
  const handleCloseDrawer = () => {
    setBookingId(undefined);
  };
  return (
    <Space
      className="w-full h-full"
      direction="vertical"
    >
      <SelectDriverDrawer
        onClose={handleCloseDrawer}
        bookingId={bookingId}
      />
      <StatisticBar />
      <Table
        className="flex-1"
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={data.data}
        loading={isFetching}
        scroll={{ scrollToFirstRowOnChange: false, y: 450}}
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
          showTotal: (total, [from, to]) =>
            `${from}-${to} trên tổng ${total}  yêu cầu`,
        }}
      />
      {contextHolder}
      {modalContext}
    </Space>
  );
};

export default RequestList;
