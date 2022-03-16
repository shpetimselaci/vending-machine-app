import { Card, Divider, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useCookies } from "react-cookie";
import { ICookie } from "../../types";
import { UserRole } from "../../api/auth";

import SellerActions from "./components/SellerView";
import BuyerActions from "./components/BuyerView";
import Products from "./components/Products/List";

function Actions() {
  const [{ auth }] = useCookies<"auth", ICookie>(["auth"]);
  let ActionToRender;

  if (auth?.user?.role === UserRole.SELLER) {
    ActionToRender = <SellerActions />;
  } else {
    ActionToRender = <BuyerActions />;
  }
  return (
    <Grid item flex={6}>
      {ActionToRender}
    </Grid>
  );
}

const VendingMachine: React.FC = () => {
  return (
    <Grid flex={1}>
      <Card variant="elevation" sx={{ height: "100%" }}>
        <Box sx={{ padding: "20px", height: "calc(100% - 40px)" }}>
          <Typography variant="h4" textAlign={"center"}>
            The Vending Machine
          </Typography>
          <Grid display={"flex"} height="100%" paddingTop="30px">
            <Products />
            <Grid item flex={1} display="flex" justifyContent="center" alignItems="center">
              <Divider orientation="vertical" />
            </Grid>
            <Actions />
          </Grid>
        </Box>
      </Card>
    </Grid>
  );
};

export default VendingMachine;
