// src/components/Post/Post.js
import React, { useState } from 'react';
import { Heart, Repeat } from 'lucide-react';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase';

function Post({ id, username, text, timestamp, likes, retweets, likedBy, retweetedBy }) {
  const [localLikes, setLocalLikes] = useState(likes || 0);
  const [localRetweets, setLocalRetweets] = useState(retweets || 0);
  const [isLiked, setIsLiked] = useState(likedBy?.includes(auth.currentUser?.uid) || false);
  const [isRetweeted, setIsRetweeted] = useState(retweetedBy?.includes(auth.currentUser?.uid) || false);

  const handleLike = async () => {
    if (!auth.currentUser) return; // Ensure user is logged in
    const postRef = doc(db, 'posts', id);
    if (isLiked) {
      await updateDoc(postRef, {
        likes: localLikes - 1,
        likedBy: arrayRemove(auth.currentUser.uid),
      });
      setLocalLikes(localLikes - 1);
      setIsLiked(false);
    } else {
      await updateDoc(postRef, {
        likes: localLikes + 1,
        likedBy: arrayUnion(auth.currentUser.uid),
      });
      setLocalLikes(localLikes + 1);
      setIsLiked(true);
    }
  };

  const handleRetweet = async () => {
    if (!auth.currentUser) return; // Ensure user is logged in
    const postRef = doc(db, 'posts', id);
    if (isRetweeted) {
      await updateDoc(postRef, {
        retweets: localRetweets - 1,
        retweetedBy: arrayRemove(auth.currentUser.uid),
      });
      setLocalRetweets(localRetweets - 1);
      setIsRetweeted(false);
    } else {
      await updateDoc(postRef, {
        retweets: localRetweets + 1,
        retweetedBy: arrayUnion(auth.currentUser.uid),
      });
      setLocalRetweets(localRetweets + 1);
      setIsRetweeted(true);
    }
  };

  return (
    <div className="flex p-4 border-b">
      <div className="w-12 h-12 rounded-full bg-gray-200 mr-4" /> {/* Avatar */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{username}</h3>
          <p className="text-sm text-gray-500">
            {timestamp && new Date(timestamp.toDate()).toLocaleString()}
          </p>
        </div>
        <p>{text}</p>
        <div className="flex gap-6 mt-2">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 text-gray-500 hover:text-red-500 ${isLiked ? 'text-red-500' : ''}`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500' : ''}`} />
            <span>{localLikes}</span>
          </button>
          <button
            onClick={handleRetweet}
            className={`flex items-center gap-2 text-gray-500 hover:text-green-500 ${isRetweeted ? 'text-green-500' : ''}`}
          >
            <Repeat className="w-5 h-5" />
            <span>{localRetweets}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Post;