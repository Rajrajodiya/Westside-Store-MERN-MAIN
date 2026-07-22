import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import SeoHelmet from "./SeoHelmet";
import "../assets/styles/ProductList.css";

export default function ProductList() {
    const { category } = useParams();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("search");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [gridCols, setGridCols] = useState(3);
    const [priceFilter, setPriceFilter] = useState([0, 10000]);
    const [sortOrder, setSortOrder] = useState("asc");

    // Responsive grid columns — clamps to 2 on mobile, 3 on tablet
    const [winWidth, setWinWidth] = useState(window.innerWidth);
    useEffect(() => {
      const onResize = () => setWinWidth(window.innerWidth);
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }, []);
    const effectiveCols = useMemo(() => {
      if (winWidth < 640) return Math.min(gridCols, 2);
      if (winWidth < 1024) return Math.min(gridCols, 3);
      return gridCols;
    }, [gridCols, winWidth]);

    useEffect(() => {
        setLoading(true);
        const fetchFn = searchQuery
            ? axios.get(`/api/products/search?q=${encodeURIComponent(searchQuery)}`).then(r => setProducts(r.data.results || []))
            : axios.get(`/api/products/${category}`).then(r => setProducts(r.data.results || []));
        fetchFn.catch(console.error).finally(() => setLoading(false));
    }, [category, searchQuery]);

    const filteredProducts = products
        .filter(p => p.price >= priceFilter[0] && p.price <= priceFilter[1])
        .sort((a, b) => sortOrder === "asc" ? a.price - b.price : b.price - a.price);

    const pageTitle = searchQuery ? `Search: ${searchQuery}` : (category || "").toUpperCase();
    const pageDesc = searchQuery
        ? `Search results for "${searchQuery}" at WestSide Store.`
        : `Shop the latest ${category || ""} collection at WestSide Store.`;

    if (loading) return <LoadingSpinner text={`Loading ${category || "products"}...`} fullPage />;

    return (
        <>
            <SeoHelmet title={pageTitle} description={pageDesc} />
            <div className="product-list-container">
                <h1 className="category-heading">{searchQuery ? `Search: "${searchQuery}"` : `${pageTitle} PRODUCTS`}</h1>
                <div className="product-list">
                    <div className="controls">
                        <div className="control-group">
                            <span>Grid:</span>
                            {[2, 3, 4].map(n => (
                                <button
                                  key={n}
                                  className={gridCols === n ? "grid-btn active" : "grid-btn"}
                                  onClick={() => setGridCols(n)}
                                  data-responsive={n > 2 ? "hidden-mobile" : ""}
                                >{n}</button>
                            ))}
                        </div>
                        <div className="control-group">
                            <span>Price:</span>
                            <input type="number" placeholder="Min" onBlur={e => setPriceFilter([+e.target.value || 0, priceFilter[1]])} />
                            <span>—</span>
                            <input type="number" placeholder="Max" onBlur={e => setPriceFilter([priceFilter[0], +e.target.value || 10000])} />
                        </div>
                        <div className="control-group">
                            <span>Sort:</span>
                            <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="sort-select">
                                <option value="asc">Price: Low to High</option>
                                <option value="desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                    {filteredProducts.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <p className="text-gray-400 text-base">No products found.</p>
                        </div>
                    ) : (
                        <div className="grid" style={{ gridTemplateColumns: `repeat(${effectiveCols}, 1fr)` }}>
                            {filteredProducts.map(p => (
                                <Link key={p._id} to={`/products/${p.category}/${p._id}`} className="card">
                                    <img src={p.mainImage} alt={p.imageName} loading="lazy" />
                                    <div className="card-content">
                                        <h3>{p.imageName}</h3>
                                        <p>₹{p.price}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
