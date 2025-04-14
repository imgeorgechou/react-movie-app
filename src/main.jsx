import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider, Routes } from "react-router-dom";
import { router } from "./Router.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* 路由寫法 */}
    <RouterProvider router={router} />
  </StrictMode>
);
