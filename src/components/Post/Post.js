// src/components/Post/Post.js
import React, { useState, useEffect } from 'react';
import { Heart, Repeat } from 'lucide-react';
import { doc, updateDoc, arrayUnion, arrayRemove, collection, addDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase';

function Post({ id, username, text, timestamp, likes, retweets, likedBy, retweetedBy, imageUrl }) {
  const [localLikes, setLocalLikes] = useState(likes || 0);
  const [localRetweets, setLocalRetweets] = useState(retweets || 0);
  const [isLiked, setIsLiked] = useState(likedBy?.includes(auth.currentUser?.uid) || false);
  const [isRetweeted, setIsRetweeted] = useState(retweetedBy?.includes(auth.currentUser?.uid) || false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const commentsRef = collection(db, 'posts', id, 'comments');
    const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
      setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [id]);

  const handleLike = async () => {
    if (!auth.currentUser) return;
    const postRef = doc(db, 'posts', id);
    if (isLiked) {
      await updateDoc(postRef, { likes: localLikes - 1, likedBy: arrayRemove(auth.currentUser.uid) });
      setLocalLikes(localLikes - 1);
      setIsLiked(false);
    } else {
      await updateDoc(postRef, { likes: localLikes + 1, likedBy: arrayUnion(auth.currentUser.uid) });
      setLocalLikes(localLikes + 1);
      setIsLiked(true);
    }
  };

  const handleRetweet = async () => {
    if (!auth.currentUser) return;
    const postRef = doc(db, 'posts', id);
    if (isRetweeted) {
      await updateDoc(postRef, { retweets: localRetweets - 1, retweetedBy: arrayRemove(auth.currentUser.uid) });
      setLocalRetweets(localRetweets - 1);
      setIsRetweeted(false);
    } else {
      await updateDoc(postRef, { retweets: localRetweets + 1, retweetedBy: arrayUnion(auth.currentUser.uid) });
      setLocalRetweets(localRetweets + 1);
      setIsRetweeted(true);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!auth.currentUser || !comment) return;
    const commentsRef = collection(db, 'posts', id, 'comments');
    await addDoc(commentsRef, {
      text: comment,
      username: auth.currentUser.displayName,
      userId: auth.currentUser.uid,
      timestamp: new Date().toISOString(),
    });
    setComment('');
  };

  return (
    <div className="flex p-4 border-b">
      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-white text-xl font-bold mr-4">
        {username?.charAt(0).toUpperCase() || 'U'}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{username}</h3>
          <p className="text-sm text-gray-500">
            {timestamp && new Date(timestamp.toDate()).toLocaleString()}
          </p>
        </div>
        <p>{text}</p>
        {imageUrl && <img src={imageUrl} alt="Tweet" className="mt-2 max-w-full h-auto rounded-lg" />}
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
        <form onSubmit={handleComment} className="mt-2 flex gap-2">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!comment}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            Comment
          </button>
        </form>
        <div className="mt-2 space-y-2">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-white text-sm font-bold">
                {c.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-semibold text-sm">{c.username}</p>
                <p className="text-sm">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Post;