import { useEffect, useState } from "react";
import { useWindowSize } from "react-use";

const screenSizes = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<keyof typeof screenSizes>();

  const { width } = useWindowSize();

  useEffect(() => {
    if (width < screenSizes.md) {
      setScreenSize("sm");
    } else if (width < screenSizes.lg) {
      setScreenSize("md");
    } else if (width < screenSizes.xl) {
      setScreenSize("lg");
    } else if (width < screenSizes["2xl"]) {
      setScreenSize("xl");
    } else {
      setScreenSize("2xl");
    }
  }, [width]);

  return screenSize;
};

export default useScreenSize;
