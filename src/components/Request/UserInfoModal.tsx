import { FC } from "react";
import type { User } from "../../types";
import { Avatar, Modal, ModalProps, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Info from "./Info";
interface UserInfoModalProps extends ModalProps {
  user?: User;
}

const UserInfoModal: FC<UserInfoModalProps> = ({ user, ...props }) => {
  const { email, fullname, phone, username, avatar } = user || {};
  return (
    <Modal
      {...props}
      open={!!user}
      footer={null}
      title={`${fullname || ""}'s Info:`}
    >
      <Space
        direction="horizontal"
        className="w-full"
        size={20}
      >
        <div className="w-full h-full flex justify-center">
          <Avatar
            shape="square"
            icon={<UserOutlined />}
            src={
              avatar ||
              "https://demoda.vn/wp-content/uploads/2022/08/hinh-anh-avatar-nu-de-thuong.jpg"
            }
            size={150}
            alt="avatar"
          />
        </div>
        <Space
          direction="vertical"
          className="w-full"
        >
          {user &&
            Object.entries({ username, fullname, email, phone }).map(
              ([key, value]) => (
                <Info
                  key={key}
                  title={key}
                  value={value || ""}
                />
              ),
            )}
        </Space>
      </Space>
    </Modal>
  );
};

export default UserInfoModal;
