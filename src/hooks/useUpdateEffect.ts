import { useRef, useEffect } from "react";
/**
 * Simulate componentDidUpdate() method of Class Component
 * https://reactjs.org/docs/react-component.html#componentdidupdate
 */
const useUpdateEffect = (
  effect: AnyFunction,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deps: any[] | undefined = undefined,
): void => {
  const mounted = useRef<boolean>();
  useEffect(() => {
    if (!mounted.current) {
      // fire componentDidMount
      mounted.current = true;
    } else {
      effect();
    }
  }, deps);
};

export default useUpdateEffect;
