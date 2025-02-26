// src/components/TweetBox/TweetBox.js
import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase';

function TweetBox() {
  const [tweetMessage, setTweetMessage] = useState('');

  const sendTweet = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return; // Ensure user is logged in
    await addDoc(collection(db, 'posts'), {
      text: tweetMessage,
      timestamp: serverTimestamp(),
      username: auth.currentUser.displayName,
      userId: auth.currentUser.uid,
      likes: 0,
      retweets: 0,
      likedBy: [], // Array to track users who liked (for toggling)
      retweetedBy: [], // Array to track users who retweeted
    });
    setTweetMessage('');
  };

  return (
    <div className="p-4 border-b">
      <form onSubmit={sendTweet} className="space-y-4">
        <input
          value={tweetMessage}
          onChange={(e) => setTweetMessage(e.target.value)}
          placeholder="What's happening?"
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!tweetMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400 hover:bg-blue-600"
          >
            Tweet
          </button>
        </div>
      </form>
    </div>
  );
}

export default TweetBox;