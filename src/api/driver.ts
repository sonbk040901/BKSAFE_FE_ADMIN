import buildUrl from "../utils/searchParam";
import instance from "./axios";
import {
  ActivateStatus,
  Driver,
  DriverStatus,
  PagingAndSortDto,
  PagingAndSortResponse,
} from "./types";
export interface GetDriversPagingAndSortDto extends PagingAndSortDto {}
export type DriverStatusStatistic = {
  [key in DriverStatus]?: number;
};
export type ActivateStatusStatistic = {
  [key in ActivateStatus]?: number;
};
export type DriverStatistic = {
  total: number;
  status: DriverStatusStatistic;
  activateStatus: ActivateStatusStatistic;
};
export const getAll = async (getAllDto: Type<GetDriversPagingAndSortDto>) => {
  const path = "admin/drivers";
  const url = buildUrl(path, getAllDto);
  const res = await instance.get<PagingAndSortResponse<Driver>>(url);
  return res.data;
};
export const getStatistic = async () => {
  const path = "admin/drivers/statistic";
  const res = await instance.get<DriverStatistic>(path);
  return res.data;
};
