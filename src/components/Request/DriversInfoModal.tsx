import { FC } from "react";
import { Driver } from "../../types";
import { Avatar, Modal, ModalProps, Table } from "antd";

interface DriversInfoModalProps extends ModalProps {
  drivers?: Driver[];
}

const DriversInfoModal: FC<DriversInfoModalProps> = ({ drivers, ...props }) => {
  return (
    <Modal
      {...props}
      open={!!drivers}
      footer={null}
      title={
        <h1 className="text-zinc-950 mb-3">
          {drivers?.length} suggested drivers
        </h1>
      }
      width={1000}
    >
      <Table
        dataSource={drivers}
        columns={[
          {
            title: "Avatar",
            key: "avatar",
            dataIndex: "avatar",
            render: (avatar: string) => (
              <Avatar
                size={50}
                src={
                  avatar ||
                  "https://demoda.vn/wp-content/uploads/2022/08/hinh-anh-avatar-nu-de-thuong.jpg"
                }
                alt="avatar"
              />
            ),
          },
          {
            title: "Fullname",
            key: "fullname",
            dataIndex: "fullname",
          },
          {
            title: "Phone",
            key: "phone",
            dataIndex: "phone",
          },
          {
            title: "Email",
            key: "email",
            dataIndex: "email",
          },
          {
            title: "Birthday",
            key: "birthday",
            dataIndex: "birthday",
            render: (birthday: string) => {
              const date = new Date(birthday);
              return date.toLocaleDateString("vi-VN");
            },
          },
          {
            title: "Star average",
            key: "starAvg",
            dataIndex: "starAvg",
            sorter: (a: Driver, b: Driver) => a.starAvg - b.starAvg,
          },
        ]}
      />
    </Modal>
  );
};

export default DriversInfoModal;
