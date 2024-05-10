import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import Loader from "../components/Loader";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import {
  BreadcrumbItemType,
  BreadcrumbSeparatorType,
} from "antd/es/breadcrumb/Breadcrumb";
const MainLayout = Loader(
  lazy(async () => import("../layouts/MainLayout")),
  "App",
);
const RequestList = Loader(lazy(async () => import("../pages/RequestList")));
const DashBoard = Loader(lazy(async () => import("../pages/DashBoard")));
const Router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "", element: <DashBoard /> },
      {
        path: "bookings",
        element: <RequestList />,
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
]);
export const breadCrumb = [
  { path: "/", breadcrumbName: "Home", title: "Trang chủ" },
  { path: "/bookings", breadcrumbName: "Requests", title: "Yêu cầu" },
];
export default Router;
