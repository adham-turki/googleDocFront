
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';



export default function Card({id , title , createdAt , updatedAt, author ,collaborators}) {
const navigate = useNavigate();
console.log(collaborators)
const handleSelectDocument = (id) => {
    navigate(`/editor/${id}`);
  };
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  return (
    <div>
      <div className="max-w-xs min-h-full bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
    <img className="rounded-t-lg max-w-xs  " src="src\image.png" alt="" />
  <div className="p-5">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {title}
      </h5>
      <h5 className="mb-2 text-1xl  tracking-tight text-gray-900 dark:text-white">Author: {author}</h5>
      {collaborators.length > 0 && (
            <div className="flex items-center ml-16">
              Collaborators:
              {collaborators.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-bold mr-2"
                  title={user.username} // show full username on hover
                  style={{ backgroundColor: getRandomColor() }} // Apply random color
                >
                  {user.username.slice(0, 2).toUpperCase()} {/* First two letters of username */}
                </div>
              ))}
            </div>
          )}
    <h6>Created: {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</h6>
    <h6>Updated: {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}</h6>
    <button
    onClick={() => handleSelectDocument(id)}
      className="inline-flex items-center mt-6 px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >
      Open
      <svg
        className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 14 10"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M1 5h12m0 0L9 1m4 4L9 9"
        />
      </svg>
    </button>
  </div>
</div>


    </div>
  )
}
Card.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    collaborators: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        username: PropTypes.string.isRequired,
      })
    ).isRequired,

  };
