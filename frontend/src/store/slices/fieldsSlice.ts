import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FieldsState {
  selectedFieldId: string | null; // Для хранения ID выбранного поля
}

const initialState: FieldsState = {
  selectedFieldId: null,
};

const fieldsSlice = createSlice({
  name: 'fields',
  initialState,
  reducers: {
    setSelectedFieldId: (state, action: PayloadAction<string | null>) => {
      state.selectedFieldId = action.payload;
    },
  },
});

export const { setSelectedFieldId } = fieldsSlice.actions;
export default fieldsSlice.reducer;
