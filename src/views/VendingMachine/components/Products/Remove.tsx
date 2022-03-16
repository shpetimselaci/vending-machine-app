import { Button, Grid } from "@mui/material";

import { InfiniteData, useMutation, useQueryClient } from "react-query";
import { IProduct, removeProduct } from "../../../../api/products";
import { ICookie, IProductListInfiniteList } from "../../../../types";
import { formatErr } from "../../../../utils/formatErr";
import { useSnackbar } from "notistack";
import { useCookies } from "react-cookie";

const RemoveProduct: React.FC<IProduct> = ({ _id, sellerId }) => {
  const [{ auth }, setCookie] = useCookies<"auth", ICookie>(["auth"]);

  const { enqueueSnackbar } = useSnackbar();

  const client = useQueryClient();
  const mutationQuery = useMutation((productId: string) => removeProduct(productId), {});

  const onSubmit = async (productId: string) => {
    try {
      const { data: product } = await mutationQuery.mutateAsync(productId);

      // update product stock
      const { pageParams, pages } = client.getQueryData("products") as InfiniteData<IProductListInfiniteList>;

      const pageIndexWhereProductIsListed = pages.findIndex((page) =>
        page.products.some(({ _id: listedProductId }) => listedProductId === product._id)
      );

      if (pageIndexWhereProductIsListed === -1) {
        return;
      }

      const page = pages[pageIndexWhereProductIsListed];

      page.products = page.products.filter((listedProduct) => {
        if (listedProduct._id === product._id) {
          return false;
        }
        return true;
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
      enqueueSnackbar(`You got the Product "${product.productName}" off the Vending Machine`, { variant: "info" });
    } catch (err) {
      enqueueSnackbar(formatErr(err), { variant: "error" });
    }
  };
  return (
    <Grid display="flex" justifyContent="flex-end">
      <Grid item>
        <Button
          disabled={auth?.user?._id !== sellerId}
          variant="contained"
          size="small"
          fullWidth
          onClick={() => onSubmit(_id)}
        >
          {mutationQuery.isLoading ? "Removing..." : "Remove"}
        </Button>
      </Grid>
    </Grid>
  );
};

export default RemoveProduct;
