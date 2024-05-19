import { Layout } from "antd";
import { Navigate } from "react-router-dom";
import Content from "../components/MainLayout/Content";
import Header from "../components/MainLayout/Header";
import Slider from "../components/MainLayout/Slider";
import { useAppSelector } from "../states";
import { selectAccountInfo } from "../states/slices/account";
const MainLayout = () => {
  const account = useAppSelector(selectAccountInfo);
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
