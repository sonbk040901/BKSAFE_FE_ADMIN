import { Layout } from "antd";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import Content from "../components/MainLayout/Content";
import Header from "../components/MainLayout/Header";
import Slider from "../components/MainLayout/Slider";
import { useAppDispatch, useAppSelector } from "../states";
import { selectAccountInfo } from "../states/slices/account";
import { connect, disconnect } from "../states/slices/socket";
const MainLayout = () => {
  const account = useAppSelector(selectAccountInfo);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!account) return;
    dispatch(connect());
    return () => {
      dispatch(disconnect());
    };
  }, [account, dispatch]);
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
