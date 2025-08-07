import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [hoverIndex, setHoverIndex] = useState(-1);
    const [topCategories, setTopCategories] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const boxRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        if (query.trim() === '') {
            setSuggestions([]);
            return;
        }
        const delay = setTimeout(() => {
            fetch(`http://localhost:5000/products/search?q=${query}`)
                .then(res => res.json())
                .then(data => setSuggestions(data))
                .catch(() => setSuggestions([]));
        }, 200);
        return () => clearTimeout(delay);
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (boxRef.current && !boxRef.current.contains(e.target)) {
                setSuggestions([]);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    useEffect(() => {
        fetch("http://localhost:5000/products/top-categories")
            .then(res => res.json())
            .then(data => setTopCategories(data))
            .catch(console.warn);

        fetch("http://localhost:5000/products/top-selling")
            .then(res => res.json())
            .then(data => setTopProducts(data))
            .catch(console.warn);
    }, []);

    const handleSuggestionClick = (text) => {
        setQuery(text);
        setSuggestions([]);
    };

    const handleSearch = () => {
        if (query.trim() !== '') {
            navigate(`/products?name=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <div className="home-page">
            <div className="header">
                <img src="/dailydrop.jpeg" alt="logo" className="logo" />
                <h1>Welcome to Daily Drop</h1>
                <div className="header-buttons">
                    <button onClick={() => navigate("/cart")}>Cart</button>
                    <button onClick={() => navigate("/order")}>Orders</button>
                </div>
            </div>

            <div className="search-container" ref={boxRef}>
                <input
                    type="text"
                    value={query}
                    placeholder="Search for products..."
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
                {suggestions.length > 0 && (
                    <ul className="suggestion-box">
                        {suggestions.map((s, i) => (
                            <li
                                key={i}
                                className={i === hoverIndex ? 'hovered' : ''}
                                onMouseEnter={() => setHoverIndex(i)}
                                onClick={() => handleSuggestionClick(s.name)}
                            >
                                {s.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="carousel">
                <div className="slider">
                    <img src="/one.avif" alt="1" />
                    <img src="/two.jpg" alt="2" />
                    <img src="/three.webp" alt="3" />
                    <img src="/four.avif" alt="4" />
                    {/* duplicates */}
                    <img src="/one.avif" alt="1 clone" />
                    <img src="/two.jpg" alt="2 clone" />
                    <img src="/three.webp" alt="3 clone" />
                    <img src="/four.avif" alt="4 clone" />
                </div>
            </div>

            <div className="top-categories">
                <h2>Top Selling Categories</h2>
                <div className="category-list">
                    {topCategories.map((cat, i) => (
                        <div key={i} className="category-card">{cat}</div>
                    ))}
                </div>
            </div>

            <div className="top-products">
                <h2>Top Selling Products</h2>
                <div className="product-rows">
                    {[0, 1, 2].map(row => (
                        <div key={row} className="product-row">
                            {topProducts.slice(row * 5, row * 5 + 5).map((p, i) => (
                                <div key={i} className="product-card">
                                    <img src={p.imageUrl} alt={p.name} />
                                    <p>{p.name}</p>
                                    <strong>₹{p.price}</strong>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;
