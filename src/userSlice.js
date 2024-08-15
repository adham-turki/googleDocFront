import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch('https://googledocapi-3.onrender.com/api/auth/local', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: email,
          password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.jwt);
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const registerUser = createAsyncThunk(
    'user/registerUser',
    async ({ name, email, password, role }, { rejectWithValue }) => {
      try {
        const response = await fetch('https://googledocapi-3.onrender.com/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            password,
            role,
          }),
        });
  
        const data = await response.json();
        if (response.ok) {
          return data;
        } else {
          return rejectWithValue(data.message);
        }
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
