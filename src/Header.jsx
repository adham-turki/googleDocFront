import { Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { BellIcon } from '@heroicons/react/24/outline'; // For the outline version

function Layout() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeUser, setActiveUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [throttleMessage,setThrottleMessage] = useState(''); // Assuming you have a throttleMessage state

  const dropdownRef = useRef(null);

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

        // Fetch invitations for the active user
        const invitationResponse = await fetch(`https://googledocapi-3.onrender.com/api/invitations/user/${userData.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const invitationData = await invitationResponse.json();

        // Filter invitations with status 'pending'
        const pendingInvitations = invitationData.data.filter(
          (invitation) => invitation.status === 'pending'
        );

        // Map the pending invitations to notifications
        const invitationNotifications = pendingInvitations.map((invitation) => ({
          id: invitation.id,
          message: invitation.content, // assuming 'content' is where the message is stored
          documentId: invitation.document.id,
        }));

        setNotifications(invitationNotifications);

      } catch (err) {
        console.error(err.message);
      }
    };

    fetchUserIdAndDocuments();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    navigate('/'); // Redirect to login page
  };

  const handleSelectTitle = () => {
    navigate(`/select-document`);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleAccept = async (notification) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      
      // Fetch the current document
      const res = await fetch(`https://googledocapi-3.onrender.com/api/documents/${notification.documentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const document = await res.json();
      
      // Extract current collaborators
      const currentCollaborators = document.data.collaborators.map(collaborator => collaborator.id) || [];
  
      // Update invitation status to 'accepted'
      await fetch(`https://googledocapi-3.onrender.com/api/invitations/${notification.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            status: 'accepted', // Change status to 'accepted'
          },
        }),
      });
  
      // Update the document's collaborators
      await fetch(`https://googledocapi-3.onrender.com/api/documents/${notification.documentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            collaborators: [...currentCollaborators, activeUser], // Add the active user to collaborators
          },
        }),
      });
  
      // Remove the accepted notification from the list
      setNotifications(notifications.filter(n => n.id !== notification.id));
      
      // Set success message
      setSuccessMessage("Invitation has been accepted");
      
      // Optionally clear the success message after a few seconds
      setTimeout(() => setSuccessMessage(''), 5000); // Clears after 5 seconds
    } catch (err) {
      console.error('Failed to accept invitation:', err.message);
    }
  };

  const handleDecline = async (notification) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      // Update invitation status to 'declined'
      await fetch(`https://googledocapi-3.onrender.com/api/invitations/${notification.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            status: 'declined',
          },
        }),
      });

      // Remove the declined notification from the list
      setNotifications(notifications.filter(n => n.id !== notification.id));
      
      // Set success message
      setThrottleMessage("Invitation has been declined");
      
      // Optionally clear the success message after a few seconds
      setTimeout(() => setThrottleMessage(''), 5000); // Clears after 5 seconds
    } catch (err) {
      console.error('Failed to decline invitation:', err.message);
    }
  };

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen mt-9">
      <nav className="bg-blue-500 p-1 mb-8 flex justify-between fixed top-0 left-0 w-full z-10">
        <h1 className="text-white text-xl p-2 font-sans cursor-pointer" onClick={handleSelectTitle}>
          Real-Time Editor
        </h1>
        <div className="flex items-center">
          <h3 className='text-white mr-2'>{activeUser ? activeUser.username : 'Loading...'}</h3>
          <div className="relative" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="text-white bg-blue-500 hover:bg-white hover:text-black border rounded-lg z-20 relative">
              <BellIcon className="h-6 w-6" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1">{notifications.length}</span>
              )}
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-96 bg-white border rounded-lg shadow-lg z-20">
                <div className="p-2">
                  {notifications.length === 0 ? (
                    <p className="text-gray-500">No notifications</p>
                  ) : (
                    notifications.map((notification) => (
                      <div key={notification.id} className="p-2 border-b last:border-b-0 hover:bg-gray-100">
                        <p>{notification.message}</p>
                        <div className="flex justify-between mt-2">
                          <button
                            onClick={() => handleAccept(notification)}
                            className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-700"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleDecline(notification)}
                            className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-700"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={handleLogout} 
            className="bg-transparent border-2 border-white text-white px-4 py-1 rounded-lg hover:bg-red-400 ml-4"
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="p-4">
      {throttleMessage && <div className="bg-yellow-200 text-black p-4 rounded-lg mb-12">{throttleMessage}</div>}
      {successMessage && !throttleMessage && <div className="bg-green-300 text-black p-4 rounded-lg mb-12">{successMessage}</div>}
      <Outlet />
      </div>
    </div>
  );
}

export default Layout;
