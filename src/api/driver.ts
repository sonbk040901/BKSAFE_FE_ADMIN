import buildUrl from "../utils/searchParam";
import instance from "./axios";
import { Driver, PagingAndSortDto, PagingAndSortResponse } from "./types";
export interface GetDriversPagingAndSortDto extends PagingAndSortDto {}
export const getAll = async (getAllDto: Type<GetDriversPagingAndSortDto>) => {
  const path = "admin/drivers";
  const url = buildUrl(path, getAllDto);
  const res = await instance.get<PagingAndSortResponse<Driver>>(url);
  return res.data;
};
