export const formatErr = (err: any): string =>
  err?.response?.data?.message || err?.message || "Something wrong happened";
