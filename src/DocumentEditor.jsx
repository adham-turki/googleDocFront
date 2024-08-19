import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { connectSocket, updateDocument, setContent } from './editorSlice';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { debounce } from 'lodash';
import './App.css';

function Editor() {
  const { documentId } = useParams();
  const dispatch = useDispatch();
  const content = useSelector((state) => state.editor.content);
  const version = useSelector((state) => state.editor.version);
  const socketRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollaborator, setSelectedCollaborator] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [documentName, setDocumentName] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserIdAndDocuments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const userResponse = await fetch('https://googledocapi-3.onrender.com/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (userResponse.status === 401) {
          localStorage.removeItem('token');
          navigate('/'); // Redirect to login if token is expired
          return;
        }

        const userData = await userResponse.json();
        setActiveUser(userData);
      } catch (err) {
        console.error(err.message);
        navigate('/'); // Redirect to login on error
      }
    };

    fetchUserIdAndDocuments();
  }, [navigate]);

  useEffect(() => {
    // Fetch the document content and version when the component mounts
    const fetchDocument = async () => {
      try {
        const response = await fetch(`https://googledocapi-3.onrender.com/api/documents/${documentId}`);
        const data = await response.json();
        setDocumentName(data.data.title);
        dispatch(setContent(data.data.content));
        dispatch({ type: 'SET_VERSION', payload: data.data.version }); // Set initial version
      } catch (error) {
        console.error('Failed to fetch document:', error);
      }
    };

    fetchDocument();

    socketRef.current = io('https://googledocapi-3.onrender.com'); // Initialize socket connection

    socketRef.current.emit('join_room', documentId); // Join room for the document

    socketRef.current.on('document_update', (data) => {
      dispatch(setContent(data.content)); // Update content in the Redux store
      dispatch({ type: 'SET_VERSION', payload: data.version }); // Update version
    });

    socketRef.current.on('update_conflict', (data) => {
      alert(`Version conflict detected. Current version is ${data.currentVersion}.`);
    });

    dispatch(connectSocket()); // Dispatch connectSocket action

    return () => {
      socketRef.current.disconnect(); // Clean up on unmount
    };
  }, [documentId, dispatch]);

  useEffect(() => {
    // Fetch all users once when the component mounts
    const fetchAllUsers = async () => {
      try {
        const response = await fetch('https://googledocapi-3.onrender.com/api/users');
        const results = await response.json();
        setUsers(results);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchAllUsers();
  }, []);

  // Debounced handleContentChange function
  const handleContentChange = useRef(debounce((newContent) => {
    dispatch(updateDocument({ documentId, content: newContent, version })); // Send version with the update
  }, 500)).current;

  // Filter users based on the search query
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendInvitation = async () => {
    try {
      const response = await fetch('https://googledocapi-3.onrender.com/api/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: {
          content: `${activeUser.username} invited you to collaborate in ${documentName} document`,
          user: selectedCollaborator.id,
          document: documentId,
          status: 'pending',
        }}),
      });

      if (response.ok) {
        alert('Invitation sent successfully!');
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to send invitation:', error);
    }
  };

  return (
    <div className="App -mt-20">
      <div className="flex justify-between items-center mb-2">
        <div className="quill-editor">
          <ReactQuill
            value={content}
            onChange={handleContentChange}
            placeholder="Start editing..."
            className="ql-container w-fit"
          />
        </div>
        <div className='fixed top-20 left-96 ml-60 w-full'>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 border border-white text-white rounded-lg hover:bg-white hover:text-black"
          >
            Add Collaborators
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl mb-4">Add Collaborators</h2>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for collaborators..."
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <ul className="mb-4">
              {filteredUsers.map((user, index) => (
                <li
                  key={index}
                  onClick={() => setSelectedCollaborator(user)}
                  className={`cursor-pointer p-2 rounded-lg ${selectedCollaborator === user ? 'bg-blue-100' : ''}`}
                >
                  {user.username}
                </li>
              ))}
            </ul>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSendInvitation}
                disabled={!selectedCollaborator}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Editor;
