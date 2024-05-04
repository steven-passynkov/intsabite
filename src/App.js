import React from "react";
import AppRouter from "./AppRouter";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Helmet } from "react-helmet";

const theme = createTheme({
  palette: {
    primary: {
      main: "#B236FF",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Helmet>
        <link
          rel="icon"
          href="https://xnslgkoylgnltemqixyc.supabase.co/storage/v1/object/sign/images/instabite%20app%20logo.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvaW5zdGFiaXRlIGFwcCBsb2dvLnBuZyIsImlhdCI6MTcxNDg2NTc0MywiZXhwIjoxNzQ2NDAxNzQzfQ.WtRQugokyhfwPdty8mbdQbfnI5-PlSEvilVrgfzeEoI&t=2024-05-04T23%3A35%3A43.972Z"
        />
      </Helmet>
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;
