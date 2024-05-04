import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";

function NavBar() {
  const navigate = useNavigate();
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    const checkStaff = async () => {
      const user = await supabase.auth.getUser();
      if (user) {
        const { data: staff } = await supabase
          .from("staff")
          .select("id")
          .eq("id", user.data.user.id);

          console.log(staff);
        setIsStaff(staff.length > 0);
      }
    };
    checkStaff();
  }, []);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          InstaBite
        </Typography>
        <Button color="inherit" onClick={() => navigate("/")}>
          Home
        </Button>
        <Button color="inherit" onClick={() => navigate("/order")}>
          Order
        </Button>
        <Button color="inherit" onClick={() => navigate("/view-orders")}>
          See your orders
        </Button>
        {isStaff && (
          <Button color="inherit" onClick={() => navigate("/orders")}>
            View orders
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
