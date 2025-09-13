import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Forgot from './Forgot';
import Login from './Login';
import CreateSeller from './CreateSeller';
import Seller from './Seller';
import ChangePass from './ChangePass';
import CreateAcc from './CreateAcc';
import Products from './Products';
import EditProfile from './EditProfile';
import Orders from './Orders';
import Verification from './Verification';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Forgot" element={<Forgot />} />
        <Route path="/CreateSeller" element={<CreateSeller />} />
        <Route path="/Seller" element={<Seller />} />
        <Route path ="/ChangePass" element={<ChangePass/>}/>
        <Route path ="/CreateAcc" element={<CreateAcc/>}/>
        <Route path ="/EditProfile" element={<EditProfile/>}/>
        <Route path ="/Products" element={<Products/>}/>
        <Route path ="/Orders" element={<Orders/>}/>
        <Route path ="/verification" element={<Verification/>}/>
      </Routes>
    </>
  );
}

export default App;
