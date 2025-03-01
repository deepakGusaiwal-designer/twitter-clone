// src/components/Auth/Register.js
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../../firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import Logo from "../../assets/sofice.svg"

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: username });
      await setDoc(doc(db, 'users', user.uid), {
        username,
        email,
        followers: [],
        following: [],
      }, { merge: true }); // Use merge to avoid overwriting if document exists
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  // ... rest of the component (form UI) remains unchanged
  return (
    <>
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 min-h-screen">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Sofice"
          src={Logo}
          className="mx-auto h-20 w-auto" />
        <h2 className="mt-7 text-center text-2xl/9 font-medium tracking-tight text-gray-900">
          Register
        </h2>
      </div>

      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="block w-full rounded-full bg-white px-5 py-3 text-base text-gray-900 outline-2 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset focus:outline-indigo-600 sm:text-sm/6 border border-gray-300 focus:border-indigo-600" />
            </div>
          </div>
          
          <div>
            <label htmlFor="Email" className="block text-sm/6 font-medium text-gray-900">
              Email
            </label>
            <div className="mt-2">
              <input
                id="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="block w-full rounded-full bg-white px-5 py-3 text-base text-gray-900 outline-2 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset focus:outline-indigo-600 sm:text-sm/6 border border-gray-300 focus:border-indigo-600" />
            </div>
          </div>

          <div>
            <label htmlFor="Password" className="block text-sm/6 font-medium text-gray-900">
              Password
            </label>
            <div className="mt-2">
              <input
                id="Password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                // required
                autoComplete="current-password"
                className="block w-full rounded-full bg-white px-5 py-3 text-base text-gray-900 outline-2 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset focus:outline-indigo-600 sm:text-sm/6 border border-gray-300 focus:border-indigo-600" />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-gray-900">
              Confirm Password
            </label>
            <div className="mt-2">
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="block w-full rounded-full bg-white px-5 py-3 text-base text-gray-900 outline-2 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset focus:outline-indigo-600 sm:text-sm/6 border border-gray-300 focus:border-indigo-600" />
            </div>
          </div>

          <div>
            {error && <p className="text-red-500 text-sm py-2">Username/password invalid</p>}
            <button
              type="submit"
              className="flex w-full justify-center rounded-full bg-cyan-500 px-3 py-4 text-md/6 font-semibold text-white shadow-xs hover:bg-cyan-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
              Register
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-cyan-800 hover:text-cyan-900">
          Login
          </Link>
        </p>
      </div>
    </div>

      {/* <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Register for Twitter</h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
            >
              Register
            </button>
          </form>
          <p className="mt-4 text-center">
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div> */}
    </>
  );
}

export default Register;