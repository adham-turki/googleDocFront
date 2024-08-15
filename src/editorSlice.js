
import { createSlice } from '@reduxjs/toolkit';

const editorSlice = createSlice({
  name: 'editor',
  initialState: {
    content: '',
  },
  reducers: {
    setContent: (state, action) => {// Update content in the state
      state.content = action.payload;
    },
    updateDocument: (state, action) => {
      state.content = action.payload.content;  // Update content directly
    },
    connectSocket: (state) => {
        state
    },
  },
});

// Export actions
export const { setContent, updateDocument, connectSocket } = editorSlice.actions;
export default editorSlice.reducer;

