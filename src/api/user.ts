import buildUrl from "../utils/searchParam";
import instance from "./axios";
import { PagingAndSortDto, PagingAndSortResponse, User } from "./types";
export interface GetAllPagingAndSortDto extends PagingAndSortDto {
  isActivated?: boolean | boolean[];
}
export const getAll = async (dto: Type<GetAllPagingAndSortDto> = {}) => {
  const path = `admin/users`;
  const url = buildUrl(path, dto);
  const res = await instance.get<PagingAndSortResponse<User>>(url);
  return res.data;
};
export const getStatistic = async () => {
  const path = `admin/users/statistic`;
  const res = await instance.get<{
    active: number;
    inactive: number;
    total: number;
  }>(path);
  return res.data;
};
