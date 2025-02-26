import React from 'react';
import { Home, User, Bell, Mail, LogOut } from 'lucide-react';
import { auth } from '../../firebase/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';

function Sidebar() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="w-64 h-screen sticky top-0 p-4 flex flex-col gap-4">
      {/* Logo */}
      <div className="flex items-center justify-center h-12 w-12 rounded-full hover:bg-gray-100 cursor-pointer">
        <span className="text-2xl font-bold text-blue-500">T</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-2">
        <a
          href="/"
          className="flex items-center gap-4 p-3 rounded-full hover:bg-gray-100 text-lg font-semibold text-gray-800"
        >
          <Home className="w-6 h-6" />
          <span>Home</span>
        </a>
        <a
          href="/profile"
          className="flex items-center gap-4 p-3 rounded-full hover:bg-gray-100 text-lg text-gray-800"
        >
          <User className="w-6 h-6" />
          <span>Profile</span>
        </a>
        <a
          href="/notifications"
          className="flex items-center gap-4 p-3 rounded-full hover:bg-gray-100 text-lg text-gray-800"
        >
          <Bell className="w-6 h-6" />
          <span>Notifications</span>
        </a>
        <a
          href="/messages"
          className="flex items-center gap-4 p-3 rounded-full hover:bg-gray-100 text-lg text-gray-800"
        >
          <Mail className="w-6 h-6" />
          <span>Messages</span>
        </a>
      </nav>

      {/* Tweet Button */}
      <button className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-full hover:bg-blue-600 w-full text-center">
        Tweet
      </button>

      {/* User Profile with Logout */}
      <div className="mt-auto flex flex-col gap-2">
        <div className="flex items-center gap-3 p-3 rounded-full hover:bg-gray-100 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div className="flex-1">
            <p className="font-semibold text-gray-800">{user?.displayName || 'User'}</p>
            <p className="text-sm text-gray-500">@{user?.displayName?.toLowerCase() || 'user'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 p-3 rounded-full hover:bg-gray-100 text-lg text-gray-800 w-full"
        >
          <LogOut className="w-6 h-6" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;