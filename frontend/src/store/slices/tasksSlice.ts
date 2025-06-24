import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TasksState {
  selectedTaskId: string | null;
  filter: string;
}

const initialState: TasksState = {
  selectedTaskId: null,
  filter: '',
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSelectedTaskId: (state, action: PayloadAction<string | null>) => {
      state.selectedTaskId = action.payload;
    },
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
    },
  },
});

export const { setSelectedTaskId, setFilter } = tasksSlice.actions;
export default tasksSlice.reducer;