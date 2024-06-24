import { useCallback, useState } from "react";

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
      }
      throw new Error("No value in localStorage");
    } catch (_) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
  });

  const setLocalStorageStateValue: React.Dispatch<React.SetStateAction<T>> =
    useCallback(
      (valueOrFn) => {
        let newValue: T;
        if (valueOrFn instanceof Function) {
          setLocalStorageValue((prevValue) => {
            newValue = valueOrFn(prevValue);
            localStorage.setItem(key, JSON.stringify(newValue));
            return newValue;
          });
        } else {
          newValue = valueOrFn;
          localStorage.setItem(key, JSON.stringify(newValue));
          setLocalStorageValue(newValue);
        }
      },
      [key],
    );
  return [localStorageValue, setLocalStorageStateValue] as const;
};

export default useLocalStorage;
