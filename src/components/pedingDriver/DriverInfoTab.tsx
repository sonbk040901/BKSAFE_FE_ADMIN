import type { FC } from "react";
import { Driver } from "../../api/types";
import { Form, Input, Space } from "antd";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DriverInfoTabProps {
  data: Driver;
}

const DriverInfoTab: FC<DriverInfoTabProps> = ({ data }) => {
  const { fullName, phone } = data;
  return (
    <Space>
      <Form.Item
        layout="vertical"
        label="Họ và tên"
      >
        <Input
          size="large"
          readOnly
          value={fullName}
        />
      </Form.Item>
      <Form.Item
        layout="vertical"
        label="Họ và tên"
      >
        <Input
          size="large"
          readOnly
          value={fullName}
        />
      </Form.Item>
    </Space>
  );
};

export default DriverInfoTab;
