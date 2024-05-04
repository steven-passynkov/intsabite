import React from "react";
import { Route, Routes } from "react-router-dom";
import { MainAppRoutes } from "./routes/MainRoutes";
import Navbar from "./components/Navbar";

const AppRouter = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="*" element={<MainAppRoutes />} />
      </Routes>
    </>
  );
};

export default AppRouter;
