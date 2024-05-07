interface Params {
  [key: string]: unknown;
}
export default function buildUrl(path: string, params: Params) {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach((key) =>
    searchParams.append(key, String(params[key])),
  );
  return `${path}?${searchParams.toString()}`;
}
