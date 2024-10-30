import { type RefObject, useEffect, useState } from "react";

const useRefDimensions = (ref: RefObject<HTMLElement | null>) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (ref?.current) {
      const { current } = ref;
      const observer = new ResizeObserver((entries) => {
        setDimensions({
          width: Math.round(entries[0]?.contentRect?.width || 0),
          height: Math.round(entries[0]?.contentRect?.height || 0),
        });
      });
      observer.observe(ref.current);
      return () => current && observer.unobserve(current);
    }
  }, [ref]);
  return dimensions;
};

export default useRefDimensions;
