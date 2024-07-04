import instance from "./axios";
import { Notification, PagingAndSortResponse } from "./types";

export const getAll = async () => {
  const path = `notifications`;
  const res = await instance.get<PagingAndSortResponse<Notification>>(path);
  return res.data;
};
export const create = async (data: Partial<Notification>) => {
  const path = `notifications`;
  const res = await instance.post<Notification>(path, data);
  return res.data;
};
export const update = async (data: Partial<Notification> & { id: number }) => {
  const { id, ...body } = data;
  const path = `notifications/${id}`;
  const res = await instance.patch<Notification>(path, body);
  return res.data;
};
export const remove = async (id: number) => {
  const path = `notifications/${id}`;
  const res = await instance.delete<void>(path);
  return res.data;
};
