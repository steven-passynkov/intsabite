import * as React from "react";
import { Route, Routes } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import Order from "../pages/Order";
import ViewOrders from "../pages/ViewOrders";
import Orders from "../pages/Orders";

export const MainAppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/logout"
        element={
          <ProtectedRoute redirectPath="/">
            <Logout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order"
        element={
          <ProtectedRoute redirectPath="/login">
            <Order />
          </ProtectedRoute>
        }
      />
      <Route
        path="/view-orders"
        element={
          <ProtectedRoute redirectPath="/login">
            <ViewOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute redirectPath="/login">
            <Orders />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
