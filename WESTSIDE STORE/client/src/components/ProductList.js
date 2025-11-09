import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../assets/styles/ProductList.css";

export default function ProductList() {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [gridCols, setGridCols] = useState(3);
    const [priceFilter, setPriceFilter] = useState([0, 10000]);
    const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"

    useEffect(() => {
        axios.get(`http://localhost:5000/api/products/${category}`)
            .then(res => setProducts(res.data))
            .catch(console.error);
    }, [category]);

    // Filter products by price
    let filteredProducts = products.filter(p =>
        p.price >= priceFilter[0] && p.price <= priceFilter[1]
    );

    // Sort products by price
    filteredProducts = filteredProducts.sort((a, b) =>
        sortOrder === "asc" ? a.price - b.price : b.price - a.price
    );

    return (
        <div className="product-list-container">
            <h1 className="category-heading">{category.toUpperCase()} PRODUCTS</h1>
            <div className="product-list">
                <div className="controls">
                    <div className="control-group">
                        <span>Grid:</span>
                        {[2, 3, 4].map(n => (
                            <button
                                key={n}
                                className={gridCols === n ? "grid-btn active" : "grid-btn"}
                                onClick={() => setGridCols(n)}
                            >
                                {n}
                            </button>
                        ))}
                    </div>
                    <div className="control-group">
                        <span>Price:</span>
                        <input
                            type="number"
                            placeholder="Min"
                            onBlur={e => setPriceFilter([+e.target.value || 0, priceFilter[1]])}
                        />
                        <span>—</span>
                        <input
                            type="number"
                            placeholder="Max"
                            onBlur={e => setPriceFilter([priceFilter[0], +e.target.value || 10000])}
                        />
                    </div>
                    <div className="control-group">
                        <span>Sort:</span>
                        <select
                            value={sortOrder}
                            onChange={e => setSortOrder(e.target.value)}
                            className="sort-select"
                        >
                            <option value="asc">Price: Low to High</option>
                            <option value="desc">Price: High to Low</option>
                        </select>
                    </div>
                </div>
                <div className="grid" style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}>
                    {filteredProducts.map(p => (
                        <Link key={p._id} to={`/${category}/${p._id}`} className="card">
                            <img src={p.mainImage} alt={p.imageName} />
                            <div className="card-content">
                                <h3>{p.imageName}</h3>
                                <p>₹{p.price}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
