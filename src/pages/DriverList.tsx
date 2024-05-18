import { EyeOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Badge, Button, Space, Tag, Tooltip, Typography } from "antd";
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
  const [query, setQuery] = useState<GetDriversPagingAndSortDto>(initialData);
  const { data, refetch, isFetching } = useQuery({
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
        title: "Username",
        key: "username",
        dataIndex: "username",
        render: (username: string, record) => (
          <Typography.Link onClick={() => setDriver(record)}>
            {username}
          </Typography.Link>
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
        title: "Trạng thái kích hoạt",
        key: "activateStatus",
        dataIndex: "activateStatus",
        width: 200,
        render: (activateStatus: ActivateStatus) => {
          return (
            <Typography.Text
              type={
                activateStatus === "DEACTIVATED"
                  ? "warning"
                  : activateStatus === "ACTIVATED"
                  ? "success"
                  : "danger"
              }
            >
              {activateStatus === "DEACTIVATED" ? (
                <Tag color="orange">Chờ duyệt</Tag>
              ) : activateStatus === "ACTIVATED" ? (
                <Tag color="success">Đã kích hoạt</Tag>
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
                onClick={() => setDriver(record)}
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
      <h1>Danh sách tài xế</h1>
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
    </Space>
  );
};

export default DriverList;
