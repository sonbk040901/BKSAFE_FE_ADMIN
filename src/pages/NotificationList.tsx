import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Image, Space, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { notificationApi } from "../api";
import { Notification } from "../api/types";
import Tooltip from "../components/common/Tooltip";
import timeDiff from "../utils/timeDiff";
import AddUpdateModal from "../components/noti/AddUpdateModal";

const NotificationList = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationApi.getAll,
  });
  const [noti, setNoti] = useState<Notification | null | undefined>(null);
  const columns: ColumnsType<Notification> = [
    {
      title: "STT",
      key: "id",
      dataIndex: "id",
      width: 60,
      render: (_, record, i) => {
        return <Tooltip title={`id: ${record.id}`}>{i + 1}</Tooltip>;
      },
    },
    {
      title: "Tiêu đề",
      key: "title",
      dataIndex: "title",
    },
    {
      title: "Nội dung",
      key: "content",
      dataIndex: "content",
    },
    {
      title: "Hình ảnh",
      key: "image",
      dataIndex: "image",
      render: (image: string) => {
        return (
          <Image
            src={image}
            width={60}
            height={60}
          />
        );
      },
    },
    {
      title: "Đối tượng",
      key: "target",
      dataIndex: "target",
      render: (target: Notification["target"]) => {
        return (
          <Tag
            color={
              target === "DRIVER" ? "blue" : target === "USER" ? "cyan" : "gold"
            }
          >
            {target === "DRIVER"
              ? "Tài xế"
              : target === "USER"
              ? "Người dùng"
              : "Tất cả"}
          </Tag>
        );
      },
    },
    {
      title: "Ngày tạo",
      key: "createdAt",
      dataIndex: "createdAt",
      render: (createdAt: string | Date) => {
        const [diff, formated] = timeDiff(createdAt);
        return (
          <Tooltip
            title={formated}
            children={diff}
          />
        );
      },
    },
    {
      title: "Ngày cập nhật",
      key: "updatedAt",
      dataIndex: "updatedAt",
      render: (updatedAt: string | Date) => {
        const [diff, formated] = timeDiff(updatedAt);
        return (
          <Tooltip
            title={formated}
            children={diff}
          />
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: 100,
      render: (_, record) => {
        return (
          <Space>
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleView(record)}
            >
              Sửa
            </Button>
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => void handleDelete(record.id)}
            >
              Xóa
            </Button>
          </Space>
        );
      },
    },
  ];
  const handleView = (record?: Notification) => {
    setNoti(record);
  };
  const handleCancel = () => {
    setNoti(null);
  };
  const handleOke = () => {
    void refetch();
    setNoti(null);
  };
  const handleDelete = async (id: number) => {
    await notificationApi.remove(id);
    void refetch();
  };
  return (
    <Space
      direction="vertical"
      className="w-full"
    >
      <div className="p-2">
        <Button
          size="large"
          icon={<PlusOutlined />}
          type="default"
          onClick={() => handleView()}
        >
          Thêm thông báo
        </Button>
      </div>
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={data?.data}
      />
      <AddUpdateModal
        noti={noti}
        onCancel={handleCancel}
        onOk={handleOke}
      />
    </Space>
  );
};

export default NotificationList;
