import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";
import { DTOResponse } from "src/types";

function useLocalStorageFetch<T>(key: string, defaultValue: T, fetchFunction: () => Promise<DTOResponse<T>>) {
  const [value, setValue] = useLocalStorage<T>(key, defaultValue);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchFunction();
      if (res.success) {
        setValue(res.data);
      }
    };
    fetchData();
  }, [setValue, fetchFunction]);

  return [value, setValue] as [T, typeof setValue];
}

export default useLocalStorageFetch;
