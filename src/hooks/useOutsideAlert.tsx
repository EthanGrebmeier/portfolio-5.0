import {
  MouseEvent,
  MouseEventHandler,
  RefObject,
  useEffect,
  useLayoutEffect,
} from "react";

export function useOutsideAlerter<T extends HTMLElement>(
  ref: RefObject<T>,
  onClickOutside?: MouseEventHandler<MouseEvent>,
) {
  useLayoutEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    const handleClickOutside = (event: any) => {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        onClickOutside
      ) {
        onClickOutside(event);
      }
    };
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}
