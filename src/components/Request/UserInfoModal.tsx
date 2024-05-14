import { PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Modal, ModalProps, Space } from "antd";
import { FC } from "react";
import { User } from "../../api/types";
import Female from "../../icons/Female";
import Male from "../../icons/Male";
import OtherGender from "../../icons/OtherGender";
import Info from "./Info";
interface UserInfoModalProps extends ModalProps {
  user?: User;
}

const UserInfoModal: FC<UserInfoModalProps> = ({ user, ...props }) => {
  const { email, fullName, phone, username, avatar, gender } = user || {};
  const renderGender = (gender: User["gender"]) => {
    return (
      <span className="w-7 aspect-square border-slate-500 border-[1px] border-solid bg-slate-100 rounded-full grid place-items-center">
        {gender === "MALE" ? (
          <Male
            color="hotpink"
            size={17}
          />
        ) : gender === "FEMALE" ? (
          <Female
            color="hotpink"
            size={17}
          />
        ) : (
          <OtherGender
            color="hotpink"
            size={17}
          />
        )}
      </span>
    );
  };
  return (
    <Modal
      {...props}
      open={!!user}
      footer={
        <Space>
          <Button
            icon={<PhoneOutlined />}
            onClick={() => {
              window.open(`tel:${user?.phone || ""}`);
            }}
            type="dashed"
          >
            Gọi
          </Button>
        </Space>
      }
      title={`Thông tin người dùng ${username || ""}`}
    >
      <Space
        direction="horizontal"
        className="w-full"
        size={20}
      >
        <div className="w-full h-full flex justify-center">
          <Badge
            count={renderGender(gender || "OTHER")}
            offset={[-3, 3]}
            color="magenta"
          >
            <Avatar
              shape="square"
              icon={<UserOutlined />}
              src={
                avatar ||
                "https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png"
              }
              className="border-2 border-red-950"
              size={150}
              alt="avatar"
            />
          </Badge>
        </div>
        <Space
          direction="vertical"
          className="w-full"
        >
          <Info
            title="Username"
            value={username || ""}
          />
          <Info
            title="Họ tên"
            value={fullName || ""}
          />
          <Info
            title="Email"
            value={email || ""}
          />
          <Info
            title="điện thoại"
            value={phone || ""}
          />
        </Space>
      </Space>
    </Modal>
  );
};

export default UserInfoModal;
