export default function buildUrl(
  path: string,
  params: Record<string, unknown>,
) {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach(
    (key) => params[key] && searchParams.append(key, String(params[key])),
  );
  return `${path}?${searchParams.toString()}`;
}
