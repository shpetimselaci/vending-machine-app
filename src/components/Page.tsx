import { Helmet } from "react-helmet-async";
import { forwardRef } from "react";
// material
import { Box, BoxTypeMap } from "@mui/material";

// ----------------------------------------------------------------------

const Page: React.FC<Partial<BoxTypeMap> & { title: string }> = forwardRef(
  ({ children, title = "", ...other }, ref) => (
    <Box
      ref={ref}
      {...other}
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh"
      }}
    >
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {children}
    </Box>
  )
);

export default Page;
