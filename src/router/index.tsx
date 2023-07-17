import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import Loader from "../components/Loader";
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
      { path: "/", element: <DashBoard /> },
      {
        path: "request",
        element: <RequestList />,
      },
    ],
  },
]);
export default Router;
