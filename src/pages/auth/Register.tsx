import { Button, Checkbox, Form } from "antd";
import FormTitle from "../../components/auth/FormTitle";
import Input from "../../components/auth/Input";
import { useState } from "react";
import Link from "antd/es/typography/Link";

const Login = () => {
  const [rememberMe, setRememberMe] = useState(false);
  return (
    <Form className="p-3">
      <FormTitle
        title="login"
        subTitle={
          <>
            <div>Chào mừng đến với hệ thống tìm kiếm tài xế lái xe hộ</div>
            <div>Hãy đăng nhập để sử dụng dịch vụ.</div>
          </>
        }
      />
      <div className="flex flex-col gap-5 pb-10">
        <Input
          label="Email"
          type="email"
        />
        <Input
          label="Password"
          type="password"
        />
        <Checkbox
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        >
          Nhớ tài khoản
        </Checkbox>
        <Button type="primary">Đăng nhập</Button>
        <div className="text-center">Chưa có tài khoản? <Link>Đăng ký ngay</Link></div>
      </div>
    </Form>
  );
};

export default Login;
