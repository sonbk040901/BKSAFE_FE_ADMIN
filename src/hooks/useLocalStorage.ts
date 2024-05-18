import { useState } from "react";

const useLocalStorage = <T = unknown>(key: string, defaultValue: T) => {
  // Create state variable to store
  // localStorage value in state
  const [localStorageValue, setLocalStorageValue] = useState<T>(() => {
    try {
      const value = localStorage.getItem(key);
      // If value is already present in
      // localStorage then return it

      // Else set default value in
      // localStorage and then return it
      if (value) {
        return JSON.parse(value) as T;
      } else {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (error) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
  });

  // this method update our localStorage and our state
  const setLocalStorageStateValue: React.Dispatch<React.SetStateAction<T>> = (
    valueOrFn,
  ) => {
    let newValue: T;
    if (typeof valueOrFn === "function") {
			
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      newValue = valueOrFn(localStorageValue);
    } else {
      newValue = valueOrFn;
    }
    localStorage.setItem(key, JSON.stringify(newValue));
    setLocalStorageValue(newValue);
  };
  return [localStorageValue, setLocalStorageStateValue] as const;
};

export default useLocalStorage;
