import { Layout } from "antd";
import { Navigate } from "react-router-dom";
import Content from "../components/MainLayout/Content";
import Slider from "../components/MainLayout/Slider";
import { useAppSelector } from "../states";
import { selectAccountInfo } from "../states/slices/account";
import { useEffect } from "react";
import { bookingSocket } from "../socket";
import Header from "../components/MainLayout/Header";
const MainLayout = () => {
  const account = useAppSelector(selectAccountInfo);
  useEffect(() => {
    if (!account) return;
    return bookingSocket.connect();
  }, [account]);
  if (!account) return <Navigate to="/login" />;
  return (
    <Layout
      className="rounded-md overflow-hidden gap-2 h-screen"
      hasSider
    >
      <Slider />
      <Layout className="gap-3 bg-transparent">
        <Header />
        <Content />
      </Layout>
    </Layout>
  );
};

export default MainLayout;
