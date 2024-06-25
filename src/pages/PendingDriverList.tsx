import { EyeOutlined, UserOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Avatar, Button, Space, Tag, Tooltip, Typography } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useMemo, useState } from "react";
import { driverApi } from "../api";
import { GetDriversPagingAndSortDto } from "../api/driver";
import { Driver, PagingAndSortResponse, RegisterStatus } from "../api/types";
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

const PendingDriverList = () => {
  const [query, setQuery] = useState<GetDriversPagingAndSortDto>(initialData);
  const { data, isFetching } = useQuery({
    queryFn: () => driverApi.getAllRegister(query),
    initialData,
    queryKey: [
      "get-pending-drivers",
      query.order,
      query.sort,
      query.skip,
      query.take,
    ],
    refetchOnWindowFocus: false,
  });
  const [driverId, setDriverId] = useState<number>();
  const [open, setOpen] = useState(false);
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
        render: () => (
          <Avatar
            shape="square"
            icon={<UserOutlined />}
            src={"https://i.pravatar.cc/300"}
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
        key: "registerStatus",
        dataIndex: "registerStatus",
        width: 200,
        render: (status: RegisterStatus) => {
          return (
            <Typography.Text
              type={
                status === "PENDING"
                  ? "warning"
                  : status === "ACCEPTED"
                  ? "success"
                  : "danger"
              }
            >
              {status === "PENDING" ? (
                <Tag color="orange">Chờ duyệt</Tag>
              ) : status === "ACCEPTED" ? (
                <Tag color="success">Đã duyệt</Tag>
              ) : (
                <Tag color="error">Đã từ chối</Tag>
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
                  setDriverId(record.id);
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
        {/* <StatisticBar
          onSelect={(status) => {
            setQuery((prv) => ({
              ...prv,
              skip: 0,
              status: status ? [status] : [],
            }));
          }}
        /> */}
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

      {driverId && (
        <DriverDetailModal
          driverId={driverId}
          open={open}
          onRequestClose={() => setOpen(false)}
        />
      )}
    </Space>
  );
};

export default PendingDriverList;
