import { yupResolver } from "@hookform/resolvers/yup";
import { Button, FormControl, FormHelperText, Grid, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as yup from "yup";
import { logIn } from "../../../api/auth";

const LogInValidationSchema = yup
  .object({
    username: yup.string().min(6).required(),
    password: yup.string().min(6).required()
  })
  .required();

interface ILogin {
  username: string;
  password: string;
}

const LoginForm: React.FC<{ close: () => void }> = ({ close }) => {
  const [cookie, setCookie] = useCookies();
  const { enqueueSnackbar } = useSnackbar();

  const { register, handleSubmit, formState } = useForm<ILogin>({
    resolver: yupResolver(LogInValidationSchema),
    defaultValues: {
      username: cookie?.login?.username
    }
  });

  const mutationQuery = useMutation((newUser: ILogin) => logIn(newUser.username, newUser.password), {});

  const onSubmit = async (data: ILogin) => {
    try {
      const { data: auth } = await mutationQuery.mutateAsync(data);
      await setCookie("auth", auth, { path: "/" });
      await setCookie("login", { username: auth?.user?.username });
      close();
    } catch (err) {
      enqueueSnackbar(err);
    }
  };

  const onEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.code === "Enter") {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <FormControl fullWidth>
      <Grid item container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Username"
            fullWidth
            variant="outlined"
            id="username"
            {...register("username", { required: true })}
            error={!!formState.errors["username"]}
            onKeyDown={onEnter}
          />
          {formState.errors["username"] && (
            <FormHelperText id="username">{formState.errors["username"].message}</FormHelperText>
          )}
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Password"
            fullWidth
            variant="outlined"
            type="password"
            id="password"
            {...register("password", { required: true })}
            error={!!formState.errors["password"]}
            onKeyDown={onEnter}
          />
          {formState.errors["password"] && (
            <FormHelperText id="password">{formState.errors["password"].message}</FormHelperText>
          )}
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" fullWidth onClick={handleSubmit(onSubmit)}>
            {mutationQuery.isLoading ? "Logging in..." : "Log in"}
          </Button>

          {mutationQuery.error}
        </Grid>
      </Grid>
    </FormControl>
  );
};

export default LoginForm;
