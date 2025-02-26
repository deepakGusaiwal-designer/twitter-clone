import React, { useState } from 'react';
import { Button } from '@mui/material';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
// import './TweetBox.css';

function TweetBox() {
  const [tweetMessage, setTweetMessage] = useState('');

  const sendTweet = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'posts'), {
      text: tweetMessage,
      timestamp: serverTimestamp(),
      username: 'user', // Replace with actual user data
      likes: 0,
      retweets: 0,
    });
    setTweetMessage('');
  };

  return (
    <div className="tweetBox">
      <form>
        <input
          value={tweetMessage}
          onChange={(e) => setTweetMessage(e.target.value)}
          placeholder="What's happening?"
        />
        <Button onClick={sendTweet}>Tweet</Button>
      </form>
    </div>
  );
}

export default TweetBox;