import { Button, Checkbox, Form } from "antd";
import FormTitle from "../../components/auth/FormTitle";
import Input from "../../components/auth/Input";
import { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
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
        <Input type="email" />
        <Input type="password" />
        <Checkbox
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        >
          Nhớ tài khoản
        </Checkbox>
        <Button type="primary">Đăng nhập</Button>
        <div className="text-center">
          Bạn đã có tài khoản? <Link to='/login'>Đăng nhập ngay</Link>
        </div>
      </div>
    </Form>
  );
};

export default Register;
