import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import Loader from "../components/Loader";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/auth/Login";
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
        path: "request",
        element: <RequestList />,
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <h1>Register</h1> },
    ],
  },
]);
export default Router;
