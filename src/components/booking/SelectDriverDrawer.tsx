import { CloseCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Carousel, Drawer, Modal, message } from "antd";
import { type ComponentProps, type FC } from "react";
import { bookingApi } from "../../api";
import { PagingAndSortResponse, SuggestDriver } from "../../api/types";
import SuggestDriverItem from "./SuggestDriver";
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
  onChange?: () => void;
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
          {[...chunks(data, 5)].map((data) => (
            <div
              key={null}
              className="space-y-3 pr-3"
            >
              {data.map((driver) => (
                <SuggestDriverItem
                  key={driver.id}
                  driver={driver}
                  onSelect={handleSelect}
                />
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
                      void messageApi.success({
                        key,
                        content: "Từ chối thành công",
                      });
                      onReject?.();
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
