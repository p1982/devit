import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ResultsState {
  results: number[];
  isRunning: boolean;
  limit: number;
}

const initialState: ResultsState = {
  results: [],
  isRunning: false,
  limit: 0,
};

const resultsSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {
    start(state, action: PayloadAction<number>) {
      state.isRunning = true;
      state.limit = action.payload;
      state.results = [];
    },
    addResult(state, action: PayloadAction<number>) {
      state.results.push(action.payload);
    },
    finish(state) {
      state.isRunning = false;
    },
    reset(state) {
      state.isRunning = false;
      state.limit = 0;
      state.results = [];
    },
  },
});

export const { start, addResult, finish, reset } = resultsSlice.actions;
export default resultsSlice.reducer;

