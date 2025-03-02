// src/components/TweetBox/TweetBox.js
import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, doc, setDoc, increment, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase';
import {DeleteOutlined } from '@ant-design/icons';
import { ImageUp, Smile } from 'lucide-react';
import { Button, Popover, AutoComplete } from 'antd';
import Picker from 'emoji-picker-react';

async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'Twitter-clone');
  const response = await fetch('https://api.cloudinary.com/v1_1/dat4shohe/image/upload', {
    method: 'POST',
    body: formData,
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.secure_url;
}

function TweetBox({ onTweetPosted }) {
  const [tweetMessage, setTweetMessage] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [hashtagOptions, setHashtagOptions] = useState([]);
  const [trendingHashtags, setTrendingHashtags] = useState([]);

  useEffect(() => {
    const fetchTrendingHashtags = async () => {
      try {
        const q = query(collection(db, 'hashtags'), orderBy('count', 'desc'), limit(5));
        const snapshot = await getDocs(q);
        const hashtags = snapshot.docs.map((doc) => ({ value: doc.id, label: doc.id }));
        console.log('Trending Hashtags:', hashtags);
        setTrendingHashtags(hashtags);
      } catch (err) {
        console.error('Error fetching trending hashtags:', err);
        setError('Failed to load trending hashtags');
      }
    };
    fetchTrendingHashtags();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const url = await uploadImage(file);
        setImageFile(file);
        setImageUrl(url);
      } catch (err) {
        setError('Failed to upload image: ' + err.message);
      }
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImageUrl(null);
  };

  const onEmojiClick = (emojiObject) => {
    setTweetMessage((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const extractHashtags = (text) => {
    const hashtagRegex = /#[\w]+/g;
    return text.match(hashtagRegex) || [];
  };

  const updateHashtags = async (hashtags) => {
    const batch = [];
    hashtags.forEach((hashtag) => {
      const hashtagRef = doc(db, 'hashtags', hashtag.toLowerCase());
      batch.push(
        setDoc(hashtagRef, {
          count: increment(1),
          lastUsed: serverTimestamp(),
        }, { merge: true })
      );
    });
    await Promise.all(batch);
  };

  const handleTweetChange = (value) => {
    setTweetMessage(value);
    const lastWord = value.split(' ').pop();
    if (lastWord.startsWith('#')) {
      const prefix = lastWord.slice(1).toLowerCase();
      const filteredOptions = trendingHashtags
        .filter((ht) => ht.value.toLowerCase().startsWith(prefix))
        .map((ht) => ({ value: ht.value, label: ht.value }));
      setHashtagOptions(filteredOptions.length > 0 ? filteredOptions : trendingHashtags);
    } else {
      setHashtagOptions([]);
    }
  };

  const onSelectHashtag = (value) => {
    const words = tweetMessage.split(' ');
    words.pop();
    const newMessage = [...words, value].join(' ') + ' ';
    setTweetMessage(newMessage);
    setHashtagOptions([]);
  };

  const sendTweet = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    if (!tweetMessage && !imageUrl) return;

    try {
      const hashtags = extractHashtags(tweetMessage);
      await addDoc(collection(db, 'posts'), {
        text: tweetMessage,
        timestamp: serverTimestamp(),
        username: auth.currentUser.displayName,
        userId: auth.currentUser.uid,
        likes: 0,
        retweets: 0,
        likedBy: [],
        retweetedBy: [],
        imageUrl: imageUrl || null,
        edited: false,
        hashtags: hashtags.map((ht) => ht.toLowerCase()),
      });

      if (hashtags.length > 0) {
        await updateHashtags(hashtags);
      }

      setTweetMessage('');
      setImageFile(null);
      setImageUrl(null);
      setError('');
      setHashtagOptions([]);
      if (onTweetPosted) onTweetPosted(); // Close modal after posting
    } catch (err) {
      setError('Failed to post tweet: ' + err.message);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={sendTweet} className="space-y-4">
        <div className="w-full mb-4 rounded-lg dark:bg-gray-700">
          <div className="bg-white rounded-t-lg dark:bg-gray-800">
            <AutoComplete
              value={tweetMessage}
              options={hashtagOptions}
              onChange={handleTweetChange}
              onSelect={onSelectHashtag}
              className="block w-full h-auto border-none"
              placeholder="What's happening?"
            >
              <textarea
                className="block h-auto w-full rounded-xl bg-white px-5 py-3 text-base text-gray-900 outline-2 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset focus:outline-indigo-600 sm:text-sm/6 border border-gray-300 focus:border-indigo-600 resize-none"
              />
            </AutoComplete>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-blue-500 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <span className="inline-flex justify-center items-center p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                  <ImageUp style={{ fontSize: '16px' }} />
                </span>
              </label>
              <Popover
                content={<Picker onEmojiClick={onEmojiClick} />}
                trigger="click"
                open={showEmojiPicker}
                onOpenChange={(open) => setShowEmojiPicker(open)}
              >
                <span className="inline-flex justify-center items-center p-2 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                  <Smile  style={{ fontSize: '16px' }} />
                </span>
              </Popover>
            </div>
            {imageUrl && (
              <div className="flex items-center gap-2">
                <img src={imageUrl} alt="Thumbnail" className="w-12 h-12 object-cover rounded" />
                <Button
                  icon={<DeleteOutlined />}
                  size="small"
                  danger
                  onClick={removeImage}
                  className="ml-2"
                >
                  Remove
                </Button>
              </div>
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button
              type="primary"
              htmlType="submit"
              disabled={!tweetMessage && !imageUrl}
              className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 disabled:bg-gray-400"
            >
              Post Tweet
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default TweetBox;