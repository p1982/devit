import reducer, { start, addResult, finish, reset } from './resultsSlice';

describe('resultsSlice', () => {
  const initialState = {
    results: [],
    isRunning: false,
    limit: 0,
  };

  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle start', () => {
    const actual = reducer(initialState, start(42));
    expect(actual.isRunning).toBe(true);
    expect(actual.limit).toBe(42);
    expect(actual.results).toEqual([]);
  });

  it('should handle addResult', () => {
    const stateWithStart = reducer(initialState, start(10));
    const actual = reducer(stateWithStart, addResult(5));
    expect(actual.results).toContain(5);
  });

  it('should handle finish', () => {
    const runningState = { ...initialState, isRunning: true };
    const actual = reducer(runningState, finish());
    expect(actual.isRunning).toBe(false);
  });

  it('should handle reset', () => {
    const modifiedState = {
      results: [1, 2, 3],
      isRunning: true,
      limit: 50,
    };
    const actual = reducer(modifiedState, reset());
    expect(actual).toEqual(initialState);
  });
});
