import { Card, Layout } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
// import type { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";
import bg from "../assets/images/bg.jpg";
import { useAppSelector } from "../states";
const AuthLayout = () => {
  const account = useAppSelector((state) => state.account.info);
  if (account) return <Navigate to="/" />;
  return (
    <Layout
      className="h-screen w-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <Header className="bg-transparent h-10 flex justify-between items-center" />
      <Content className="grid place-items-center">
        <Card className="min-w-[500px] bg-white/50 backdrop-blur-sm">
          <Outlet />
        </Card>
      </Content>
      <Footer className="bg-transparent h-10" />
    </Layout>
  );
};

export default AuthLayout;
