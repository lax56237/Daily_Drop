import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/CreateSeller.css';

function CreateSeller() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    shopName: '',
    phone: '',
    pincode: '',
    address: '',
    city: '',
    state: '',
    landmark: ''
  });

  const validateForm = () => {
    const { shopName, phone, pincode, address, city, state } = formData;

    if (!shopName.trim()) {
      setError("Shop name is required");
      return false;
    }

    if (!phone.trim() || phone.length < 10) {
      setError("Please enter a valid 10-digit phone number");
      return false;
    }

    if (!pincode.trim() || pincode.length !== 6) {
      setError("Please enter a valid 6-digit pincode");
      return false;
    }

    if (!address.trim()) {
      setError("Address is required");
      return false;
    }

    if (!city.trim()) {
      setError("City is required");
      return false;
    }

    if (!state.trim()) {
      setError("State is required");
      return false;
    }

    return true;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(''); 
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const sellerId = localStorage.getItem("sellerId");
      const res = await fetch("http://localhost:5000/seller/register-detail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId,
          ...formData
        })
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Seller detail created:", data);
        navigate("/Seller");
      } else {
        setError(data.message || "Failed to create seller profile");
      }
    } catch (err) {
      console.error("Error creating seller:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCreate();
    }
  };

  return (
    <div className="create-seller-container">
      <div className="create-seller-box">
        <div className="seller-header">
          <div className="header-icon">🏪</div>
          <h1 className="main-title">Setup Your Shop</h1>
          <p className="header-description">Complete your seller profile to start selling</p>
        </div>

        <div className="seller-form">
          <div className="form-section">
            <h3 className="section-title">
              Shop Information
            </h3>

            <div className="input-row">
              <div className="input-group">
                <label htmlFor="shopName">Shop Name</label>

                <div className="input-wrapper">
                  <input
                    id="shopName"
                    type="text"
                    placeholder="Enter your shop name"
                    value={formData.shopName}
                    onChange={e => handleInputChange('shopName', e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="phone">Phone Number *</label>
                <div className="input-wrapper">
                  <input
                    id="phone"
                    type="tel"
                    placeholder="Enter 10-digit phone number"
                    value={formData.phone}
                    onChange={e => handleInputChange('phone', e.target.value)}
                    onKeyPress={handleKeyPress}
                    maxLength="10"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">
              Shop Address
            </h3>

            <div className="input-row">
              <div className="input-group">
                <label htmlFor="address">Street Address *</label>
                <div className="input-wrapper">
                  <input
                    id="address"
                    type="text"
                    placeholder="Enter street address"
                    value={formData.address}
                    onChange={e => handleInputChange('address', e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="pincode">Pincode *</label>
                <div className="input-wrapper">
                  <input
                    id="pincode"
                    type="text"
                    placeholder="6-digit pincode"
                    value={formData.pincode}
                    onChange={e => handleInputChange('pincode', e.target.value)}
                    onKeyPress={handleKeyPress}
                    maxLength="6"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label htmlFor="city">City *</label>
                <div className="input-wrapper">
                  <input
                    id="city"
                    type="text"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={e => handleInputChange('city', e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="state">State *</label>
                <div className="input-wrapper">
                  <input
                    id="state"
                    type="text"
                    placeholder="Enter state"
                    value={formData.state}
                    onChange={e => handleInputChange('state', e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="landmark">Landmark (Optional)</label>
              <div className="input-wrapper">
                <input
                  id="landmark"
                  type="text"
                  placeholder="Nearby landmark for easy location"
                  value={formData.landmark}
                  onChange={e => handleInputChange('landmark', e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="button"
            className={`create-btn ${loading ? 'loading' : ''}`}
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Setting up your shop...
              </>
            ) : (
              <>
                  <span className="btn-icon">🚀</span>
                  Complete Setup
              </>
            )}
          </button>
        </div>

        <div className="seller-footer">
          <div className="info-card">
            <h4>Why we need this information:</h4>
            <ul>
              <li>✅ To verify your business location</li>
              <li>✅ For customer delivery services</li>
              <li>✅ To display your shop to nearby customers</li>
              <li>✅ For order management and support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateSeller;