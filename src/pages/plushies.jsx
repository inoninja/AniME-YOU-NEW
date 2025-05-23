import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './categories.css';

const Plushies = () => {
    const navigate = useNavigate();
    const [plushiesData, setPlushiesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOption, setSortOption] = useState('default');

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                // Use the direct fetch approach
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://animeyoubackend.onrender.com';
                
                // Get user and token from localStorage
                const user = JSON.parse(localStorage.getItem('user'));
                const token = user ? user.token : null;
                
                // Include the token in your request headers
                const response = await fetch(`${API_URL}/api/admin/products`, {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                
                const products = await response.json();
                
                // Filter only plushie products
                const plushieProducts = products.filter(product => 
                    product.category === 'plushies'
                );
                
                setPlushiesData(plushieProducts);
            } catch (err) {
                console.error('Failed to fetch plushie products:', err);
                setError('Failed to load products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    // Function to handle sort change
    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    // Function to sort products based on selected option
    const getSortedProducts = () => {
        switch (sortOption) {
            case 'price-low-to-high':
                return [...plushiesData].sort((a, b) => a.price - b.price);
            case 'price-high-to-low':
                return [...plushiesData].sort((a, b) => b.price - a.price);
            default:
                return plushiesData; // No sorting
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="app">
            <div className="product-section">
                <h2 className="section-heading">PLUSHIES</h2>
                
                {/* Sorting dropdown positioned to the right */}
                <div className="sorting-controls">
                    <label htmlFor="sort-select">Sort by:</label>
                    <select 
                        id="sort-select"
                        className="sort-select"
                        value={sortOption}
                        onChange={handleSortChange}
                    >
                        <option value="default">Default</option>
                        <option value="price-low-to-high">Price: Low to High</option>
                        <option value="price-high-to-low">Price: High to Low</option>
                    </select>
                </div>
                
                <div className="product-grid">
                    {getSortedProducts().length > 0 ? (
                        getSortedProducts().map(product => (
                            <div 
                                key={product._id || product.id}
                                className="product-card" 
                                onClick={() => navigate(`/product/${product._id || product.id}`)}
                            >
                                <img src={product.imageUrl || product.image} alt={product.name} />
                                <h3>{product.name}</h3>
                                <p className="price">₱{product.price.toFixed(2)}</p>
                            </div>
                        ))
                    ) : (
                        <p className="no-products">No plushie products available at the moment.</p>
                    )}
                </div>
                <hr className="bottom-line" />
            </div>
            
            {/* Space for footer */}
            <div style={{ height: "200px" }}></div>
        </div>
    );
};

export default Plushies;
