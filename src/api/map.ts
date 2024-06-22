import instance from "./axios";

export const getApiKey = async () => {
  const path = "map/api-key";
  const res = await instance.get<string>(path);
  return res.data;
};

export const updateApiKey = async (apiKey: string) => {
  const path = "map/api-key";
  const res = await instance.patch<string>(path, {
    apiKey,
  });
  return res.data;
};
