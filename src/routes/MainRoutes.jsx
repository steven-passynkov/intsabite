import * as React from "react";
import { Route, Routes } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import Order from "../pages/Order";

// TODO rederect

export const MainAppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route path="/logout" element={<Logout />} />
      <Route
        path="/order"
        element={
          <ProtectedRoute>
            <Order />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
