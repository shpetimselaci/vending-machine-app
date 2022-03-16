import { yupResolver } from "@hookform/resolvers/yup";
import { Button, FormControl, FormHelperText, Grid, TextField } from "@mui/material";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { InfiniteData, useMutation, useQueryClient } from "react-query";
import { buy } from "../../../../api/vending-machine-actions";
import * as yup from "yup";
import { IProduct } from "../../../../api/products";
import { ICookie, IProductListInfiniteList } from "../../../../types";
import { formatErr } from "../../../../utils/formatErr";
import { useSnackbar } from "notistack";
import { getCoinChangeMessage } from "../../../../utils/change";

interface IBuyProduct {
  productId: string;
  amount: number;
}

const BuyProductsValidationSchema = (amount: number) =>
  yup
    .object({
      productId: yup.string().required(),
      amount: yup.number().integer().min(1).max(amount).required()
    })
    .required();

const BuyProduct: React.FC<IProduct> = ({ _id, amountAvailable }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [{ auth }, setCookie] = useCookies<"auth", ICookie>(["auth"]);

  const { register, handleSubmit, formState, reset } = useForm<IBuyProduct>({
    resolver: yupResolver(BuyProductsValidationSchema(amountAvailable)),
    defaultValues: {
      amount: amountAvailable ? 1 : 0,
      productId: _id
    }
  });
  const client = useQueryClient();
  const mutationQuery = useMutation(({ productId, amount }: IBuyProduct) => buy(productId, amount), {});

  const onSubmit = async (data: IBuyProduct) => {
    try {
      const {
        data: { product, change, amountPurchased }
      } = await mutationQuery.mutateAsync(data);

      setCookie("auth", {
        ...auth,
        user: {
          ...auth?.user,
          deposit: []
        }
      });

      reset(); // reset form

      enqueueSnackbar(getCoinChangeMessage(change), { variant: "info" }); // inform user how much change he got back

      // update product stock
      const { pageParams, pages } = client.getQueryData("products") as InfiniteData<IProductListInfiniteList>;

      const pageIndexWhereProductIsListed = pages.findIndex((page) =>
        page.products.some(({ _id: listedProductId }) => listedProductId === product._id)
      );

      if (pageIndexWhereProductIsListed === -1) {
        return;
      }

      const page = pages[pageIndexWhereProductIsListed];

      page.products = page.products.map((listedProduct) => {
        if (listedProduct._id === product._id) {
          return product;
        }
        return listedProduct;
      });

      client.setQueryData("products", {
        pageParams: pageParams,
        pages: [
          ...pages.slice(0, pageIndexWhereProductIsListed),
          page,
          ...pages.slice(pageIndexWhereProductIsListed + 1)
        ]
      });

      // inform about the products he bought
      enqueueSnackbar(`Check the pickup port for ${amountPurchased}x "${product.productName}"`, { variant: "info" });
    } catch (err) {
      enqueueSnackbar(formatErr(err), { variant: "error" });
    }
  };
  return (
    <FormControl fullWidth>
      <Grid item container spacing={2}>
        <Grid item xs={6}>
          <TextField
            size="small"
            label="Amount"
            fullWidth
            variant="outlined"
            type="number"
            id="amount"
            {...register("amount", { required: true, min: 1 })}
            error={!!formState.errors["amount"]} // @ts-expect-error
            min={1}
            max={amountAvailable}
            disabled={amountAvailable === 0}
          />
          {formState.errors["amount"] && (
            <FormHelperText id="amount">{formState.errors["amount"].message}</FormHelperText>
          )}
        </Grid>
        <Grid item xs={2}>
          <Button
            disabled={amountAvailable === 0}
            variant="contained"
            size="small"
            fullWidth
            onClick={handleSubmit(onSubmit)}
          >
            {mutationQuery.isLoading ? "Buying..." : "Buy"}
          </Button>
        </Grid>
      </Grid>
    </FormControl>
  );
};

export default BuyProduct;
