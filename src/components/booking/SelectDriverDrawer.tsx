import {
  AimOutlined,
  PhoneOutlined,
  ReloadOutlined,
  StarFilled,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Carousel,
  Divider,
  Drawer,
  Modal,
  Space,
  Typography,
  message,
} from "antd";
import Link from "antd/es/typography/Link";
import { type ComponentProps, type FC } from "react";
import { bookingApi } from "../../api";
import { PagingAndSortResponse, SuggestDriver } from "../../api/types";
function* chunks<T>(arr: T[], n: number): Generator<T[], void> {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n);
  }
}

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
  onReject?: () => void;
}

const SelectDriverDrawer: FC<SelectDriverDrawerProps> = (props) => {
  const { bookingId, onClose, onReject } = props;
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
      title="Danh sách tài xế theo độ ưu tiên"
      width={450}
      {...props}
    >
      {contextHolder}
      {modalContext}
      <div className="flex flex-col h-full gap-2">
        <Carousel
          arrows
          draggable
          className="cursor-grab"
        >
          {[...chunks(data, 5)].map((data, i) => (
            <div
              key={i}
              className="space-y-3 pr-3"
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
            </div>
          ))}
        </Carousel>
        <div className="text-end space-x-2 pb-2">
          <Button
            icon={<ReloadOutlined />}
            onClick={() => void refetch()}
            type="primary"
            className=""
          >
            Làm mới
          </Button>
          <Button
            icon={<CloseCircleOutlined />}
            onClick={() => {
              if (!bookingId) return;
              modal.confirm({
                title: "Từ chối yêu cầu",
                icon: null,
                content: (
                  <p>Bạn có chắc chắn muốn từ chối yêu cầu này không?</p>
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
                    .rejectBooking(bookingId)
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
            }}
            type="dashed"
          >
            Từ chối
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default SelectDriverDrawer;
