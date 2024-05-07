export const storeData = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    throw "Error while storing data";
  }
};

export const getData = <T = unknown>(key: string): T => {
  try {
    const value = localStorage.getItem(key);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value ? JSON.parse(value) : null;
  } catch (error) {
    throw "Error while getting data";
  }
};
export const removeData = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    throw "Error while removing data";
  }
};

export const clearData = () => {
  try {
    localStorage.clear();
  } catch (error) {
    throw "Error while clearing data";
  }
};
export const getDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371; // km (change this constant to get miles)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    0.5 -
    Math.cos(dLat) / 2 +
    (Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      (1 - Math.cos(dLon))) /
      2;
  return R * 2 * Math.asin(Math.sqrt(a));
};
