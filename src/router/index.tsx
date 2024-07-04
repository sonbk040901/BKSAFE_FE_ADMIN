import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import Loader from "../components/Loader";
import AuthLayout from "../layouts/AuthLayout";
import DriverList from "../pages/DriverList";
import NotificationList from "../pages/NotificationList";
const MainLayout = Loader(
  lazy(async () => import("../layouts/MainLayout")),
  "App",
);
const RequestList = Loader(lazy(async () => import("../pages/RequestList")));
const DashBoard = Loader(lazy(async () => import("../pages/DashBoard")));
const Login = Loader(lazy(async () => import("../pages/auth/Login")));
const Register = Loader(lazy(async () => import("../pages/auth/Register")));
const UserList = Loader(lazy(async () => import("../pages/UserList")));
const PendingDriverList = Loader(
  lazy(async () => import("../pages/PendingDriverList")),
);
const DriverDetail = Loader(lazy(async () => import("../pages/DriverDetail")));
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
      {
        path: "drivers",
        element: <DriverList />,
      },
      {
        path: "users",
        element: <UserList />,
      },
      {
        path: "pending-drivers",
        children: [
          {
            path: "",
            element: <PendingDriverList />,
          },
          {
            path: ":id",
            element: <DriverDetail />,
          },
        ],
      },
      {
        path: "notifications",
        element: <NotificationList />,
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
export default Router;
