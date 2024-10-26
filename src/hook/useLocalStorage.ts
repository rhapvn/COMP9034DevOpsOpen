import { useState, useEffect } from "react";

function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    let currentValue: T;

    try {
      const item = localStorage.getItem(key);
      currentValue = item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      currentValue = defaultValue;
    }

    return currentValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue] as [T, typeof setValue];
}

export default useLocalStorage;
