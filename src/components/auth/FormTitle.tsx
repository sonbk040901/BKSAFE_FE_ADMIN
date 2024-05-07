import { Typography } from "antd";
import type { FC } from "react";
const { Title, Text } = Typography;

interface FormTitleProps {
  title: string;
  subTitle: string | JSX.Element;
}

const FormTitle: FC<FormTitleProps> = (props) => {
  const { title, subTitle } = props;
  return (
    <div className="mb-9">
      <Title className="capitalize text-center">
        <span className="text-white text-6xl">{title}</span>
      </Title>
      <Text className="text-center font-medium text-base text-gray-700">{subTitle}</Text>
    </div>
  );
};

export default FormTitle;
