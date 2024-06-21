import buildUrl from "../utils/searchParam";
import instance from "./axios";
import {
  ActivateStatus,
  Driver,
  DriverStatus,
  PagingAndSortDto,
  PagingAndSortResponse,
  RegisterStatus,
} from "./types";
export interface GetDriversPagingAndSortDto extends PagingAndSortDto {
  registerStatus?: RegisterStatus | RegisterStatus[];
}
export type DriverStatusStatistic = {
  [key in DriverStatus]?: number;
};
export type ActivateStatusStatistic = {
  [key in ActivateStatus]?: number;
};
export type RegisterStatusStatistic = {
  [key in RegisterStatus]?: number;
};
export type DriverStatistic = {
  total: number;
  status: DriverStatusStatistic;
  activateStatus: ActivateStatusStatistic;
};
export const getAll = async (getAllDto: Type<GetDriversPagingAndSortDto>) => {
  const path = "drivers";
  const url = buildUrl(path, getAllDto);
  const res = await instance.get<PagingAndSortResponse<Driver>>(url);
  return res.data;
};
export const getAllRegister = async (
  getAllDto: Type<GetDriversPagingAndSortDto>,
) => {
  const path = "drivers/register";
  const url = buildUrl(path, getAllDto);
  const res = await instance.get<PagingAndSortResponse<Driver>>(url);
  return res.data;
};
export const getDetail = async (id: number) => {
  const path = `drivers/${id}`;
  const res = await instance.get<Driver>(path);
  return res.data;
};
export const getStatistic = async () => {
  const path = "drivers/statistic";
  const res = await instance.get<DriverStatistic>(path);
  return res.data;
};
export const actionRegister = async (id: number, status: RegisterStatus) => {
  const path = `drivers/${id}/action-register`;
  const res = await instance.patch<Driver>(path, {
    status,
  });
  return res.data;
};
