import {
  ArrowLeftOutlined,
  CheckOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Image,
  Modal,
  Space,
  Tabs,
  TabsProps,
  message,
} from "antd";
import { useMemo, type FC } from "react";
import { driverApi } from "../../api";
import { ActivateStatus, RegisterStatus } from "../../api/types";
import LicenseTab from "../../components/pedingDriver/LicenseTab";
import InfoItem, { InfoItemProps } from "../booking/InfoItem";
import CccdTab from "../pedingDriver/CccdTab";
import DriverStatistic from "./DriverStatistic";

interface DriverDetailModalProps {
  driverId: number;
  hasStatistic?: boolean;
  onRequestClose?: () => void;
  onChange?: () => void;
  open?: boolean;
}

const DriverDetailModal: FC<DriverDetailModalProps> = (props) => {
  const { driverId, hasStatistic, onRequestClose, onChange, open } = props;
  const { data, status, refetch } = useQuery({
    queryFn: () => driverApi.getDetail(driverId),
    queryKey: ["get-driver", driverId],
    refetchOnWindowFocus: false,
  });
  const [messageApi, contextHolder] = message.useMessage();
  const [modal, modalContext] = Modal.useModal();
  const tabs = useMemo(() => {
    if (!data) return [];
    const info: TabsProps["items"] & object = [
      {
        key: "1",
        label: "Căn cước công dân",
        children: data.cccd ? <CccdTab data={data.cccd} /> : null,
      },
      {
        key: "2",
        label: "Bằng lái xe",
        children: data.license ? <LicenseTab data={data.license} /> : null,
      },
    ];
    if (hasStatistic) {
      info.unshift({
        key: "0",
        label: "Thống kê",
        children: <DriverStatistic driverId={data.id} />,
      });
    }
    return info;
  }, [data, hasStatistic]);
  if (status === "pending") {
    return <div>Loading...</div>;
  }
  if (status === "error") {
    return <div>Không tìm thấy tài xế</div>;
  }
  const infoItems: InfoItemProps[] = [
    { label: "Họ tên", value: data.fullName },
    { label: "Số điện thoại", value: data.phone },
    { label: "Email", value: data.email },
    {
      label: "Ngày sinh",
      value: new Date(data.birthday).toLocaleDateString("vi"),
    },
    {
      label: "Giới tính",
      value: (
        <>
          {
            {
              MALE: "Nam",
              FEMALE: "Nữ",
              OTHER: "Khác",
            }[data.gender]
          }
        </>
      ),
    },
    {
      label: "Địa chỉ",
      value: <div className="w-44 text-right">{data.address}</div>,
    },
  ];
  const handleAction =
    (status: RegisterStatus): (() => void) =>
    async () => {
      const actionStr = status === "ACCEPTED" ? "duyệt" : "từ chối";
      const sucess = await modal.confirm({
        title: `Xác nhận ${actionStr}`,
        content: `Bạn có muốn thực hiện ${actionStr} tài xế này không?`,
      });
      if (!sucess) return;
      await driverApi.actionRegister(driverId, status);
      void messageApi.success(
        <span className="capitalize">{actionStr} thành công</span>,
      );
      await refetch();
      onChange?.();
    };

  const handleActiveAction =
    (status: ActivateStatus): (() => void) =>
    async () => {
      const actionStr = status === "ACTIVATED" ? "bỏ chặn" : "chặn";
      const sucess = await modal.confirm({
        title: `Xác nhận ${actionStr}`,
        content: `Bạn có muốn thực hiện ${actionStr} tài xế này không?`,
      });
      if (!sucess) return;
      await driverApi.actionActivate(driverId, status);
      void messageApi.success(
        <span className="capitalize">{actionStr} thành công</span>,
      );
      await refetch();
      onChange?.();
    };
  return (
    <Modal
      open={open}
      onCancel={onRequestClose}
      width={1350}
      centered
      footer={
        <Space className="self-end">
          <Button
            type="default"
            size="middle"
            icon={<ArrowLeftOutlined />}
            onClick={onRequestClose}
          >
            Quay lại
          </Button>
          {!hasStatistic ? (
            data.registerStatus !== "ACCEPTED" && (
              <>
                <Button
                  type="primary"
                  size="middle"
                  icon={<CheckOutlined />}
                  onClick={handleAction("ACCEPTED")}
                >
                  Duyệt
                </Button>

                {data.registerStatus === "PENDING" && (
                  <Button
                    type="default"
                    size="middle"
                    icon={<CloseCircleOutlined />}
                    onClick={handleAction("REJECTED")}
                  >
                    Từ chối
                  </Button>
                )}
              </>
            )
          ) : (
            <>
              <Button
                color="red"
                type="primary"
                onClick={handleActiveAction(
                  data.activateStatus === "ACTIVATED" ? "BLOCKED" : "ACTIVATED",
                )}
              >
                {data.activateStatus === "ACTIVATED" ? "Chặn" : "Bỏ chặn"}
              </Button>
            </>
          )}
        </Space>
      }
    >
      {/* <div className="w-full h-full p-2 flex flex-col gap-3 overflow-scroll"> */}
      <div className="flex-1 flex gap-10 items-start">
        <Card className="w-[300px]">
          <Space
            direction="vertical"
            className="w-full"
          >
            <span className="text-gray-500 text-lg font-semibold">
              Thông tin tài xế {data.fullName}
            </span>
            <div className="mb-2">
              <Image
                alt="avatar"
                className="cursor-pointer border border-pink-200"
                src={data.avatar ?? "https://i.pravatar.cc/300"}
              />
            </div>
            {infoItems.map((item) => (
              <InfoItem
                key={item.label}
                {...item}
              />
            ))}
            {contextHolder}
            {modalContext}
          </Space>
        </Card>
        <Tabs
          className="flex-1"
          items={tabs}
        />
      </div>
      {/* </div> */}
    </Modal>
  );
};

export default DriverDetailModal;
