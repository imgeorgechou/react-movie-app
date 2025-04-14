import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { Details } from "./pages/Details.jsx";

// 創建路由配置
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/details/:id",
    element: <Details />,
  },
]);
