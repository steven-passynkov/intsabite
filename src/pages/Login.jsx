import React, { useState, useEffect } from "react";
import { Button, TextField, Grid, Typography } from "@mui/material";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (data) {
      const session = data;
      setSession(session);
    } else if (error) {
      console.error("Error logging in:", error.message);
    }
  };

  if (session) {
    return navigate("/");
  }

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh" }}
    >
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Typography variant="h5" align="center">
          Login
        </Typography>
        <form
          noValidate
          autoComplete="off"
          style={{ marginTop: 16 }}
          onSubmit={handleLogin}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: 16 }}
          >
            Sign In
          </Button>
        </form>
      </Grid>
    </Grid>
  );
};

export default Login;
