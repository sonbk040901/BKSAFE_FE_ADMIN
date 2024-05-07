import { Layout } from "antd";
import Slider from "../components/MainLayout/Slider";
import Header from "../components/MainLayout/Header";
import Content from "../components/MainLayout/Content";
import Footer from "../components/MainLayout/Footer";
import { useAppSelector } from "../states";
import { Navigate } from "react-router-dom";
const MainLayout = () => {
  const account = useAppSelector((state) => state.account.info);
  if (!account) return <Navigate to="/login" />;
  return (
    <div className="w-full h-[100vh] grid place-items-center bg-[#b5c2c9]">
      <Layout
        className="w-11/12 h-[90vh] rounded-md overflow-hidden bg-transparent gap-3"
        hasSider
      >
        <Slider />
        <Layout className="gap-3 bg-transparent">
          <Header />
          <Content />
          <Footer />
        </Layout>
      </Layout>
    </div>
  );
};

export default MainLayout;
