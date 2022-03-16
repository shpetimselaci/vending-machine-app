import { IAuth } from "./api/auth";
import { IListProduct } from "./api/products";

export interface ICookie {
  auth?: IAuth;
}

export interface IProductListInfiniteList extends IListProduct {
  skip?: number;
}
