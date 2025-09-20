import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../style/Address.css'

function Address() {
    const navigate = useNavigate();

    const [address, setAddress] = useState({
        name: "",
        phone: "",
        pincode: "",
        street: "",
        city: "",
        state: "",
        landmark: ""
    });

    useEffect(() => {
        fetch("http://localhost:5000/user/address", {
            credentials: "include"
        })
            .then(res => {
                if (!res.ok) throw new Error("Unauthorized");
                return res.json();
            })
            .then(data => {
                const a = data.address || {};
                setAddress({
                    name: a.name || "",
                    phone: a.phone || "",
                    pincode: a.pincode || "",
                    street: a.street || "",
                    city: a.city || "",
                    state: a.state || "",
                    landmark: a.landmark || ""
                });
            })
            .catch(err => console.warn("No address loaded:", err.message));
    }, []);

    const handleChange = (field, value) => {
        setAddress(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        const res = await fetch("http://localhost:5000/user/address", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(address)
        });

        const data = await res.json();
        if (res.ok) {
            navigate("/order");
        } else {
            alert(data.msg || "Failed to save address");
        }

    };

    return (
        <div className="address-container">
            <h2>Delivery Address</h2>

            <input
                type="text"
                placeholder="Full Name"
                value={address.name}
                onChange={e => handleChange("name", e.target.value)}
            /><br /><br />

            <input
                type="text"
                placeholder="Phone Number"
                value={address.phone}
                onChange={e => handleChange("phone", e.target.value)}
            /><br /><br />

            <input
                type="text"
                placeholder="Pincode"
                value={address.pincode}
                onChange={e => handleChange("pincode", e.target.value)}
            /><br /><br />

            <input
                type="text"
                placeholder="Area / Street"
                value={address.street}
                onChange={e => handleChange("street", e.target.value)}
            /><br /><br />

            <input
                type="text"
                placeholder="City"
                value={address.city}
                onChange={e => handleChange("city", e.target.value)}
            /><br /><br />

            <input
                type="text"
                placeholder="State"
                value={address.state}
                onChange={e => handleChange("state", e.target.value)}
            /><br /><br />

            <input
                type="text"
                placeholder="Landmark"
                value={address.landmark}
                onChange={e => handleChange("landmark", e.target.value)}
            /><br /><br />

            <button onClick={handleSubmit}>Order</button>
        </div>
    );
}

export default Address;
