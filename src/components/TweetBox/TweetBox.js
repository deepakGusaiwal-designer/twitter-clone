// src/components/TweetBox/TweetBox.js
import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase';

async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'Twitter-clone'); // Replace with your preset
  const response = await fetch('https://api.cloudinary.com/v1_1/dat4shohe/image/upload', {
    method: 'POST',
    body: formData,
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.secure_url;
}

function TweetBox() {
  const [tweetMessage, setTweetMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');

  const sendTweet = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    let imageUrl = null;
    if (imageFile) {
      try {
        imageUrl = await uploadImage(imageFile);
      } catch (err) {
        setError('Failed to upload image: ' + err.message);
        return;
      }
    }

    try {
      await addDoc(collection(db, 'posts'), {
        text: tweetMessage,
        timestamp: serverTimestamp(),
        username: auth.currentUser.displayName,
        userId: auth.currentUser.uid,
        likes: 0,
        retweets: 0,
        likedBy: [],
        retweetedBy: [],
        imageUrl, // Store Cloudinary URL
      });
      setTweetMessage('');
      setImageFile(null);
      setError('');
    } catch (err) {
      setError('Failed to post tweet: ' + err.message);
    }
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
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-blue-500 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="hidden"
            />
            <span>Add Image</span>
          </label>
        </div>
        {imageFile && <p className="text-sm text-gray-500">Image selected: {imageFile.name}</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!tweetMessage && !imageFile}
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