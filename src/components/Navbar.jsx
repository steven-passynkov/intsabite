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
        setIsStaff(staff.length > 0);
      }
    };
    checkStaff();
  }, []);

  return (
    <AppBar position="static">
      <Toolbar>
        <img
          src="https://xnslgkoylgnltemqixyc.supabase.co/storage/v1/object/sign/images/instabite%20app%20logo.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvaW5zdGFiaXRlIGFwcCBsb2dvLnBuZyIsImlhdCI6MTcxNDg2NTc0MywiZXhwIjoxNzQ2NDAxNzQzfQ.WtRQugokyhfwPdty8mbdQbfnI5-PlSEvilVrgfzeEoI&t=2024-05-04T23%3A35%3A43.972Z"
          alt="InstaBite Logo"
          style={{ height: "50px", marginRight: "10px" }}
        />
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
