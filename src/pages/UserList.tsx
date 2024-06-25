import { EyeOutlined, UserOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Image,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { userApi } from "../api";
import { ActivateStatus, PagingAndSortResponse, User } from "../api/types";
import { GetAllPagingAndSortDto } from "../api/user";
import StatisticBar from "../components/user/StatisticBar";
import UserDetailModal from "../components/user/UserDetailModal";
import timeDiff from "../utils/timeDiff";
const initialData: PagingAndSortResponse<User> = {
  data: [],
  skip: 0,
  take: 10,
  total: 0,
  order: "asc",
  sort: "id",
};

const UserList = () => {
  const [query, setQuery] = useState<GetAllPagingAndSortDto>(initialData);
  const [user, setUser] = useState<User>();
  const [open, setOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string>();
  const { data, isFetching, refetch } = useQuery({
    queryFn: () => userApi.getAll(query),
    initialData,
    queryKey: ["users", query],
    refetchOnWindowFocus: false,
  });
  const columns: ColumnsType<User> = [
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
          src={"https://i.pravatar.cc/300"}
          size={60}
          alt="avatar"
          className="cursor-pointer"
          onClick={() => setPreviewSrc(avatar ?? "https://i.pravatar.cc/900")}
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
      key: "isActivated",
      dataIndex: "activateStatus",
      render: (activateStatus: ActivateStatus) => {
        return (
          <Tag
            color={
              activateStatus === "ACTIVATED"
                ? "green"
                : activateStatus === "BLOCKED"
                ? "red"
                : "orange"
            }
            children={
              <Typography.Text
                type={
                  activateStatus === "ACTIVATED"
                    ? "success"
                    : activateStatus === "BLOCKED"
                    ? "danger"
                    : "warning"
                }
              >
                {activateStatus === "ACTIVATED"
                  ? "Đã kích hoạt"
                  : activateStatus === "BLOCKED"
                  ? "Đã chặn"
                  : "Chưa kích hoạt"}
              </Typography.Text>
            }
          />
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
                setUser(record);
                setOpen(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
  return (
    <Space
      className="w-full h-full relative"
      direction="vertical"
    >
      <div className="flex gap-2">
        <span className="absolute top-0 left-0">
          <Image
            preview={{
              visible: !!previewSrc,
              src: previewSrc,
              onVisibleChange: (visible) => {
                if (!visible) setPreviewSrc(undefined);
              },
            }}
          />
        </span>
        <StatisticBar
          onSelect={(isActivated) => {
            setQuery((prv) => ({
              ...prv,
              skip: 0,
              isActivated: isActivated ? [isActivated] : [],
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
        onChange={(pagination, filters) => {
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
              {from}-{to} trên tổng <b>{total}</b> người dùng
            </>
          ),
        }}
      />
      {user && (
        <UserDetailModal
          driverId={user.id}
          open={open}
          onRequestClose={() => setOpen(false)}
          onChange={() => void refetch()}
          hasStatistic
        />
      )}
    </Space>
  );
};

export default UserList;
