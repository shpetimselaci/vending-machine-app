import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { useCookies } from "react-cookie";
import { ICookie } from "../../../../types";
import EuroIcon from "@mui/icons-material/Euro";
import { UserRole } from "../../../../api/auth";
import { grey } from "@mui/material/colors";
import { Coins, deposit, resetDeposit } from "../../../../api/vending-machine-actions";
import { useMutation } from "react-query";
import { useSnackbar } from "notistack";
import { formatErr } from "../../../../utils/formatErr";
import { getCoinChangeMessage } from "../../../../utils/change";

const Balance = () => {
  const [{ auth }] = useCookies<"auth", ICookie>(["auth"]);

  const disabled = auth?.user?.role !== UserRole.BUYER;
  const disabledTextColor = disabled ? grey[500] : "white";
  return (
    <Box
      sx={{
        display: "flex",
        border: `1px solid  ${disabled ? grey[500] : grey[200]}`,
        borderRadius: "4px",
        alignItems: "center",
        justifyContent: "center",
        color: disabledTextColor
      }}
    >
      <Typography variant="h6" color={disabledTextColor}>
        {auth?.user?.deposit.reduce((a, b) => (a += b || 0), 0) || 0}
      </Typography>
      <EuroIcon fontSize="small" />
    </Box>
  );
};

const BuyerActions = () => {
  const [{ auth }, setCookie] = useCookies<"auth", ICookie>(["auth"]);
  const { enqueueSnackbar } = useSnackbar();

  const depositMoneyMutationQuery = useMutation((coin: Coins) => deposit(coin));
  const resetDepositMoneyMutationQuery = useMutation(() => resetDeposit());

  const depositCoin = async (coin: Coins) => {
    try {
      const { data } = await depositMoneyMutationQuery.mutateAsync(coin);
      setCookie("auth", {
        ...auth,
        user: data
      });

      enqueueSnackbar(`You deposited ${coin}€`, { variant: "success" });
    } catch (err) {
      enqueueSnackbar(formatErr(err));
    }
  };

  const resetDepositMoney = async () => {
    try {
      const { data } = await resetDepositMoneyMutationQuery.mutateAsync();
      setCookie("auth", {
        ...auth,
        user: data
      });

      enqueueSnackbar(getCoinChangeMessage(data.deposit), { variant: "success" });
    } catch (err) {
      enqueueSnackbar(formatErr(err));
    }
  };

  const disabled =
    auth?.user?.role !== UserRole.BUYER ||
    depositMoneyMutationQuery.isLoading ||
    resetDepositMoneyMutationQuery.isLoading;

  return (
    <Grid display="flex" justifyContent="space-between">
      <Grid item>
        <Typography variant="h5" color="white">
          Balance
        </Typography>
        <Balance />
      </Grid>
      <Grid item flexBasis={100}>
        <Stack spacing={2}>
          <Button
            disabled={disabled}
            variant="outlined"
            size="small"
            endIcon={<EuroIcon />}
            onClick={() => depositCoin(Coins.FIVE)}
          >
            5
          </Button>
          <Button
            disabled={disabled}
            variant="outlined"
            size="small"
            endIcon={<EuroIcon />}
            onClick={() => depositCoin(Coins.TEN)}
          >
            10
          </Button>
          <Button
            disabled={disabled}
            variant="outlined"
            size="small"
            endIcon={<EuroIcon />}
            onClick={() => depositCoin(Coins.TWENTY)}
          >
            20
          </Button>
          <Button
            disabled={disabled}
            variant="outlined"
            size="small"
            endIcon={<EuroIcon />}
            onClick={() => depositCoin(Coins.FIFTY)}
          >
            50
          </Button>
          <Button
            disabled={disabled}
            variant="outlined"
            size="small"
            endIcon={<EuroIcon />}
            onClick={() => depositCoin(Coins.ONE_HUNDRED)}
          >
            100
          </Button>

          <Button
            disabled={disabled || auth?.user?.deposit.length === 0}
            variant="text"
            size="small"
            onClick={() => resetDepositMoney()}
          >
            {resetDepositMoneyMutationQuery.isLoading ? "Refunding..." : "Refund"}
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};
export default BuyerActions;
