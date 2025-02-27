// src/components/Widgets/Widgets.js
import React, { useState, useEffect } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import { auth, db } from '../../firebase/firebase';
import { collection, getDocs, doc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

function Widgets() {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const allUsers = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const otherUsers = allUsers.filter((u) => u.id !== auth.currentUser?.uid);
      setSuggestedUsers(otherUsers.slice(0, 2));
      setAllMembers(otherUsers);
      const currentUserDoc = allUsers.find((u) => u.id === auth.currentUser?.uid);
      setFollowing(currentUserDoc?.following || []);
      if (!currentUserDoc && auth.currentUser) {
        await setDoc(doc(db, 'users', auth.currentUser.uid), {
          username: auth.currentUser.displayName || 'Unknown',
          email: auth.currentUser.email || '',
          followers: [],
          following: [],
        }, { merge: true });
      }
    };
    if (auth.currentUser) fetchUsers();
  }, []);

  const handleFollow = async (userId, isFollowing) => {
    if (!auth.currentUser) return;
    const currentUserRef = doc(db, 'users', auth.currentUser.uid);
    const targetUserRef = doc(db, 'users', userId);

    try {
      const targetUserDoc = allMembers.find((u) => u.id === userId);
      if (!targetUserDoc) {
        console.log(`Creating document for user ${userId}`);
        await setDoc(targetUserRef, {
          username: 'Unknown',
          email: '',
          followers: [],
          following: [],
        }, { merge: true });
      }

      const currentUserDoc = allMembers.find((u) => u.id === auth.currentUser.uid);
      if (!currentUserDoc) {
        console.log(`Creating document for current user ${auth.currentUser.uid}`);
        await setDoc(currentUserRef, {
          username: auth.currentUser.displayName || 'Unknown',
          email: auth.currentUser.email || '',
          followers: [],
          following: [],
        }, { merge: true });
      }

      if (isFollowing) {
        console.log(`Unfollowing ${userId}`);
        await updateDoc(currentUserRef, { following: arrayRemove(userId) });
        await updateDoc(targetUserRef, { followers: arrayRemove(auth.currentUser.uid) });
        setFollowing(following.filter((id) => id !== userId));
      } else {
        console.log(`Following ${userId}`);
        await updateDoc(currentUserRef, { following: arrayUnion(userId) });
        await updateDoc(targetUserRef, { followers: arrayUnion(auth.currentUser.uid) });
        setFollowing([...following, userId]);
      }
    } catch (err) {
      console.error('Follow error:', err);
    }
  };

  return (
    <div className="w-80 hidden lg:block p-4 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          placeholder="Search Twitter"
          className="pl-10 rounded-full w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 py-2 px-4"
        />
      </div>
      <div className="border border-gray-200 rounded-lg bg-white">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Trends for you
          </h3>
        </div>
        <div className="p-4 space-y-4">
          {[{ topic: 'ReactJS', posts: '120K' }, { topic: 'ShadcnUI', posts: '85K' }, { topic: 'TailwindCSS', posts: '95K' }].map((trend, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{trend.topic}</p>
                <p className="text-sm text-gray-500">{trend.posts} posts</p>
              </div>
              <button className="text-blue-500 hover:underline text-sm">Follow</button>
            </div>
          ))}
        </div>
      </div>
      <div className="border border-gray-200 rounded-lg bg-white">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-bold">Who to follow</h3>
        </div>
        {/* <div className="p-4 space-y-4">
          {suggestedUsers.map((user) => {
            const isFollowing = following.includes(user.id);
            return (
              <div key={user.id} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-white text-xl font-bold">
                    {user.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold">{user.username}</p>
                    <p className="text-sm text-gray-500">@{user.username.toLowerCase()}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleFollow(user.id, isFollowing)}
                  className={`border border-blue-500 px-3 py-1 rounded text-sm ${
                    isFollowing ? 'bg-blue-500 text-white hover:bg-blue-600' : 'text-blue-500 hover:bg-blue-50'
                  }`}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              </div>
            );
          })}
        </div> */}
      </div>
      <div className="border border-gray-200 rounded-lg bg-white">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-bold">Members</h3>
        </div>
        {/* <div className="p-4 space-y-4 max-h-64 overflow-y-auto">
          {allMembers.map((user) => {
            const isFollowing = following.includes(user.id);
            return (
              <div key={user.id} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-white text-xl font-bold">
                    {user.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold">{user.username}</p>
                    <p className="text-sm text-gray-500">@{user.username.toLowerCase()}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleFollow(user.id, isFollowing)}
                  className={`border border-blue-500 px-3 py-1 rounded text-sm ${
                    isFollowing ? 'bg-blue-500 text-white hover:bg-blue-600' : 'text-blue-500 hover:bg-blue-50'
                  }`}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              </div>
            );
          })}
        </div> */}
      </div>
    </div>
  );
}

export default Widgets;