import { IUser } from "./auth";
import client from "./client";
import { IProduct } from "./products";

export enum Coins {
  FIVE = 5,
  TEN = 10,
  TWENTY = 20,
  FIFTY = 50,
  ONE_HUNDRED = 100
}

interface IBuyResponse {
  change: number[];
  product: IProduct;
  amountPurchased: number;
}

export const deposit = (deposit: Coins) =>
  client.post<IUser>(`/vending-machine/deposit`, {
    deposit
  });

export const buy = (productId: string, amount: number) =>
  client.post<IBuyResponse>(`/vending-machine/buy`, {
    productId,
    amount
  });

export const resetDeposit = () => client.post<IUser>(`/vending-machine/reset`, {});
