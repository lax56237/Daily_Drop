import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [hoverIndex, setHoverIndex] = useState(-1);
    const [topCategories, setTopCategories] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    
    const boxRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        checkSessionAndFetchData();
    }, [navigate]);

    const checkSessionAndFetchData = async () => {
        try {
            const sessionResponse = await fetch('http://localhost:5000/user/check-session', {
                credentials: 'include'
            });
            const sessionData = await sessionResponse.json();

            if (sessionData.msg === 'Logged in') {
                await Promise.all([fetchTopCategories(), fetchTopProducts()]);
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error('Session check error:', err);
            setError('Session expired. Please login again.');
            setTimeout(() => navigate('/'), 2000);
        }
    };

    const fetchTopCategories = async () => {
        try {
            const response = await fetch("http://localhost:5000/products/top-categories");
            const data = await response.json();
            setTopCategories(data || []);
        } catch (err) {
            console.warn('Failed to load categories:', err);
        }
    };

    const fetchTopProducts = async () => {
        try {
            const response = await fetch("http://localhost:5000/products/top-selling");
            const data = await response.json();
            setTopProducts(data || []);
        } catch (err) {
            console.warn('Failed to load top products:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (query.trim() === '') {
            setSuggestions([]);
            setSearchLoading(false);
            return;
        }

        setSearchLoading(true);
        const delay = setTimeout(async () => {
            try {
                const response = await fetch(`http://localhost:5000/products/search?q=${query}`);
                const data = await response.json();
                setSuggestions(data || []);
            } catch (err) {
                setSuggestions([]);
            } finally {
                setSearchLoading(false);
            }
        }, 300);
        
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

    const handleSuggestionClick = (text) => {
        setQuery(text);
        setSuggestions([]);
        handleSearch(text);
    };

    const handleSearch = (searchQuery = query) => {
        if (searchQuery.trim() !== '') {
            navigate(`/products?name=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (hoverIndex >= 0 && suggestions[hoverIndex]) {
                handleSuggestionClick(suggestions[hoverIndex].name);
            } else {
                handleSearch();
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHoverIndex(prev => Math.min(prev + 1, suggestions.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHoverIndex(prev => Math.max(prev - 1, -1));
        }
    };

    const handleCategoryClick = (category) => {
        navigate(`/products?name=${encodeURIComponent(category)}`);
    };

    if (loading) {
        return (
            <div className="home-container">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading Daily Drop...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="home-container">
            {/* Header */}
            <div className="home-header">
                <div className="brand-section">
                    <img src="/dailydrop.jpeg" alt="Daily Drop Logo" className="logo" />
                    <div className="brand-text">
                        <h1 className="brand-title">Daily Drop</h1>
                        <p className="brand-subtitle">Your local marketplace</p>
                    </div>
                </div>
                
                <div className="header-actions">
                    <button 
                        className="header-btn cart-btn"
                        onClick={() => navigate("/cart")}
                    >
                        <span className="btn-icon">🛒</span>
                        <span>Cart</span>
                    </button>
                    <button 
                        className="header-btn orders-btn"
                        onClick={() => navigate("/order")}
                    >
                        <span className="btn-icon">📦</span>
                        <span>Orders</span>
                    </button>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    <span>{error}</span>
                </div>
            )}

            {/* Welcome Section */}
            <div className="welcome-section">
                <div className="welcome-content">
                    <h2 className="welcome-title">Welcome to Daily Drop!</h2>
                    <p className="welcome-description">
                        Discover amazing products from local businesses in your area
                    </p>
                </div>
            </div>

            {/* Search Section */}
            <div className="search-section">
                <div className="search-container" ref={boxRef}>
                    <div className="search-input-wrapper">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            value={query}
                            placeholder="Search for products, categories, brands..."
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyPress}
                            className="search-input"
                        />
                        {searchLoading && (
                            <div className="search-loading">
                                <div className="loading-spinner-small"></div>
                            </div>
                        )}
                    </div>
                    <button 
                        className="search-button"
                        onClick={() => handleSearch()}
                        disabled={!query.trim()}
                    >
                        <span className="btn-icon">🚀</span>
                        Search
                    </button>
                    
                    {suggestions.length > 0 && (
                        <div className="suggestions-dropdown">
                            <div className="suggestions-header">
                                <span className="suggestions-title">Product Suggestions</span>
                                <span className="suggestions-count">{suggestions.length} found</span>
                            </div>
                            <ul className="suggestions-list">
                                {suggestions.map((s, i) => (
                                    <li
                                        key={i}
                                        className={`suggestion-item ${i === hoverIndex ? 'highlighted' : ''}`}
                                        onMouseEnter={() => setHoverIndex(i)}
                                        onMouseLeave={() => setHoverIndex(-1)}
                                        onClick={() => handleSuggestionClick(s.name)}
                                    >
                                        <span className="suggestion-icon">🔍</span>
                                        <span className="suggestion-text">{s.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Carousel Section */}
            <div className="carousel-section">
                <div className="carousel-container">
                    <div className="carousel-slider">
                        <div className="carousel-slide">
                            <img src="/one.avif" alt="Featured Product 1" />
                        </div>
                        <div className="carousel-slide">
                            <img src="/two.jpg" alt="Featured Product 2" />
                        </div>
                        <div className="carousel-slide">
                            <img src="/three.webp" alt="Featured Product 3" />
                        </div>
                        <div className="carousel-slide">
                            <img src="/four.avif" alt="Featured Product 4" />
                        </div>
                        {/* Duplicate slides for seamless loop */}
                        <div className="carousel-slide">
                            <img src="/one.avif" alt="Featured Product 1" />
                        </div>
                        <div className="carousel-slide">
                            <img src="/two.jpg" alt="Featured Product 2" />
                        </div>
                        <div className="carousel-slide">
                            <img src="/three.webp" alt="Featured Product 3" />
                        </div>
                        <div className="carousel-slide">
                            <img src="/four.avif" alt="Featured Product 4" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Categories */}
            <div className="categories-section">
                <div className="section-header">
                    <h3 className="section-title">
                        <span className="section-icon">🏷️</span>
                        Top Categories
                    </h3>
                    <p className="section-subtitle">Browse our most popular product categories</p>
                </div>
                
                {topCategories.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📂</div>
                        <p>No categories available</p>
                    </div>
                ) : (
                    <div className="categories-grid">
                        {topCategories.map((category, index) => (
                            <div 
                                key={index} 
                                className="category-card"
                                onClick={() => handleCategoryClick(category)}
                            >
                                <div className="category-icon">🛍️</div>
                                <span className="category-name">{category}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Top Products */}
            <div className="products-section">
                <div className="section-header">
                    <h3 className="section-title">
                        <span className="section-icon">⭐</span>
                        Top Selling Products
                    </h3>
                    <p className="section-subtitle">Most popular items from local businesses</p>
                </div>
                
                {topProducts.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📦</div>
                        <p>No products available</p>
                    </div>
                ) : (
                    <div className="products-container">
                        <div className="products-grid">
                            {topProducts.map((product, index) => (
                                <div 
                                    key={index} 
                                    className="product-card"
                                    onClick={() => handleSearch(product.name)}
                                >
                                    <div className="product-image-container">
                                        <img 
                                            src={product.imageUrl} 
                                            alt={product.name}
                                            className="product-image"
                                        />
                                    </div>
                                    <div className="product-info">
                                        <h4 className="product-name">{product.name}</h4>
                                        <div className="product-price">₹{product.price}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;