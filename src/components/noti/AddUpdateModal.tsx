import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Image,
  Input,
  Modal,
  ModalProps,
  Select,
  Space,
  message,
} from "antd";
import { useEffect, useState, type FC } from "react";
import { Notification } from "../../api/types";
import { notificationApi, uploadImg } from "../../api";

interface AddUpdateModalProps extends ModalProps {
  noti: Notification | null | undefined;
  onOk?: () => void;
}

type NotificationForm = Partial<Omit<Notification, "createdAt" | "updatedAt">>;

const initState: NotificationForm = {
  target: "ALL",
};

const AddUpdateModal: FC<AddUpdateModalProps> = (props) => {
  const [file, setFile] = useState<File>();
  const { noti } = props;
  const [notification, setNotification] = useState<NotificationForm>(initState);
  const [loading, setLoading] = useState(false);
  const [mess, messContext] = message.useMessage();
  useEffect(() => {
    setNotification(noti ?? initState);
    setFile(undefined);
  }, [noti, noti?.id]);
  useEffect(() => {
    if (file) {
      setNotification((notification) => ({
        ...notification,
        image: URL.createObjectURL(file),
      }));
    }
  }, [file]);
  const handleOk = async () => {
    setLoading(true);
    const imgUrl = file ? await uploadImg(file) : notification.image;
    const newNotification = { ...notification, image: imgUrl };
    await (notification.id
      ? handleUpdate(newNotification)
      : handleCreate(newNotification));
    setLoading(false);
    props.onOk?.();
  };
  const handleCreate = async (data: NotificationForm) => {
    await notificationApi.create(data);
    void mess.success("Thêm thông báo thành công");
  };
  const handleUpdate = async (data: NotificationForm) => {
    await notificationApi.update(data as Notification);
    void mess.success("Cập nhật thông báo thành công");
  };
  console.log(notification);

  return (
    <Modal
      {...props}
      title={`${noti ? "Sửa thông báo" : "Thêm thông báo"}${
        notification.id || 0
      }`}
      open={noti !== null}
      width={800}
      okText={noti ? "Lưu" : "Thêm"}
      cancelText="Hủy"
      onOk={() => void handleOk()}
      okButtonProps={{ loading }}
    >
      {messContext}
      <div className="flex gap-4">
        <Space
          direction="vertical"
          className="items-center"
        >
          <Image
            src={notification.image}
            width={250}
            height={200}
            placeholder="Chọn ảnh"
          />
          <Button
            icon={<UploadOutlined />}
            type="dashed"
          >
            <label htmlFor="image">Tải ảnh lên</label>
          </Button>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setFile(file);
              }
            }}
            hidden
          ></input>
        </Space>
        <div className="flex-1">
          <Form.Item
            label="Tiêu đề"
            layout="vertical"
          >
            <Input
              type="text"
              placeholder="Tiêu đề"
              value={notification.title}
              onChange={(e) =>
                setNotification({ ...notification, title: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item
            label="Nội dung"
            layout="vertical"
          >
            <Input.TextArea
              placeholder="Nội dung"
              value={notification.content}
              onChange={(e) =>
                setNotification({ ...notification, content: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item
            label="Đối tượng"
            layout="vertical"
          >
            <Select
              value={notification.target}
              options={[
                {
                  value: "ALL",
                  label: "Tất cả",
                },
                {
                  value: "DRIVER",
                  label: "Tài xế",
                },
                {
                  value: "USER",
                  label: "Người dùng",
                },
              ]}
              onChange={(target) =>
                setNotification({ ...notification, target })
              }
            />
          </Form.Item>
        </div>
      </div>
    </Modal>
  );
};

export default AddUpdateModal;
