import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";

const PublicRoute = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (user.user !== null) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    };

    checkUser();
  }, []);

  useEffect(() => {
    if (authenticated) {
      navigate("/");
    }
  }, [authenticated, navigate]);

  if (authenticated === null) {
    return null;
  }

  return children;
};

export default PublicRoute;