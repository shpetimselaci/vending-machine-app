import React, { useEffect } from "react";

import { Container, Grid } from "@mui/material";

import Page from "./components/Page";

import VendingMachine from "./views/VendingMachine";
import Auth from "./views/Auth";
import { ICookie } from "./types";
import { useCookies } from "react-cookie";
import { getProfile } from "./api/auth";

function App() {
  const [{ auth }, setCookie] = useCookies<"auth", ICookie>(["auth"]);

  const updateProfile = async (auth: ICookie["auth"]) => {
    if (auth?.token) {
      const user = await getProfile();

      setCookie("auth", { ...auth, user: user.data });
    }
  };

  useEffect(() => {
    updateProfile(auth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page title="Vending Machine">
      <Container sx={{ height: "100%", paddingBlock: "20px" }}>
        <Grid display="flex" flexDirection="column" flex="1" height="100%">
          <Auth />
          <VendingMachine />
        </Grid>
      </Container>
    </Page>
  );
}

export default App;
