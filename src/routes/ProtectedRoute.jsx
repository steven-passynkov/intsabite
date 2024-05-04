import { useState, useEffect } from "react";
import { CircularProgress, Box } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../utils/supabase";

const ProtectedRoute = ({ allowedRoles, redirectPath, children }) => {
  const [authenticated, setAuthenticated] = useState(null);
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (user.user !== null) {
        setAuthenticated(true);
        setRole(user.user.role);
      } else {
        setAuthenticated(false);
      }
      setIsLoading(false);
    };

    fetchUserRole();
  }, []);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!authenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  if (authenticated) {
    if (isLoading === false) {
      if (allowedRoles !== undefined) {
        if (role === undefined && allowedRoles.length > 0) {
          return <Navigate to={redirectPath} replace />;
        } else {
          if (!allowedRoles.includes(role)) {
            return <Navigate to={redirectPath} replace />;
          } else {
            return children ? <>{children}</> : <Outlet />;
          }
        }
      } else {
        return children ? <>{children}</> : <Outlet />;
      }
    }
  }
  return null;
};

export default ProtectedRoute;
