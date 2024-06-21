import type { FC } from "react";
import { Driver } from "../../api/types";
import { Form, Image, Input, Space } from "antd";

interface CccdTabProps {
  data: Driver["cccd"];
}

const CccdTab: FC<CccdTabProps> = ({ data }) => {
  const { frontImage, backImage } = data;
  return (
    <div className="w-full">
      <Form.Item
        layout="vertical"
        label="Ảnh chứng minh nhân dân"
      >
        <Space>
          <div className="w-80">
            <Image src={frontImage} />
          </div>
          <div className="w-80">
            <Image src={backImage} />
          </div>
        </Space>
      </Form.Item>
      <div className="flex gap-2">
        <Form.Item
          layout="vertical"
          label="Họ và tên"
          className="flex-1"
        >
          <Input
            readOnly
            value={data.fullName}
          />
        </Form.Item>
        <Form.Item
          layout="vertical"
          label="Ngày sinh"
          className="flex-1"
        >
          <Input
            readOnly
            value={new Date(data.birthday).toLocaleDateString("vi")}
          />
        </Form.Item>
      </div>

      <div className="flex gap-2">
        <Form.Item
          layout="vertical"
          label="Số CMND/Thẻ Căn Cước/Hộ Chiếu"
          className="flex-1"
        >
          <Input
            readOnly
            value={data.number}
          />
        </Form.Item>
        <Form.Item
          layout="vertical"
          label="Nơi cấp"
          className="flex-1"
        >
          <Input
            readOnly
            value={data.address}
          />
        </Form.Item>
      </div>
      <div className="flex gap-2">
        <Form.Item
          layout="vertical"
          label="Ngày cấp"
          className="flex-1 mb-0"
        >
          <Input
            readOnly
            value={new Date(data.issueDate).toLocaleDateString("vi")}
          />
        </Form.Item>
        <Form.Item
          layout="vertical"
          label="Ngày hết hạn"
          className="flex-1 mb-0"
        >
          <Input
            readOnly
            value={new Date(data.expireDate).toLocaleDateString("vi")}
          />
        </Form.Item>
      </div>
    </div>
  );
};

export default CccdTab;
