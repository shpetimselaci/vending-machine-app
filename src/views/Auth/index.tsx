import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Button, Grid, Modal, Tab, Theme, SxProps } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { useCookies } from "react-cookie";

import { ICookie } from "../../types";

import LoginForm from "./components/LogIn";
import SignUpForm from "./components/SignUp";
import UserMenu from "./components/Menu";

const modalStyles: SxProps<Theme> = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: "4px",
  boxShadow: 24,
  p: 4
};

const Auth = () => {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState("1");
  const [{ auth }] = useCookies<"auth", ICookie>(["auth"]);
  const handleChange = (event: React.SyntheticEvent<Element, Event>, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Grid display="flex" item sx={{ paddingBottom: "20px" }} alignItems="center" justifyContent="flex-end">
      {!auth?.user && (
        <Button variant="text" onClick={() => setVisible(true)}>
          Who are you? Identify yourself!
        </Button>
      )}
      <Modal open={visible} onClose={() => setVisible(false)}>
        <Box sx={modalStyles}>
          <TabContext value={value}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Login" value="1" />
              <Tab label="Create an Account" value="2" />
            </TabList>
            <TabPanel value="1" sx={{ paddingInline: "0" }}>
              <LoginForm close={() => setVisible(false)} />
            </TabPanel>
            <TabPanel value="2" sx={{ paddingInline: "0" }}>
              <SignUpForm setTab={(val: string) => setValue(val)} />
            </TabPanel>
          </TabContext>
        </Box>
      </Modal>
      {auth?.token && <UserMenu />}
    </Grid>
  );
};

export default Auth;
