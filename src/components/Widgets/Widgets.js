import React from 'react';
import { Search, TrendingUp } from 'lucide-react';

function Widgets() {
  return (
    <div className="w-80 hidden lg:block p-4 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          placeholder="Search Twitter"
          className="pl-10 rounded-full w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 py-2 px-4"
        />
      </div>

      {/* Trends Section */}
      <div className="border border-gray-200 rounded-lg bg-white">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Trends for you
          </h3>
        </div>
        <div className="p-4 space-y-4">
          {[
            { topic: 'ReactJS', posts: '120K' },
            { topic: 'ShadcnUI', posts: '85K' },
            { topic: 'TailwindCSS', posts: '95K' },
          ].map((trend, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{trend.topic}</p>
                <p className="text-sm text-gray-500">{trend.posts} posts</p>
              </div>
              <button className="text-blue-500 hover:underline text-sm">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Who to Follow Section */}
      <div className="border border-gray-200 rounded-lg bg-white">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-bold">Who to follow</h3>
        </div>
        <div className="p-4 space-y-4">
          {[
            { name: 'John Doe', handle: '@johndoe' },
            { name: 'Jane Smith', handle: '@janesmith' },
          ].map((user, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gray-200" /> {/* Placeholder avatar */}
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.handle}</p>
                </div>
              </div>
              <button className="border border-blue-500 text-blue-500 hover:bg-blue-50 rounded px-3 py-1 text-sm">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Widgets;