import buildUrl from "../utils/searchParam";
import instance from "./axios";
import {
  ActivateStatus,
  PagingAndSortDto,
  PagingAndSortResponse,
  User,
} from "./types";
export interface GetAllPagingAndSortDto extends PagingAndSortDto {
  isActivated?: boolean | boolean[];
}
export const getAll = async (dto: Type<GetAllPagingAndSortDto> = {}) => {
  const path = `users`;
  const url = buildUrl(path, dto);
  const res = await instance.get<PagingAndSortResponse<User>>(url);
  return res.data;
};
export const getStatistic = async () => {
  const path = `users/statistic`;
  const res = await instance.get<{
    deactivated: number;
    activated: number;
    blocked: number;
    total: number;
  }>(path);
  return res.data;
};
export const action = async (
  userId: number,
  status: Exclude<ActivateStatus, "DEACTIVATED">,
) => {
  const path = `users/${userId}/action`;
  const res = await instance.patch<void>(path, { status });
  return res.data;
};
