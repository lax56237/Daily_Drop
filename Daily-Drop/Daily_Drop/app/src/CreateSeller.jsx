import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateSeller.css';

function CreateSeller() {
  const navigate = useNavigate();
  const [shopName, setShopName] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [landmark, setLandmark] = useState('');

  const handleCreate = async () => {
    const sellerId = localStorage.getItem("sellerId");
    const res = await fetch("http://localhost:5000/seller/register-detail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sellerId,
        shopName,
        phone,
        pincode,
        address,
        city,
        state,
        landmark
      })
    });
    const data = await res.json();
    console.log("Seller detail created:", data);
    navigate("/Seller");
  };

  return (
    <form className="create-seller-form">
      <h1>Create Seller</h1>

      <div className="input-group">
        <label>Shop Name</label>
        <input type="text" placeholder="Enter shop name" onChange={e => setShopName(e.target.value)} />
      </div>

      <div className="input-group">
        <label>Phone Number</label>
        <input type="text" placeholder="Enter phone number" onChange={e => setPhone(e.target.value)} />
      </div>

      <div className="input-group">
        <label>Pincode</label>
        <input type="text" placeholder="Enter pincode" onChange={e => setPincode(e.target.value)} />
      </div>

      <div className="input-group">
        <label>Address</label>
        <input type="text" placeholder="Area or street" onChange={e => setAddress(e.target.value)} />
      </div>

      <div className="input-group">
        <label>City</label>
        <input type="text" placeholder="Enter city" onChange={e => setCity(e.target.value)} />
      </div>

      <div className="input-group">
        <label>State</label>
        <input type="text" placeholder="Enter state" onChange={e => setState(e.target.value)} />
      </div>

      <div className="input-group">
        <label>Landmark</label>
        <input type="text" placeholder="Enter landmark" onChange={e => setLandmark(e.target.value)} />
      </div>

      <button type="button" onClick={handleCreate}>Create Seller</button>
    </form>
  );
}

export default CreateSeller;
