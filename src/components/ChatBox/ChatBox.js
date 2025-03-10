// src/components/ChatBox/ChatBox.js
import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function ChatBox() {
  const [user] = useAuthState(auth);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const usersQuery = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      const allUsers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        isActive: Math.random() > 0.5, // Simulate status
      }));
      setUsers(allUsers.filter((u) => u.id !== user.uid));
    }, (error) => {
      console.error('Users fetch error:', error);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!selectedUser || !user) return;
    const chatId = [user.uid, selectedUser.id].sort().join('_');
    const messagesQuery = query(
      collection(db, 'messages', chatId, 'chat'),
      orderBy('timestamp', 'asc')
    );
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error('Messages fetch error:', error);
    });
    return () => unsubscribe();
  }, [selectedUser, user]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage || !selectedUser || !user) return;

    const chatId = [user.uid, selectedUser.id].sort().join('_');
    await setDoc(
      doc(db, 'messages', chatId),
      { participants: [user.uid, selectedUser.id] },
      { merge: true }
    );

    await addDoc(collection(db, 'messages', chatId, 'chat'), {
      text: newMessage,
      senderId: user.uid,
      receiverId: selectedUser.id,
      timestamp: new Date().toISOString(),
    });

    setNewMessage('');
  };

  const openChat = (u) => {
    setSelectedUser(u);
    setIsChatOpen(true);
  };

  return (
    <div className="fixed bottom-0 right-4 z-50">
      <div className="flex flex-col items-end gap-2">
        {users.map((u) => (
          <div
            key={u.id}
            onClick={() => openChat(u)}
            className="flex items-center gap-2 p-2 bg-white rounded-tl-lg rounded-bl-lg shadow-md cursor-pointer hover:bg-gray-100 w-64"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold">
                {u.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              {u.isActive && (
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
              )}
            </div>
            <span className="text-sm font-semibold truncate">{u.username}</span>
          </div>
        ))}
      </div>

      {isChatOpen && selectedUser && (
        <div className="absolute bottom-0 right-0 w-80 h-[400px] bg-white rounded-lg shadow-xl flex flex-col">
          <div className="bg-blue-500 text-white p-2 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold">
                  {selectedUser.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                {selectedUser.isActive && (
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
                )}
              </div>
              <span className="text-sm font-semibold">{selectedUser.username}</span>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-white hover:text-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderId === user.uid ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-2 rounded-lg ${
                    msg.senderId === user.uid ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="text-xs opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="p-2 border-t flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newMessage}
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 disabled:bg-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ChatBox;