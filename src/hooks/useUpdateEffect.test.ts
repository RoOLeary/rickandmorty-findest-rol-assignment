import { renderHook } from '@testing-library/react'

import useUpdateEffect from './useUpdateEffect'

describe('useUpdateEffect', () => {
  it('should not call effect on initial render but call it on subsequent updates', () => {
    // Mock effect function
    const effect = jest.fn();

    // Initial render: useUpdateEffect should not trigger the effect
    const { rerender } = renderHook(() => useUpdateEffect(effect));

    expect(effect).toHaveBeenCalledTimes(0); // Should not be called on initial render

    // Rerender with the same dependencies: effect should now be triggered
    rerender();

    expect(effect).toHaveBeenCalledTimes(1); // Called once after update

    // Rerender again with the same dependencies: effect should trigger again
    rerender();

    expect(effect).toHaveBeenCalledTimes(2); // Called twice after two updates
  });

  it('should only call effect when dependencies change', () => {
    const effect = jest.fn();

    // Render hook with a dependency
    const { rerender } = renderHook(({ dep }) => useUpdateEffect(effect, [dep]), {
      initialProps: { dep: 1 },
    });

    expect(effect).toHaveBeenCalledTimes(0); // Should not be called on initial render

    // Rerender with the same dependency: effect should not be triggered
    rerender({ dep: 1 });
    expect(effect).toHaveBeenCalledTimes(0);

    // Rerender with a new dependency: effect should now be triggered
    rerender({ dep: 2 });
    expect(effect).toHaveBeenCalledTimes(1); // Called once after dependency change

    // Rerender with the same dependency again: effect should not trigger
    rerender({ dep: 2 });
    expect(effect).toHaveBeenCalledTimes(1); // Still called only once
  });
});
