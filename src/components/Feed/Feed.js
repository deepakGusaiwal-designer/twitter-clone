import React, { useState, useEffect } from 'react';
import TweetBox from '../TweetBox/TweetBox';
import Post from '../Post/Post';
import { db } from '../../firebase/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="feed">
      <div className="feed__header">
        <h2>Home</h2>
      </div>
      <TweetBox />
      {posts.map((post) => (
        <Post
          key={post.id}
          username={post.username}
          text={post.text}
          timestamp={post.timestamp}
        />
      ))}
    </div>
  );
}

export default Feed;