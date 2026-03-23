import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { API_BASE, getImageUrl } from '../config/api';
import PublicLayout from '../components/layout/PublicLayout';

const Shop = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const categoryId = searchParams.get('category');

    // States
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState(categoryId ? 'products' : 'categories');
    const [selectedCategoryName, setSelectedCategoryName] = useState('');

    useEffect(() => {
        if (categoryId) {
            fetchProducts(categoryId);
            fetchCategoryName(categoryId);
            setView('products');
        } else {
            fetchCategories();
            setView('categories');
        }
    }, [categoryId]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/categories`);
            const data = await res.json();
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async (catId) => {
        setLoading(true);
        try {
            const url = catId ? `${API_BASE}/products?category=${catId}` : `${API_BASE}/products`;
            const res = await fetch(url);
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategoryName = async (catId) => {
        try {
            // Optimization: if we already have categories, find it there
            if (categories.length > 0) {
                const cat = categories.find(c => c.category_id == catId);
                if (cat) setSelectedCategoryName(cat.category_name);
                return;
            }
            // Otherwise fetch all (simplified for now, ideally an endpoint for single category)
            const res = await fetch(`${API_BASE}/categories`);
            const data = await res.json();
            const cat = data.find(c => c.category_id == catId);
            if (cat) setSelectedCategoryName(cat.category_name);
        } catch (e) { console.error(e); }
    };

    return (
        <PublicLayout>
            <div className="max-w-[1400px] mx-auto px-4 py-8 min-h-screen">
                {/* Header / Breadcrumbs */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
                    <div className="flex items-center gap-6">
                        {view === 'products' && (
                            <button
                                onClick={() => navigate('/shop')}
                                className="p-3 rounded-2xl bg-white/5 border border-white/10 text-neon-cyan hover:bg-neon-cyan/10 transition-all group"
                            >
                                <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                            </button>
                        )}
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">
                            {view === 'categories' ? 'Categories' : <span className="neon-text-gradient">{selectedCategoryName || 'Products'}</span>}
                        </h1>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-96">
                        <div className="relative w-20 h-20">
                            <div className="absolute inset-0 rounded-full border-4 border-neon-cyan/20 border-t-neon-cyan animate-spin"></div>
                            <div className="absolute inset-4 rounded-full border-4 border-neon-purple/20 border-b-neon-purple animate-spin-reverse"></div>
                        </div>
                    </div>
                ) : view === 'categories' ? (
                    // CATEGORIES GRID
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {categories.map((cat) => (
                            <div
                                key={cat.category_id}
                                onClick={() => navigate(`/shop?category=${cat.category_id}`)}
                                className="group cursor-pointer relative overflow-hidden rounded-lg border border-white/5 hover:border-neon-cyan/30 h-96 transition-all duration-500 shadow-2xl"
                            >
                                <img
                                    src={getImageUrl(cat.image_path)}
                                    alt={cat.category_name}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    onError={(e) => { e.target.src = "https://via.placeholder.com/800x800?text=Category"; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/20 to-transparent flex flex-col justify-end p-10">
                                    <h3 className="text-3xl font-black text-white mb-3 tracking-tight">{cat.category_name}</h3>
                                    <p className="text-gray-400 font-medium line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                                        {cat.description || 'Accessing Digital Inventory...'}
                                    </p>
                                    <div className="mt-6 w-0 group-hover:w-16 h-1 bg-neon-cyan transition-all duration-500 rounded-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // PRODUCTS GRID
                    products.length === 0 ? (
                        <div className="text-center py-32 glass-card rounded-lg">
                            <Filter size={64} className="mx-auto mb-6 text-neon-cyan opacity-20" />
                            <p className="text-2xl font-bold text-gray-400 mb-8 uppercase tracking-widest">No Satellites Found in this sector.</p>
                            <button
                                onClick={() => navigate('/shop')}
                                className="bg-neon-cyan/10 border border-neon-cyan text-neon-cyan px-10 py-4 rounded-full font-black hover:bg-neon-cyan hover:text-dark-900 transition-all uppercase tracking-tighter"
                            >
                                Return to Tech Hub
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {products.map((product) => (
                                <div
                                    key={product.product_id}
                                    onClick={() => navigate(`/product/${product.product_id}`)}
                                    className="group glass-card rounded-lg overflow-hidden cursor-pointer p-2 transition-all duration-500 hover:-translate-y-4"
                                >
                                    <div className="aspect-square overflow-hidden rounded-md relative bg-dark-900 flex items-center justify-center">
                                        <img
                                            src={getImageUrl(product.image_path)}
                                            alt={product.product_name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            onError={(e) => { e.target.src = "https://via.placeholder.com/800x800?text=Product"; }}
                                        />
                                        <div className="absolute inset-0 bg-dark-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                            <div className="bg-white text-dark-900 px-6 py-2 rounded-full font-black text-sm uppercase">Initialize</div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-black text-lg text-white group-hover:text-neon-cyan transition-colors mb-2 min-h-[2.5rem] leading-tight">
                                            {product.product_name}
                                        </h4>
                                        <div className="flex flex-col">
                                            <span className="text-lg font-bold text-neon-cyan mb-2">Rs. {Number(product.base_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                            {product.stock_quantity > 0 ? (
                                                <span className="text-[10px] w-fit font-black uppercase tracking-widest text-neon-cyan bg-neon-cyan/10 px-3 py-1 rounded-full border border-neon-cyan/20">Online</span>
                                            ) : (
                                                <span className="text-[10px] w-fit font-black uppercase tracking-widest text-red-500 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">Offline</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </PublicLayout>
    );
};

export default Shop;
