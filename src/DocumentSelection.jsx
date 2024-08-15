import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDocuments, createDocument } from './documentsSlice';
import Card from './Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

function SelectDocument() {
  const [newDocumentTitle, setNewDocumentTitle] = useState('');
  const [selectedOption, setSelectedOption] = useState('MyDocuments');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { documents, loading, error } = useSelector((state) => state.documents);

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
          // navigate('/'); // Redirect to login if token is expired
          return;
        }

        const userData = await userResponse.json();
        const userId = userData.id;

        dispatch(fetchDocuments({ userId, isCollaborated: selectedOption === 'CollaboratedDocuments' }));

      } catch (err) {
        console.error(err.message);
        // navigate('/'); // Redirect to login on error
      }
    };

    fetchUserIdAndDocuments();
  }, [dispatch, navigate, selectedOption]);

  const handleCreateDocument = () => {
    const token = localStorage.getItem('token');
    dispatch(createDocument({ userId: token, title: newDocumentTitle }));
    setNewDocumentTitle('');
    setIsModalOpen(false);
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  if (loading) return <div>Loading documents...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r -mt-10">
      <div className="bg-white p-8 rounded-lg h-screen  left-0 w-screen -ml-44">
      
        <div className="bg-white p-8 flex justify-between">
          <h1 className="text-4xl font-semibold mb-6">Documents</h1>
          <select
            value={selectedOption}
            onChange={handleOptionChange}
            className="px-1 mb-5 py-2 bg-blue-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="MyDocuments">My Documents</option>
            <option value="CollaboratedDocuments">Collaborated Documents</option>
          </select>
      
        </div>
        <div className="flex flex-wrap gap-4 mb-8">
          {documents.map((doc, index) => (
            <Card key={index} id={doc.id} title={doc.title} createdAt={doc.createdAt} updatedAt={doc.updatedAt} author={doc.author.username} collaborators={doc.collaborators} />
          ))}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-100 text-blue-500 max-h-28 w-28 mt-36 hover:text-blue-600 focus:outline-none"
          >
            <FontAwesomeIcon icon={faPlus} size="2x" />
          </button>
          
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl mb-4">Create New Document</h2>
            <input
              type="text"
              value={newDocumentTitle}
              onChange={(e) => setNewDocumentTitle(e.target.value)}
              placeholder="Document Title"
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDocument}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SelectDocument;
