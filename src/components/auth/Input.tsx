import {
  EyeInvisibleOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Input as BaseInput } from "antd";
import { ComponentProps, useState, type FC } from "react";
const getIcon = (type: InputType) => {
  const icons = {
    phone: <UserOutlined />,
    password: <LockOutlined />,
    text: <InfoCircleOutlined />,
  };
  return icons[type];
};

type InputType = "phone" | "password" | "text";
interface InputProps extends ComponentProps<typeof BaseInput> {
  type?: InputType;
}

const Input: FC<InputProps> = (props) => {
  const { type = "text", ...rest } = props;
  const [iType, setIType] = useState(type);
  const handleToggle = () => {
    setIType((prev) => (prev === "password" ? "text" : "password"));
  };
  return (
    <BaseInput
      {...rest}
      prefix={getIcon(type)}
      suffix={
        type === "password" ? (
          iType === "password" ? (
            <EyeInvisibleOutlined
              className="text-gray-500"
              onClick={handleToggle}
            />
          ) : (
            <EyeOutlined
              className="text-gray-500"
              onClick={handleToggle}
            />
          )
        ) : undefined
      }
      size="middle"
      type={iType}
    />
  );
};

export default Input;
