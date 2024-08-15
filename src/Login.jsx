import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from './userSlice';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const handleLogin = async () => {
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      navigate('/select-document');
    }
  };

  return (
    <div className="rounded-3xl min-h-screen  items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
      <h1 className=" text-3xl font-bold text-center text-white mb-12 p-12">Real-Time Document Editor</h1>
      <div className="bg-white p-10 rounded-lg shadow-2xl mt-12 m-4">
        <h2 className="bg-white text-3xl font-bold text-center text-gray-900 mb-8">Login</h2>
        <div className="space-y-6">
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
          <button
            onClick={handleLogin}
            className={`w-full bg-purple-600 text-white py-3 rounded-full 
              ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700 transition duration-300 shadow-lg transform hover:scale-105'}`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
        </div>
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/register')}
            className="text-purple-600 hover:underline"
          >
            Dont have an account? Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
