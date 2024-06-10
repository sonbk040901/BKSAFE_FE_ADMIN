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
  status?: DriverStatus | DriverStatus[];
  activateStatus?: ActivateStatus;
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
  registerStatus: RegisterStatusStatistic;
  activateStatus: ActivateStatusStatistic;
};
export const getAll = async (getAllDto: Type<GetDriversPagingAndSortDto>) => {
  const path = "drivers";
  const url = buildUrl(path, getAllDto);
  const res = await instance.get<PagingAndSortResponse<Driver>>(url);
  return res.data;
};
export const getStatistic = async () => {
  const path = "drivers/statistic";
  const res = await instance.get<DriverStatistic>(path);
  return res.data;
};
