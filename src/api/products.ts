import client from "./client";

export interface IProduct {
  _id: string;
  amountAvailable: number;
  cost: number;
  productName: string;
  sellerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IListProduct {
  products: IProduct[];
  hasMore: boolean;
}
export const fetchProducts = (skip: number) => client.get<IListProduct>(`/products?skip=${skip}&limit=10`);

export interface ICreateProduct extends Pick<IProduct, "amountAvailable" | "cost" | "productName"> {}
export const postProduct = (product: ICreateProduct) => client.post<IProduct>(`/products`, product);
export const removeProduct = (productId: string) => client.delete<IProduct>(`/products/${productId}`);
