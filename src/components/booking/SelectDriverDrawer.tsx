import {
  AimOutlined,
  ReloadOutlined,
  StarFilled,
  PhoneOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Drawer,
  Modal,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import Link from "antd/es/typography/Link";
import { type ComponentProps, type FC } from "react";
import { bookingApi } from "../../api";
import { PagingAndSortResponse, SuggestDriver } from "../../api/types";
import { useNavigate } from "react-router-dom";
const initialData: PagingAndSortResponse<SuggestDriver> = {
  data: [],
  skip: 0,
  take: 10,
  total: 0,
  order: "asc",
  sort: "id",
};
interface SelectDriverDrawerProps extends ComponentProps<typeof Drawer> {
  bookingId?: number;
  onClose?: () => void;
}

const SelectDriverDrawer: FC<SelectDriverDrawerProps> = (props) => {
  const { bookingId, onClose } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const [modal, modalContext] = Modal.useModal();
  const { data: dto, refetch } = useQuery({
    queryFn: async () => {
      if (bookingId) return bookingApi.getSuggestDrivers(bookingId);
      return initialData;
    },
    queryKey: ["suggestDrivers", bookingId],
    enabled: !!bookingId,
    initialData,
    refetchOnWindowFocus: false,
  });
  const { mutateAsync } = useMutation({
    mutationFn: async ({
      driverId,
      bookingId,
    }: {
      driverId: number;
      bookingId: number;
    }) => bookingApi.suggestDriver(bookingId, driverId),
  });
  const { data } = dto;
  const handleSelect = (driverId: number) => {
    if (!bookingId) return;
    modal.confirm({
      title: "Xác nhận chọn tài xế",
      icon: null,
      content: <p> Bạn có chắc chắn muốn chọn tài xế này? </p>,
      okText: "Từ chối",
      cancelText: "Hủy",
      onOk: () => {
        const key = "suggestDriver";
        void messageApi.loading({ content: "Đang chọn tài xế...", key });
        mutateAsync({ bookingId, driverId })
          .then(() => {
            void messageApi.success({ content: "Chọn tài xế thành công", key });
            onClose?.();
          })
          .catch(() => {
            void messageApi.error({ content: "Chọn tài xế thất bại", key });
          });
      },
    });
  };
  return (
    <Drawer
      open={!!bookingId}
      title="Chọn tài xế cho chuyến đi"
      {...props}
    >
      {contextHolder}
      {modalContext}
      <Space
        direction="vertical"
        className="w-full"
      >
        {data.map((driver) => (
          <Badge.Ribbon
            key={driver.id}
            color={
              driver.priority > 0.9
                ? "green"
                : driver.priority > 0.7
                ? "blue"
                : driver.priority > 0.5
                ? "orange"
                : "red"
            }
            text={`${(
              (driver.priority > 1 ? 1 : driver.priority) * 100
            ).toFixed(1)}%`}
          >
            <Card
              size="small"
              className="shadow-sm"
            >
              <div className="flex gap-2 items-center">
                <Avatar
                  size={46}
                  // src={driver.avatar ?? "https://i.pravatar.cc/300"}
                  src={"https://i.pravatar.cc/300"}
                />
                <Space
                  direction="vertical"
                  className="flex-1"
                >
                  <div className="flex gap-2">
                    <Typography className="font-semibold">
                      {driver.username}
                    </Typography>
                    <span className="text-yellow-500">
                      {driver.rating} <StarFilled />
                    </span>
                  </div>
                  <Link>{driver.fullName}</Link>
                </Space>
                <p className="self-end flex gap-1">
                  <AimOutlined className="text-pink-400" />
                  <span>{(driver.distance / 1000).toFixed(2)} km</span>
                </p>
              </div>
              <Divider className="m-2" />
              <div className="flex justify-end gap-2">
                <Button
                  type="primary"
                  onClick={() => handleSelect(driver.id)}
                >
                  Chọn
                </Button>
                <Button
                  type="dashed"
                  icon={<PhoneOutlined />}
                  onClick={() => {
                    window.open(`tel:${driver.phone}`);
                  }}
                >
                  Gọi
                </Button>
              </div>
            </Card>
          </Badge.Ribbon>
        ))}
      </Space>
      <Button
        icon={<ReloadOutlined />}
        onClick={() => void refetch()}
        type="primary"
        className="fixed bottom-4 right-4"
      >
        Làm mới
      </Button>
    </Drawer>
  );
};

export default SelectDriverDrawer;
