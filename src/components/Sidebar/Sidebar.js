// src/components/Sidebar/Sidebar.js
import React, { useState } from 'react';
import { Home, User, Bell, Mail, SquarePen, LogOut } from 'lucide-react';
import { auth } from '../../firebase/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import Logo from "../../assets/sofice.svg";
import "./style.scss";
import { Modal } from 'antd';
import TweetBox from '../TweetBox/TweetBox';

function Sidebar() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="aside-sidebar-container h-screen sticky top-0 p-4 flex flex-col gap-4">
      <div className="px-1 flex-col flex items-center justify-center h-12 w-full rounded-full hover:bg-gray-100 cursor-pointer">
        <a href="/" className="flex items-center p-3">
          <img src={Logo} alt="Logo" />
        </a>
      </div>
      <nav className="flex flex-col gap-3">
        <a href="/" className="flex flex-col items-center gap-1 p-2 rounded-full hover:bg-gray-100 text-xs font-semibold text-gray-800">
          <Home className="w-4 h-4" />
          <span>Home</span>
        </a>
        <a href="/profile" className="flex flex-col items-center gap-1 p-2 rounded-full hover:bg-gray-100 text-xs text-gray-800">
          <User className="w-4 h-4" />
          <span>Profile</span>
        </a>
        <a href="/notifications" className="flex flex-col items-center gap-1 p-2 rounded-full hover:bg-gray-100 text-xs text-gray-800">
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
        </a>
        <a href="/messages" className="flex flex-col items-center gap-1 p-2 rounded-full hover:bg-gray-100 text-xs text-gray-800">
          <Mail className="w-4 h-4" />
          <span>Messages</span>
        </a>
      </nav>
      <button
        onClick={showModal}
        className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-full hover:bg-blue-600 w-full text-center flex items-center justify-center"
      >
        <SquarePen />
      </button>
      <Modal
        title="Compose Tweet"
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        width={600}
      >
        <TweetBox onTweetPosted={handleModalClose} /> {/* Pass callback to close modal */}
      </Modal>
      <div className="mt-auto flex flex-col gap-2">
        <div className="flex items-center gap-3 p-3 rounded-full hover:bg-gray-100 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white text-xl font-bold">
            {user?.displayName?.charAt(0).toUpperCase() || 'U'}
            {/* <div className="flex-1">
            <p className="font-semibold text-gray-800">{user?.displayName || 'User'}</p>
            <p className="text-sm text-gray-500">@{user?.displayName?.toLowerCase() || 'user'}</p>
          </div> */}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center text-center gap-1 p-2 rounded-full hover:bg-gray-100 text-xs text-gray-800 w-full"
        >
          <LogOut className="w-4 h-4 mx-auto" />
          {/* <span>Logout</span> */}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;