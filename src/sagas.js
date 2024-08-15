import { all, takeEvery, put } from 'redux-saga/effects';
import { setContent, updateDocument,connectSocket } from './editorSlice';
import { io } from 'socket.io-client';
/*
all: Used to run multiple sagas in parallel.
takeEvery: Listens for specific actions and triggers the associated saga.
put: Dispatches actions to the Redux store.
*/
function* connectSocketSaga() {// Establishes a connection to the WebSocket server and listens for updates from it.
  const socket = io('https://googledocapi-3.onrender.com');
  // listen for updates from the server then update the redux store with the new content
  socket.on('document_update', (data) => {
    put(setContent(data.content)); 
  });

  
  yield; 
}

function* updateDocumentSaga(action) {//Sends document updates to the WebSocket server and updates the local Redux store.
const socket = io('https://googledocapi-3.onrender.com');

  const { documentId, content } = action.payload;
  // listen for updates from the server and send them to the client side
  if (socket) { 
    socket.emit('document_update', { documentId, content }); 
  }

  yield put(setContent(content)); // Update the content in the store
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
