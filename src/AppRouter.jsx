import React from "react";
import { Route, Routes } from "react-router-dom";
import { MainAppRoutes } from "./routes/MainRoutes";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="*" element={<MainAppRoutes />} />
    </Routes>
  );
};

export default AppRouter;
