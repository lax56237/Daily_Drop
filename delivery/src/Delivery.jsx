import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import "./Delivery.css"


function Delivery() {
    const navigate = useNavigate();
    const [orderSheet, setOrderSheet] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/delivery/get-ordersheet', { credentials: 'include' })
            .then(res => {
                if (res.status === 404) {
                    return res.json().then(data => {
                        if (data.redirect === 'home' || data.msg === 'No ordersheet found') {
                            navigate('/home');
                            return;
                        }
                        throw new Error('No ordersheet found');
                    });
                }
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (data && data.orderId) {
                    setOrderSheet(data);
                    setLoading(false);
                }
            })
            .catch(error => {
                console.error('Error fetching ordersheet:', error);
                setLoading(false);
                setOrderSheet(null);
            });
    }, [navigate]);

    if (loading) return <p>Loading order details...</p>;
    if (!orderSheet) return (
        <div>
            <p>No order details found.</p>
            <button onClick={() => navigate('/home')}>Go Back to Home</button>
        </div>
    );

    const { user, items } = orderSheet;

    return (
        <div className="delivery-container">
            <h2>Delivery Details</h2>
            <button onClick={() => navigate('/verify')}>reached to the coustomer ? </button>

            <h3>Customer Info</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Name:</strong> {user.address?.name || 'N/A'}</p>
            <p><strong>Address:</strong></p>
            <ul>
                <li><strong>Street:</strong> {user.address?.street || 'N/A'}</li>
                <li><strong>City:</strong> {user.address?.city || 'N/A'}</li>
                <li><strong>State:</strong> {user.address?.state || 'N/A'}</li>
                <li><strong>Pincode:</strong> {user.address?.pincode || 'N/A'}</li>
                <li><strong>Landmark:</strong> {user.address?.landmark || 'N/A'}</li>
            </ul>

            <h3 style={{ marginTop: '30px' }}>Products</h3>
            {items.map((item, i) => (
                <div key={i} className="item-card" style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
                    <p><strong>Item:</strong> {item.product.name}</p>
                    <img src={item.product.imageUrl} alt={item.product.name} style={{ width: '100px' }} />
                    <p><strong>Price:</strong> ₹{item.product.price}</p>

                    <h4>Seller Info</h4>
                    <p><strong>Shop:</strong> {item.seller?.shopName || 'Unknown Shop'}</p>
                    <p><strong>Phone:</strong> {item.seller?.phone || 'N/A'}</p>
                    <p><strong>Address:</strong></p>
                    <ul>
                        <li><strong>Street:</strong> {item.seller?.address || 'N/A'}</li>
                        <li><strong>City:</strong> {item.seller?.city || 'N/A'}</li>
                        <li><strong>State:</strong> {item.seller?.state || 'N/A'}</li>
                        <li><strong>Pincode:</strong> {item.seller?.pincode || 'N/A'}</li>
                        <li><strong>Landmark:</strong> {item.seller?.landmark || 'N/A'}</li>
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default Delivery;
