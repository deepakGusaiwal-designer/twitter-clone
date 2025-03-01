import React from 'react';
import {  ConfigProvider} from 'antd';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Feed from './components/Feed/Feed';
import Widgets from './components/Widgets/Widgets';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PrivateRoute from './components/PrivateRoute';
import './App.css';
function App() {
  return (
   <ConfigProvider
    theme={{
      token: {
        // Seed Token
        fontFamily: 'inherit',
        colorPrimary: '#00b96b',
        borderRadius: 2,

        // Alias Token
        colorBgContainer: '#f6ffed',
      },
    }}
  >
    <Router>
      {/* <div className="max-w-[1300px] mx-auto flex"> */}
      <div className="appMain">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <div className="app-grid-main">
                  <Sidebar />
                  <Feed />
                  <Widgets />
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/hashtag/:hashtag"
            element={
              <PrivateRoute>
                <div className="app-grid-main">
                  <Sidebar />
                  <Feed />
                  <Widgets />
                </div>
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  </ConfigProvider>
  );
}

export default App;