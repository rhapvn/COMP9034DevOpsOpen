import React, { useEffect } from "react";

const usePopState = (key: any, setKey: React.Dispatch<React.SetStateAction<any>>) => {
  useEffect(() => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("page", key);
    window.history.pushState({ key }, "", newUrl.toString());
    const handlePopState = (event: PopStateEvent) => {
      if (event.state) {
        setKey(event.state.key);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [key, setKey]);
};

export default usePopState;
