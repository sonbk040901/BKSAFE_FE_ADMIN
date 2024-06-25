import { EyeOutlined, UserOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Avatar, Badge, Button, Space, Tag, Tooltip, Typography } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useMemo, useState } from "react";
import { driverApi } from "../api";
import { GetDriversPagingAndSortDto } from "../api/driver";
import {
  ActivateStatus,
  Driver,
  DriverStatus,
  PagingAndSortResponse,
} from "../api/types";
import StatisticBar from "../components/driver/StatisticBar";
import DriverDetailModal from "../components/pedingDriver/DriverDetailModal";
import timeDiff from "../utils/timeDiff";
const initialData: PagingAndSortResponse<Driver> = {
  data: [],
  skip: 0,
  take: 10,
  total: 0,
  order: "asc",
  sort: "id",
};

const DriverList = () => {
  const [driver, setDriver] = useState<Driver>();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<GetDriversPagingAndSortDto>(initialData);
  const { data, isFetching, refetch } = useQuery({
    queryFn: () => driverApi.getAll(query),
    initialData,
    queryKey: ["get-drivers", query.order, query.sort, query.skip, query.take],
    refetchOnWindowFocus: false,
  });
  const columns: ColumnsType<Driver> = useMemo(
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
        title: "Avatar",
        key: "avatar",
        dataIndex: "avatar",
        width: 80,
        render: (avatar: string) => (
          <Avatar
            shape="square"
            icon={<UserOutlined />}
            src={avatar ?? "https://i.pravatar.cc/300"}
            size={60}
            alt="avatar"
          />
        ),
      },
      {
        title: "Email",
        key: "email",
        dataIndex: "email",
      },
      {
        title: "Họ tên",
        key: "fullName",
        dataIndex: "fullName",
      },
      {
        title: "Điện thoại",
        key: "phone",
        dataIndex: "phone",
      },
      {
        title: "Trạng thái nhận chuyến",
        key: "status",
        dataIndex: "status",
        width: 200,
        render: (status: DriverStatus) => {
          switch (status) {
            case "OFFLINE":
              return (
                <Badge
                  status="error"
                  text={<span className="text-[#ff4d4f]">Ngoại tuyến</span>}
                />
              );
            case "BUSY":
              return (
                <Badge
                  status="warning"
                  text={<span className="text-[#faad14]">Đang bận</span>}
                />
              );
            case "AVAILABLE":
              return (
                <Badge
                  status="processing"
                  color="green"
                  text={<span className="text-[#52c41a]">Trực tuyến</span>}
                />
              );
            default:
              break;
          }
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
              title={<p className="text-slate-950">{formated}</p>}
            >
              {diff}
            </Tooltip>
          );
        },
      },
      {
        title: "Trạng thái",
        key: "activateStatus",
        dataIndex: "activateStatus",
        width: 200,
        render: (status: ActivateStatus) => {
          return (
            <Typography.Text
              type={
                status === "BLOCKED"
                  ? "warning"
                  : status === "ACTIVATED"
                  ? "success"
                  : "danger"
              }
            >
              {status === "ACTIVATED" ? (
                <Tag color="success">Đã kích hoạt</Tag>
              ) : (
                <Tag color="error">Đã chặn</Tag>
              )}
            </Typography.Text>
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
                onClick={() => {
                  setDriver(record);
                  setOpen(true);
                }}
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [],
  );
  return (
    <Space
      className="w-full h-full"
      direction="vertical"
    >
      <div className="flex gap-2">
        <StatisticBar
          onSelect={(status) => {
            setQuery((prv) => ({
              ...prv,
              skip: 0,
              status: status ? [status] : [],
            }));
          }}
        />
      </div>

      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={data.data}
        loading={isFetching}
        scroll={{ scrollToFirstRowOnChange: false, y: 450, x: 1000 }}
        onChange={(pagination) => {
          setQuery({
            ...query,
            skip:
              (pagination.current || 1) * (pagination.pageSize || 10) -
              (pagination.pageSize || 10),
            take: pagination.pageSize || 10,
          });
        }}
        pagination={{
          pageSize: data.take,
          total: data.total,
          current: data.skip / data.take + 1,
          responsive: false,
          showTotal: (total, [from, to]) => (
            <>
              {from}-{to} trên tổng <b>{total}</b> tài xế
            </>
          ),
        }}
      />
      {driver && (
        <DriverDetailModal
          driverId={driver.id}
          open={open}
          onRequestClose={() => setOpen(false)}
          onChange={() => void refetch()}
          hasStatistic
        />
      )}
    </Space>
  );
};

export default DriverList;
