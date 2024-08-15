
// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import documentsReducer from './documentsSlice';
import userReducer from './userSlice';
import editorReducer from './editorSlice';
import rootSaga from './sagas'; // Import your rootSaga

const sagaMiddleware = createSagaMiddleware();//used to run the sagamiddleware instance

export const store = configureStore({
  reducer: {
    documents: documentsReducer,
    user: userReducer,
    editor: editorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

// Run the root saga
sagaMiddleware.run(rootSaga);

