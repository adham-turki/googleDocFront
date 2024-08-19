import { all, put, takeEvery } from 'redux-saga/effects';
import { setContent, updateDocument, connectSocket } from './editorSlice';
import { io } from 'socket.io-client';

let socket;

function* connectSocketSaga() {
  // Initialize socket connection
  if (!socket) {
    socket = io('https://googledocapi-3.onrender.com');

    socket.on('document_update', (data) => {
      put(setContent(data.content));
    });
  }

  yield;
}

function* updateDocumentSaga(action) {
  const { documentId, content } = action.payload;
  if (socket) {
    socket.emit('document_update', { documentId, content });
  }

  yield put(setContent(content));
}

export function* watchSocketConnection() {
  yield takeEvery(connectSocket.type, connectSocketSaga);
}

export function* watchDocumentUpdates() {
  yield takeEvery(updateDocument.type, updateDocumentSaga);
}

// Root saga
export default function* rootSaga() {
  yield all([
    watchSocketConnection(),
    watchDocumentUpdates(),
  ]);
}
