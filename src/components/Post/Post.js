// src/components/Post/Post.js
import React, { useState, useEffect } from 'react';
import { Heart, Repeat, MoreHorizontal, MessageSquare } from 'lucide-react';
import { doc, updateDoc, arrayUnion, arrayRemove, collection, addDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase';
import { Dropdown } from 'antd';
import { Link } from 'react-router-dom';

function Post({ id, username, text, timestamp, likes, retweets, likedBy, retweetedBy, imageUrl, edited, userId }) {
  const [localLikes, setLocalLikes] = useState(likes || 0);
  const [localRetweets, setLocalRetweets] = useState(retweets || 0);
  const [isLiked, setIsLiked] = useState(likedBy?.includes(auth.currentUser?.uid) || false);
  const [isRetweeted, setIsRetweeted] = useState(retweetedBy?.includes(auth.currentUser?.uid) || false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [showCommentBox, setShowCommentBox] = useState(false);

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

  const handleDelete = async () => {
    if (!auth.currentUser || auth.currentUser.uid !== userId) return;
    await deleteDoc(doc(db, 'posts', id));
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser || auth.currentUser.uid !== userId || edited) return;
    const postRef = doc(db, 'posts', id);
    await updateDoc(postRef, { text: editText, edited: true });
    setIsEditing(false);
  };

  const items = [
    {
      key: '1',
      label: (
        <button
          onClick={() => setIsEditing(true)}
          disabled={edited}
          className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${edited ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Edit
        </button>
      ),
    },
    {
      key: '2',
      label: (
        <button
          onClick={handleDelete}
          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
        >
          Delete
        </button>
      ),
    },
  ];

  const isOwner = auth.currentUser && auth.currentUser.uid === userId;

  // Render text with clickable hashtags
  const renderTextWithHashtags = (text) => {
    const hashtagRegex = /#[\w]+/g;
    const parts = text.split(hashtagRegex);
    const hashtags = text.match(hashtagRegex) || [];
    let result = [];
    parts.forEach((part, index) => {
      result.push(<span key={`part-${index}`}>{part}</span>);
      if (hashtags[index]) {
        const hashtag = hashtags[index];
        result.push(
          <Link
            key={`hashtag-${index}`}
            to={`/hashtag/${hashtag.slice(1)}`}
            className="text-blue-500 underline hover:text-blue-700"
          >
            {hashtag}
          </Link>
        );
      }
    });
    return result;
  };

  return (
    <div className="flex p-4 border-b relative">
      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-white text-xl font-bold mr-4">
        {username?.charAt(0).toUpperCase() || 'U'}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{username}</h3>
          <p className="text-sm text-gray-500">
            {timestamp && new Date(timestamp.toDate()).toLocaleString()}
            {edited && <span className="ml-2 text-xs text-gray-400">(Edited)</span>}
          </p>
          {isOwner && (
            <div className="ml-auto">
              <Dropdown menu={{ items }} trigger={['click']}>
                <a onClick={(e) => e.preventDefault()} className="text-gray-500 hover:text-gray-700">
                  <MoreHorizontal className="w-5 h-5" />
                </a>
              </Dropdown>
            </div>
          )}
        </div>
        {isEditing ? (
          <form onSubmit={handleEdit} className="mt-2">
            <input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2 mt-2">
              <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-gray-800 px-4 py-1 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <p>{renderTextWithHashtags(text)}</p>
            {imageUrl && <img src={imageUrl} alt="Tweet" className="mt-2 max-w-full h-auto rounded-lg" />}
          </>
        )}
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
          <button
            onClick={() => setShowCommentBox(!showCommentBox)}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-500"
          >
            <MessageSquare className="w-5 h-5" />
            <span>{comments.length}</span>
          </button>
        </div>
        {showCommentBox && (
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
        )}
        <div className="mt-2 space-y-2">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-white text-sm font-bold">
                {c.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-semibold text-sm">{c.username}</p>
                <p className="text-sm">{renderTextWithHashtags(c.text)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Post;