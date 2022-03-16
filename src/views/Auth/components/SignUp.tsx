import { signUp, UserRole } from "../../../api/auth";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCookies } from "react-cookie";
import { useMutation } from "react-query";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField
} from "@mui/material";
import { formatErr } from "../../../utils/formatErr";

const SignUpValidationSchema = yup
  .object({
    username: yup.string().min(6).required(),
    password: yup.string().min(6).required(),
    role: yup.string().oneOf([UserRole.BUYER, UserRole.SELLER])
  })
  .required();

interface ISignUp {
  password: string;
  username: string;
  role: UserRole;
}
const SignUpForm: React.FC<{ setTab: (tab: string) => void }> = ({ setTab }) => {
  const { enqueueSnackbar } = useSnackbar();

  const { register, handleSubmit, formState } = useForm<ISignUp>({
    resolver: yupResolver(SignUpValidationSchema)
  });
  const [cookie, setCookie] = useCookies();

  const mutationQuery = useMutation((newUser: ISignUp) => signUp(newUser.username, newUser.password, newUser.role), {});
  const onSubmit = async (data: ISignUp) => {
    try {
      const user = await mutationQuery.mutateAsync(data);
      setCookie("login", { username: user.data.username }, { path: "/" });
      setTab("1");
    } catch (err) {
      enqueueSnackbar(formatErr(err));
    }
  };

  const onKeyEnterPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.code === "Enter") {
      handleSubmit(onSubmit)();
    }
  };
  return (
    <FormControl fullWidth>
      <Grid item container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Username"
            fullWidth
            variant="outlined"
            {...register("username", { required: true })}
            onKeyDown={onKeyEnterPress}
            error={!!formState.errors["username"]}
          />
          {formState.errors["username"] && (
            <FormHelperText id="username">{formState.errors["username"].message}</FormHelperText>
          )}
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Password"
            fullWidth
            variant="outlined"
            type="password"
            {...register("password", { required: true })}
            onKeyDown={onKeyEnterPress}
            error={!!formState.errors["password"]}
          />
          {formState.errors["password"] && (
            <FormHelperText id="password">{formState.errors["password"].message}</FormHelperText>
          )}
        </Grid>
        <Grid item xs={12}>
          <FormLabel id="user-role">You are a:</FormLabel>

          <RadioGroup row sx={{ color: "white" }} aria-labelledby="user-role" {...register("role")} id="role">
            <FormControlLabel
              value={UserRole.BUYER}
              control={<Radio />}
              {...register("role")}
              label="Buyer"
              color="white"
            />
            <FormControlLabel
              value={UserRole.SELLER}
              control={<Radio />}
              {...register("role")}
              label="Seller"
              color="white"
            />
          </RadioGroup>
          {formState.errors["role"] && <FormHelperText id="role">{formState.errors["role"].message}</FormHelperText>}
        </Grid>

        <Grid item xs={12}>
          <Button disabled={mutationQuery.isLoading} variant="contained" fullWidth onClick={handleSubmit(onSubmit)}>
            {mutationQuery.isLoading ? "Creating Account..." : "Sign up"}
          </Button>
        </Grid>
      </Grid>
    </FormControl>
  );
};

export default SignUpForm;
