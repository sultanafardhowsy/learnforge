import { useCallback, useEffect, useRef, useState } from "react";

type State<T> = { data: T | null; error: Error | null; loading: boolean };

/**
 * Runs an async loader whenever `deps` change and exposes loading / error / data.
 * Stale responses (from an earlier deps value) are ignored.
 */
export function useAsync<T>(loader: () => Promise<T>, deps: unknown[]) {
  const [state, setState] = useState<State<T>>({ data: null, error: null, loading: true });
  const requestId = useRef(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(loader, deps);

  const reload = useCallback(async () => {
    const id = ++requestId.current;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await run();
      if (id === requestId.current) setState({ data, error: null, loading: false });
    } catch (error) {
      if (id === requestId.current) setState({ data: null, error: error as Error, loading: false });
    }
  }, [run]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { ...state, reload, setData: (data: T) => setState((s) => ({ ...s, data })) };
}
