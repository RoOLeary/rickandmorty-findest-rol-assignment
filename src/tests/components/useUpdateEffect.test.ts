import { renderHook } from '@testing-library/react';
import useUpdateEffect from '../../hooks/useUpdateEffect';

describe('useUpdateEffect', () => {
  beforeEach(() => {
    // Suppress console.error temporarily for this test suite
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.error after each test to avoid affecting other tests
    (console.error as jest.Mock).mockRestore();
  });

  it('should not call effect on initial render but call it on subsequent updates', () => {
    const effect = jest.fn();

    const { rerender } = renderHook(() => useUpdateEffect(effect));

    expect(effect).toHaveBeenCalledTimes(0);

    rerender();

    expect(effect).toHaveBeenCalledTimes(1);

    rerender();

    expect(effect).toHaveBeenCalledTimes(2);
  });

  it('should only call effect when dependencies change', () => {
    const effect = jest.fn();

    const { rerender } = renderHook(({ dep }) => useUpdateEffect(effect, [dep]), {
      initialProps: { dep: 1 },
    });

    expect(effect).toHaveBeenCalledTimes(0);

    rerender({ dep: 1 });
    expect(effect).toHaveBeenCalledTimes(0);

    rerender({ dep: 2 });
    expect(effect).toHaveBeenCalledTimes(1);

    rerender({ dep: 2 });
    expect(effect).toHaveBeenCalledTimes(1);
  });
});
