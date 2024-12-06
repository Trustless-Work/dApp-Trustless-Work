/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";

interface UseLocalStorageUtils<T> {
  (
    key: string,
    initialValue: T,
  ): readonly [T, (value: T | ((val: T) => T)) => void];
}

const useLocalStorageUtils: UseLocalStorageUtils<any> = <T>(
  key: string,
  initialValue: T,
) => {
  const [state, setState] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return initialValue;
    }
  });

  const setValue: (value: T | ((val: T) => T)) => void = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(state) : value;

      window.localStorage.setItem(key, JSON.stringify(valueToStore));

      setState(valueToStore);
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  };

  return [state, setValue] as const;
};

export default useLocalStorageUtils;
