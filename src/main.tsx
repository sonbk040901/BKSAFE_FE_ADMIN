import React from "react";
import ReactDOM from "react-dom/client";
import {
  ConfigProvider,
  // Watermark
} from "antd";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import App from "./App.tsx";
import "./index.css";
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider theme={{ token: { colorPrimary: "#ff69b4" } }}>
      {/* <Watermark content={["BKSafe App", "App for admin"]}> */}
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
      {/* </Watermark> */}
    </ConfigProvider>
  </React.StrictMode>,
);
