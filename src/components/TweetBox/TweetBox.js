// src/components/TweetBox/TweetBox.js
import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase';

async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'YOUR_UPLOAD_PRESET'); // Replace with your preset
  const response = await fetch('https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload', {
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
        imageUrl,
        edited: false, // New field to track edits
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
      {/* <form onSubmit={sendTweet} className="space-y-4">
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
      </form> */}
      <form onSubmit={sendTweet} className="space-y-4">
        <div className="w-full mb-4 rounded-lg dark:bg-gray-700">
            <div className="bg-white rounded-t-lg dark:bg-gray-800">
                <label for="comment" className="sr-only">What's in your mind</label>
                <textarea 
                  id="comment" 
                  rows={4}
                  style={{minHeight: 100}}
                  value={tweetMessage}
                  onChange={(e) => setTweetMessage(e.target.value)}
                  placeholder="What's happening?"
                  className="block h-10 w-full rounded-xl bg-white px-5 py-3 text-base text-gray-900 outline-2 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset focus:outline-indigo-600 sm:text-sm/6 border border-gray-300 focus:border-indigo-600 resize-none">
                  </textarea>
            </div>
            <div className="flex items-center justify-end py-2">
            {imageFile && <p className="text-sm text-gray-500">Image selected: {imageFile.name}</p>}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <label className="flex items-center gap-2 text-blue-500 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="hidden"
                />
                <span className="inline-flex justify-center items-center p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                  <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                          <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                      </svg>
                  </span>
              </label>
              <button 
              type="submit"
              disabled={!tweetMessage && !imageFile} 
              className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800 disabled:bg-gray-400">
                  Post comment
              </button>
            </div>
        </div>
      </form>
    </div>
  );
}

export default TweetBox;