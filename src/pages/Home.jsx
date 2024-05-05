import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";

const Home = () => {
  const [user, setUser] = useState({ user: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: user } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      {user.user !== null ? (
        <>
          <p>You are signed in as {user.user.email}</p>
          <Button onClick={() => navigate("/logout")}>Logout</Button>
        </>
      ) : (
        <Button onClick={() => navigate("/login")}>Login page</Button>
      )}
    </div>
  );
};

export default Home;
