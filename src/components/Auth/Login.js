import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { useNavigate, Link } from 'react-router-dom';
import Logo from "../../assets/sofice.svg"

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); // Redirect to home (tweet page) after successful login
    } catch (err) {
      setError(err.message);
    }
  };

  return (

    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 min-h-screen">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Sofice"
            src={Logo}
            className="mx-auto h-20 w-auto" />
          <h2 className="mt-7 text-center text-2xl/9 font-medium tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  id="email"
                  name="email"
                  // required
                  autoComplete="email"
                  className="block w-full rounded-full bg-white px-5 py-3 text-base text-gray-900 outline-2 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset focus:outline-indigo-600 sm:text-sm/6 border border-gray-300 focus:border-indigo-600" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <a href="/" className="font-semibold text-xs text-cyan-800 hover:text-cyan-900">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="******"
                  // required
                  autoComplete="current-password"
                  className="block w-full rounded-full bg-white px-5 py-3 text-base text-gray-900 outline-2 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset focus:outline-indigo-600 sm:text-sm/6 border border-gray-300 focus:border-indigo-600" />
              </div>
            </div>

            <div>
              {error && <p className="text-red-500 text-sm py-2">Username/password invalid</p>}
              <button
                type="submit"
                className="flex w-full justify-center rounded-full bg-cyan-500 px-3 py-4 text-md/6 font-semibold text-white shadow-xs hover:bg-cyan-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Not a member?{' '}
            <Link to="/register" className="font-semibold text-cyan-800 hover:text-cyan-900">
            Register
            </Link>
          </p>
        </div>
      </div>


    {/* <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Login to Twitter</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-center">
            Don’t have an account?{' '}
            <a href="/register" className="text-blue-500 hover:underline">
              Register
            </a>
          </p>
        </div>
      </div> */}
    </>
  );
}

export default Login;