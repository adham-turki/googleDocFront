import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {  useSelector } from 'react-redux';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('authenticated');
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  const handleRegister = async () => {

    try {
      const response = await fetch('https://googledocapi-3.onrender.com/api/auth/local/register', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: name,  
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const result = await response.json();
      console.log('Registration successful:', result);


      navigate('/');
    } catch (err) {
      console.error('Error during registration:', err);
    } 
  };

  return (
    <div className="rounded-3xl min-h-screen items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
      <h1 className="text-3xl font-bold text-center text-white mb-12 p-12">Real-Time Document Editor</h1>
      <div className="bg-white p-10 rounded-lg shadow-2xl mt-12 m-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Register</h2>
        <div className="space-y-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 placeholder-gray-400"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 placeholder-gray-400"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 placeholder-gray-400"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
          >
            <option value="authenticated">Authenticated</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={handleRegister}
            className={`w-full bg-purple-600 text-white py-3 rounded-full ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700 transition duration-300 shadow-lg transform hover:scale-105'}`}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
          {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default Register;
