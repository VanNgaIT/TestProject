import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import UserList from './components/UserList';
import DistributionCharts from './components/DistributionCharts';
import MapComponent from './components/Map';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/userlist" element={<UserList />} />
        <Route path="/distribution" element={<DistributionCharts />} />
        <Route path="/maps" element={<MapComponent />} />
        <Route path="/" element={<UserList />} />
      </Routes>
    </Router>
  );
};

export default App;
