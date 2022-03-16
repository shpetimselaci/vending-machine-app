import client from "./client";
export enum UserRole {
  BUYER = "buyer",
  SELLER = "seller"
}
export interface IUser {
  _id: string;
  username: string;
  password: string;
  deposit: number[];
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuth {
  user: IUser;
  token: string;
  refreshToken: string;
}
export const logIn = (username: string, password: string) => client.post<IAuth>(`/login`, { username, password });
export const signUp = (username: string, password: string, role: UserRole) =>
  client.post<IUser>(`/signup`, {
    username,
    password,
    role
  });

export const getProfile = () => client.get<IUser>(`/user/me`, { withCredentials: true });
