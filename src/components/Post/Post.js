import React from 'react';
import { Avatar } from '@mui/material';

function Post({ username, text, timestamp }) {
  return (
    <div className="post">
      <Avatar />
      <div className="post__body">
        <div className="post__header">
          <h3>{username}</h3>
          <p>{new Date(timestamp?.toDate()).toLocaleString()}</p>
        </div>
        <p>{text}</p>
        <div className="post__footer">
          <span>Like</span>
          <span>Retweet</span>
        </div>
      </div>
    </div>
  );
}

export default Post;