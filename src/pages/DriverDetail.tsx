import {
  ArrowLeftOutlined,
  CalendarOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Image,
  Modal,
  Space,
  Tabs,
  TabsProps,
  message,
} from "antd";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { driverApi } from "../api";
import { Driver, RegisterStatus } from "../api/types";
import { FemaleIcon, MaleIcon, OtherGenderIcon } from "../icons";
import IconGenderMaleFemale from "../icons/IconGenderMaleFemale";
import IconLocationPoint from "../icons/IconLocationPoint";
import CccdTab from "../components/pedingDriver/CccdTab";
import LicenseTab from "../components/pedingDriver/LicenseTab";
const renderGender = (gender: Driver["gender"]) => {
  return (
    <span className="w-7 aspect-square border-slate-200 border-[1px] border-solid bg-slate-100 rounded-full grid place-items-center">
      {gender === "MALE" ? (
        <MaleIcon
          color="#007bff"
          size={17}
        />
      ) : gender === "FEMALE" ? (
        <FemaleIcon
          color="hotpink"
          size={17}
        />
      ) : (
        <OtherGenderIcon
          color="hotpink"
          size={17}
        />
      )}
    </span>
  );
};

const DriverDetail = () => {
  const { id: idStr } = useParams<{ id: string }>();
  const id = parseInt(idStr || "");
  const [preview, setPreview] = useState(false);
  const { data, status, refetch } = useQuery({
    queryFn: () => driverApi.getDetail(id),
    queryKey: ["get-driver", id],
    refetchOnWindowFocus: false,
  });
  const [messageApi, contextHolder] = message.useMessage();
  const [modal, modalContext] = Modal.useModal();
  const navigate = useNavigate();
  if (status === "pending") {
    return <div>Loading...</div>;
  }
  if (status === "error") {
    return <div>Không tìm thấy tài xế</div>;
  }
  const tabs: TabsProps["items"] = [
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
  const handleAction =
    (status: RegisterStatus): (() => void) =>
    async () => {
      const actionStr = status === "ACCEPTED" ? "duyệt" : "từ chối";
      const sucess = await modal.confirm({
        title: `Xác nhận ${actionStr}`,
        content: `Bạn có muốn thực hiện ${actionStr} tài xế này không?`,
      });
      if (!sucess) return;
      await driverApi.actionRegister(id, status);
      void messageApi.success(
        <span className="capitalize">{actionStr} thành công</span>,
      );
      await refetch();
    };
  return (
    <div className="w-full h-full p-2 flex flex-col gap-3 overflow-scroll">
      <div className="flex-1 flex flex-row gap-10 items-start">
        <Card className="">
          <Space direction="vertical">
            <span className="text-lg font-semibold">Thông tin tài xế {data.fullName}</span>
            <Badge
              count={renderGender(data.gender)}
              offset={[-12, 12]}
              color="magenta"
            >
              <Avatar
                size={100}
                alt="avatar"
                className="cursor-pointer border border-pink-200"
                src={data.avatar ?? "https://i.pravatar.cc/300"}
                onClick={() => setPreview(true)}
              />
            </Badge>
            <Space>
              <UserOutlined />
              <span className="text-lg font-light">{data.fullName}</span>
            </Space>
            <Space>
              <PhoneOutlined />
              <span className="text-lg font-light">{data.phone}</span>
            </Space>
            <Space>
              <MailOutlined />
              <span className="text-lg font-light">{data.email}</span>
            </Space>
            <Space>
              <IconLocationPoint />
              <span className="text-lg font-light w-52 truncate block">
                {data.address}
              </span>
            </Space>
            <Space>
              <CalendarOutlined />
              <span className="text-lg font-light">
                {new Date(data.birthday).toLocaleDateString("vi")} (
                {new Date().getFullYear() -
                  new Date(data.birthday).getFullYear()}
                )
              </span>
            </Space>
            <Space>
              <IconGenderMaleFemale />
              <span className="text-lg font-light">
                {
                  {
                    MALE: "Nam",
                    FEMALE: "Nữ",
                    OTHER: "Khác",
                  }[data.gender]
                }
              </span>
            </Space>
            <Image
              preview={{
                visible: preview,
                onVisibleChange: (visible) => setPreview(visible),
                src: data.avatar ?? "https://i.pravatar.cc/300",
              }}
            />
            {contextHolder}
            {modalContext}
          </Space>
        </Card>
        <Tabs
          className="flex-1"
          items={tabs}
        />
      </div>
      <Space className="self-end">
        <Button
          type="default"
          size="middle"
          icon={<ArrowLeftOutlined />}
          onClick={() => {
            navigate(-1);
          }}
        >
          Quay lại
        </Button>
        {data.registerStatus !== "ACCEPTED" && (
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
        )}
      </Space>
    </div>
  );
};

export default DriverDetail;
