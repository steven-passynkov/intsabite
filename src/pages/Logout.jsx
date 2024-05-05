import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

const Logout = () => {
  const [message, setMessage] = useState("");

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (!error) {
      setMessage("User has logged out successfully");
    } else {
      setMessage("Logout failed");
    }
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>Logout</h1>
      <p>{message}</p>
    </div>
  );
};

export default Logout;
