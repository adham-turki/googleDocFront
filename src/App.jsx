// src/App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import SelectDocument from './DocumentSelection';
import Editor from './DocumentEditor';
import Register from './Register.jsx';
import Layout from './Header.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Layout />}>
          <Route path="/select-document" element={<SelectDocument />} />
          <Route path="/editor/:documentId" element={<Editor />} />
        </Route>
        <Route path="*" element={<Login/>} />

      </Routes>
    </Router>
  );
}

export default App;
