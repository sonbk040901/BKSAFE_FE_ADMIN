import { Button, Checkbox, Form } from "antd";
import FormTitle from "../../components/auth/FormTitle";
import Input from "../../components/auth/Input";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../api";
import { useAppDispatch } from "../../states";
import { patchAccount } from "../../states/slices/account";
import { Link } from "react-router-dom";
type LoginValues = {
  email: string;
  password: string;
};
const Login = () => {
  const dispatch = useAppDispatch();
  const [rememberMe, setRememberMe] = useState(false);
  const { mutateAsync } = useMutation({
    mutationFn: async (values: LoginValues) => {
      await authApi.login(values);
      return authApi.getProfile();
    },
  });
  const [form] = Form.useForm();
  const handleFinish = (values: LoginValues) => {
    mutateAsync(values)
      .then((user) => {
        dispatch(patchAccount(user));
      })
      .catch(console.error);
  };
  return (
    <Form
      form={form}
      className="p-3"
      onFinish={handleFinish}
      autoComplete="off"
      layout="vertical"
    >
      <FormTitle
        title="login"
        subTitle={
          <>
            <div>Chào mừng đến với hệ thống tìm kiếm tài xế lái xe hộ</div>
            <div>Hãy đăng nhập để sử dụng dịch vụ.</div>
          </>
        }
      />
      <div className="flex flex-col">
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true }]}
        >
          <Input type="email" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true }]}
        >
          <Input type="password" />
        </Form.Item>
        <Form.Item
          name="remember"
          valuePropName="checked"
        >
          <Checkbox
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          >
            Nhớ tài khoản
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            type="primary"
            className="w-full"
          >
            Đăng nhập
          </Button>
        </Form.Item>
        <div className="text-center">
          Bạn chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </div>
      </div>
    </Form>
  );
};

export default Login;
