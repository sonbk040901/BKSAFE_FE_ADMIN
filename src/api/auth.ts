import instance from "./axios";
import * as storage from "../utils/storage";
import { Account } from "./types";
interface LoginDTO {
  email: string;
  password: string;
}
interface SignupDTO {
  username: string;
  password: string;
  email: string;
  fullName: string;
  phone: string;
}

export const login = async (login: LoginDTO) => {
  const path = "auth/login";
  const res = await instance.post<string>(path, login);
  const token = res.data;
  storage.storeData("token", token);
  return token;
};
export const signup = async (signup: SignupDTO) => {
  const path = "auth/signup";
  await instance.post(path, signup);
};
export const logout = () => {
  storage.removeData("token");
  storage.removeData("user");
};
export const getProfile = async () => {
  const path = "auth/admin-info";
  const res = await instance.get<Account>(path);
  return res.data;
};
