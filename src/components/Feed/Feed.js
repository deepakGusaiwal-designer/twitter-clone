// src/components/Feed/Feed.js
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
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex-1 max-w-2xl border-x">
      <div className="sticky top-0 bg-white p-4 border-b">
        <h2 className="text-xl font-bold">Home</h2>
      </div>
      <TweetBox />
      {/* <div className="p-4">
        {posts.map((post) => (
          <Post
            key={post.id}
            id={post.id}
            username={post.username}
            text={post.text}
            timestamp={post.timestamp}
            likes={post.likes}
            retweets={post.retweets}
            likedBy={post.likedBy}
            retweetedBy={post.retweetedBy}
            imageUrl={post.imageUrl}
            videoUrl={post.videoUrl}
          />
        ))}
      </div> */}
    </div>
  );
}

export default Feed;