import { capitalize } from "@mui/material";
import { Coins } from "../api/vending-machine-actions";

const setCoinInPlace = (acc: Record<Coins, number>, number: number) => {
  switch (number) {
    case Coins.FIVE:
      acc[Coins.FIVE] = (acc[Coins.FIVE] || 0) + 1;
      break;
    case Coins.TEN:
      acc[Coins.TEN] = (acc[Coins.TEN] || 0) + 1;
      break;
    case Coins.TWENTY:
      acc[Coins.TWENTY] = (acc[Coins.TWENTY] || 0) + 1;
      break;
    case Coins.FIFTY:
      acc[Coins.FIFTY] = (acc[Coins.FIFTY] || 0) + 1;
      break;
    case Coins.ONE_HUNDRED:
      acc[Coins.ONE_HUNDRED] = (acc[Coins.ONE_HUNDRED] || 0) + 1;
      break;
  }

  return acc;
};

export const getCoinChangeMessage = (arr: number[]) => {
  const data = arr.reduce((acc, number) => {
    return setCoinInPlace(acc, number);
  }, {} as Record<Coins, number>);

  const coinsBack = Object.keys(data).reduce(
    (str: string, coinName) =>
      (str += `${str.length ? " + " : ""}${data[coinName as unknown as Coins]}x${capitalize(coinName)}€`),
    ""
  );
  return coinsBack ? `You got back: ${coinsBack}` : "You got no change back!";
};
