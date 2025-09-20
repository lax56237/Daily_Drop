import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/EditProfile.css';

function EditProfile() {
    const navigate = useNavigate();
    const [details, setDetails] = useState({
        shopName: '',
        phone: '',
        pincode: '',
        address: '',
        city: '',
        state: '',
        landmark: ''
    });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetch(`http://localhost:5000/seller/details`, {
            method: "GET",
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                setDetails({
                    shopName: data.details?.shopName || '',
                    phone: data.details?.phone || '',
                    pincode: data.details?.pincode || '',
                    address: data.details?.address || '',
                    city: data.details?.city || '',
                    state: data.details?.state || '',
                    landmark: data.details?.landmark || ''
                });
                setLoading(false);
            })
            .catch(() => navigate('/'));
    }, [navigate]);

    const validateForm = () => {
        const newErrors = {};
        
        if (!details.shopName.trim()) newErrors.shopName = 'Shop name is required';
        if (!details.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!details.pincode.trim()) newErrors.pincode = 'Pincode is required';
        if (!details.address.trim()) newErrors.address = 'Address is required';
        if (!details.city.trim()) newErrors.city = 'City is required';
        if (!details.state.trim()) newErrors.state = 'State is required';
        
        if (details.phone && !/^[0-9]{10}$/.test(details.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }
        
        if (details.pincode && !/^[0-9]{6}$/.test(details.pincode)) {
            newErrors.pincode = 'Please enter a valid 6-digit pincode';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setUpdating(true);
        
        try {
            const res = await fetch(`http://localhost:5000/seller/update-detail`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(details)
            });

            if (res.ok) {
                navigate("/Seller");
            } else {
                alert("Update failed");
            }
        } catch (error) {
            alert("Network error. Please try again.");
        } finally {
            setUpdating(false);
        }
    };

    const handleInputChange = (field, value) => {
        setDetails({ ...details, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: '' });
        }
    };

    if (loading) {
        return (
            <div className="edit-profile-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="edit-profile-page">
            <div className="edit-profile-container">
                <div className="profile-header">
                    <div className="header-icon">👤</div>
                    <h1>Edit Profile</h1>
                    <p>Update your shop information</p>
                </div>

                <div className="profile-form">
                    <div className="form-section">
                        <h3>Shop Details</h3>
                        <div className="form-group">
                            <label>Shop Name</label>
                            <div className="input-wrapper">
                                <span className="input-icon">🏪</span>
                                <input
                                    type="text"
                                    value={details.shopName}
                                    placeholder="Enter shop name"
                                    onChange={e => handleInputChange('shopName', e.target.value)}
                                    className={errors.shopName ? 'error' : ''}
                                />
                            </div>
                            {errors.shopName && <span className="error-text">{errors.shopName}</span>}
                        </div>

                        <div className="form-group">
                            <label>Phone Number </label>
                            <div className="input-wrapper">
                                <span className="input-icon">📱</span>
                                <input
                                    type="tel"
                                    value={details.phone}
                                    placeholder="Enter phone number"
                                    onChange={e => handleInputChange('phone', e.target.value)}
                                    className={errors.phone ? 'error' : ''}
                                />
                            </div>
                            {errors.phone && <span className="error-text">{errors.phone}</span>}
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Address Information</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>City </label>
                                <div className="input-wrapper">
                                    <span className="input-icon">🏙️</span>
                                    <input
                                        type="text"
                                        value={details.city}
                                        placeholder="Enter city"
                                        onChange={e => handleInputChange('city', e.target.value)}
                                        className={errors.city ? 'error' : ''}
                                    />
                                </div>
                                {errors.city && <span className="error-text">{errors.city}</span>}
                            </div>

                            <div className="form-group">
                                <label>State </label>
                                <div className="input-wrapper">
                                    <span className="input-icon">🗺️</span>
                                    <input
                                        type="text"
                                        value={details.state}
                                        placeholder="Enter state"
                                        onChange={e => handleInputChange('state', e.target.value)}
                                        className={errors.state ? 'error' : ''}
                                    />
                                </div>
                                {errors.state && <span className="error-text">{errors.state}</span>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Pincode </label>
                            <div className="input-wrapper">
                                <span className="input-icon">📮</span>
                                <input
                                    type="text"
                                    value={details.pincode}
                                    placeholder="Enter 6-digit pincode"
                                    onChange={e => handleInputChange('pincode', e.target.value)}
                                    className={errors.pincode ? 'error' : ''}
                                />
                            </div>
                            {errors.pincode && <span className="error-text">{errors.pincode}</span>}
                        </div>

                        <div className="form-group">
                            <label>Address </label>
                            <div className="input-wrapper">
                                <span className="input-icon">🏠</span>
                                <textarea
                                    value={details.address}
                                    placeholder="Enter complete address"
                                    onChange={e => handleInputChange('address', e.target.value)}
                                    className={errors.address ? 'error' : ''}
                                    rows="3"
                                />
                            </div>
                            {errors.address && <span className="error-text">{errors.address}</span>}
                        </div>

                        <div className="form-group">
                            <label>Landmark (Optional)</label>
                            <div className="input-wrapper">
                                <span className="input-icon">📍</span>
                                <input
                                    type="text"
                                    value={details.landmark}
                                    placeholder="Enter nearby landmark"
                                    onChange={e => handleInputChange('landmark', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button 
                            className="btn-cancel" 
                            onClick={() => navigate('/Seller')}
                            disabled={updating}
                        >
                            Cancel
                        </button>
                        <button 
                            className={`btn-update ${updating ? 'loading' : ''}`}
                            onClick={handleSubmit}
                            disabled={updating}
                        >
                            {updating ? (
                                <>
                                    <span className="loading-spinner-btn"></span>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <span className="btn-icon">💾</span>
                                    Update Profile
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditProfile;