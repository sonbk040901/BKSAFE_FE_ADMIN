import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import Loader from "../components/Loader";
import AuthLayout from "../layouts/AuthLayout";
import DriverList from "../pages/DriverList";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
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
      {
        path: "drivers",
        element: <DriverList />,
      }
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
