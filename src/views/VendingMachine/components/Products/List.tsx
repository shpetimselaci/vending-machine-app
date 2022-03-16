import { Fragment } from "react";
import { useInfiniteQuery } from "react-query";
import { Box, Button, Card, Grid } from "@mui/material";
import { fetchProducts } from "../../../../api/products";
import BuyProduct from "./Buy";
import { useCookies } from "react-cookie";
import { ICookie } from "../../../../types";
import { UserRole } from "../../../../api/auth";
import RemoveProduct from "./Remove";

const Products: React.FC = () => {
  const [{ auth }] = useCookies<"auth", ICookie>(["auth"]);

  const query = useInfiniteQuery(
    "products",
    ({ pageParam = 0 }) => {
      return fetchProducts(pageParam).then((data) => ({ ...data.data, skip: pageParam }));
    },
    {
      keepPreviousData: true,
      getNextPageParam: (lastPage, pages) => lastPage.skip + 10
    }
  );

  return (
    <Grid flex={14}>
      <Grid item xs={8}>
        <Box sx={{ overflowY: "auto", maxHeight: "calc(70vmin - 40px)", marginBottom: "20px" }}>
          {query.data?.pages?.map((page, i) => (
            <Fragment key={i}>
              {page.products.map((product) => (
                <Card variant="outlined" key={product._id} sx={{ marginBottom: "20px", padding: "20px" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <div>
                        Product Name: <strong>{product.productName}</strong>
                      </div>
                      <div>
                        Product Price: <strong>{product.cost}</strong> <br />
                      </div>
                      <div>
                        In-Stock: <strong>{product.amountAvailable}</strong> <br />
                      </div>
                    </Grid>
                    <Grid item xs={4}>
                      {auth?.user?.role === UserRole.BUYER && <BuyProduct {...product} />}
                      {auth?.user?.role === UserRole.SELLER && <RemoveProduct {...product} />}
                    </Grid>
                  </Grid>
                </Card>
              ))}
            </Fragment>
          ))}
        </Box>
      </Grid>

      <Button
        variant="contained"
        disabled={query.isLoading || !query.data?.pages?.[query?.data?.pages?.length - 1]?.hasMore}
        onClick={() => query.fetchNextPage()}
      >
        {query.isLoading ? "Loading..." : "See More"}
      </Button>
    </Grid>
  );
};

export default Products;
