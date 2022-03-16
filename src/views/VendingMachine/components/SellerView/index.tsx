import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, FormControl, FormHelperText, Grid, TextField, Typography } from "@mui/material";
import { InfiniteData, useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { postProduct } from "../../../../api/products";
import { useSnackbar } from "notistack";
import { formatErr } from "../../../../utils/formatErr";
import { IProductListInfiniteList } from "../../../../types";

interface ICreateProduct {
  productName: string;
  amountAvailable: number;
  cost: number;
}

const isModOf5 = yup.number().test("isModOf5", "${path} has to be divisible by 5", (value: number) => value % 5 === 0);

const createProductSchema = yup
  .object({
    productName: yup.string().min(6).required(),
    amountAvailable: yup.number().min(1).integer().required(),
    cost: isModOf5.required()
  })
  .required();

const getDefaultValues = () => ({
  cost: 5,
  amountAvailable: 1,
  productName: `Example name ${Math.random().toFixed(2)}`
});

const AddProduct: React.FC = () => {
  const client = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { register, handleSubmit, formState } = useForm<ICreateProduct>({
    resolver: yupResolver(createProductSchema),
    defaultValues: getDefaultValues()
  });

  const mutationQuery = useMutation((newProduct: ICreateProduct) => postProduct(newProduct), {});

  const onSubmit = async (data: ICreateProduct) => {
    try {
      const newProduct = await mutationQuery.mutateAsync(data);
      const { pageParams, pages } = client.getQueryData("products") as InfiniteData<IProductListInfiniteList>;

      const firstPage = { ...pages[0], products: [newProduct.data, ...pages[0].products] };

      client.setQueryData("products", {
        pageParams: pageParams,
        pages: [firstPage, ...pages.slice(1)]
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      enqueueSnackbar(formatErr(err));
    }
  };

  return (
    <FormControl fullWidth>
      <Grid item container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Product name"
            fullWidth
            variant="outlined"
            id="productName"
            error={!!formState.errors["productName"]}
            {...register("productName", { required: true })}
          />
          {formState.errors["productName"] && (
            <FormHelperText id="productName">{formState.errors["productName"].message}</FormHelperText>
          )}
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Cost"
            fullWidth
            variant="outlined"
            id="cost"
            {...{ ...register("cost", { required: true, min: 5 }), min: "5", step: "10" }}
            error={!!formState.errors["cost"]}
          />
          {formState.errors["cost"] && <FormHelperText id="cost">{formState.errors["cost"].message}</FormHelperText>}
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Amount available"
            fullWidth
            variant="outlined"
            id="amountAvailable"
            {...register("amountAvailable", { required: true })}
            error={!!formState.errors["amountAvailable"]}
          />
          {formState.errors["amountAvailable"] && (
            <FormHelperText id="amountAvailable">{formState.errors["amountAvailable"].message}</FormHelperText>
          )}
        </Grid>
        <Grid item xs={12}>
          <Button disabled={mutationQuery.isLoading} variant="contained" fullWidth onClick={handleSubmit(onSubmit)}>
            {mutationQuery.isLoading ? "Adding products to vending machine..." : "Add Product"}
          </Button>
        </Grid>
      </Grid>
    </FormControl>
  );
};

const SellerActions = () => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5" color="white">
            Add Products
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <AddProduct />
        </Grid>
      </Grid>
    </>
  );
};

export default SellerActions;
