import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Tag, Users, MessageSquare, Settings, Star } from 'lucide-react';
import { API_BASE } from '../../config/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        products: 0,
        categories: 0,
        reviews: 0,
        users: 1
    });
    const [recentReviews, setRecentReviews] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem('adminToken');
            const headers = { 'Authorization': `Bearer ${token}` };

            try {
                const [prodRes, catRes, revRes] = await Promise.all([
                    fetch(`${API_BASE}/admin/products`, { headers }),
                    fetch(`${API_BASE}/admin/categories`, { headers }),
                    fetch(`${API_BASE}/admin/reviews`, { headers })
                ]);

                const products = prodRes.ok ? await prodRes.json() : [];
                const categories = catRes.ok ? await catRes.json() : [];
                const reviews = revRes.ok ? await revRes.json() : [];

                setStats({
                    products: Array.isArray(products) ? products.length : 0,
                    categories: Array.isArray(categories) ? categories.length : 0,
                    reviews: Array.isArray(reviews) ? reviews.length : 0,
                    users: 1
                });

                // Get last 5 reviews
                setRecentReviews(Array.isArray(reviews) ? reviews.slice(0, 5) : []);
            } catch (error) {
                console.error("Error loading dashboard stats:", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleTimeString()}</div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Products"
                    value={stats.products}
                    icon={Package}
                    color="blue"
                />
                <StatCard
                    title="Categories"
                    value={stats.categories}
                    icon={Tag}
                    color="purple"
                />
                <StatCard
                    title="Total Reviews"
                    value={stats.reviews}
                    icon={Star}
                    color="yellow"
                />
                <StatCard
                    title="Active Admins"
                    value={stats.users}
                    icon={Users}
                    color="indigo"
                />
            </div>

            {/* Recent Activity / Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-gray-800">Recent Reviews</h3>
                        <MessageSquare size={20} className="text-gray-400" />
                    </div>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto">
                        {recentReviews.length === 0 ? (
                            <p className="text-gray-500 text-sm text-center py-10">No recent reviews.</p>
                        ) : (
                            recentReviews.map(review => (
                                <div key={review.review_id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${review.is_approved ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">{review.customer_name}</p>
                                            <p className="text-xs text-gray-500">{review.product_name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex text-yellow-500 mb-1 justify-end">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={i < review.rating ? 0 : 2} />
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        )}
                        <Link to="/shop-admin-portal-2002/reviews" className="block text-center text-sm text-blue-600 hover:underline pt-2">Manage All Reviews</Link>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-gray-800">Quick Actions</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link to="/shop-admin-portal-2002/products" className="p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors text-sm font-medium flex flex-col items-center justify-center gap-2 text-center group">
                            <Package size={24} className="text-gray-400 group-hover:text-blue-600" />
                            Manage Products
                        </Link>
                        <Link to="/shop-admin-portal-2002/categories" className="p-4 bg-gray-50 rounded-xl hover:bg-purple-50 hover:text-purple-600 transition-colors text-sm font-medium flex flex-col items-center justify-center gap-2 text-center group">
                            <Tag size={24} className="text-gray-400 group-hover:text-purple-600" />
                            Manage Categories
                        </Link>
                        <Link to="/shop-admin-portal-2002/reviews" className="p-4 bg-gray-50 rounded-xl hover:bg-yellow-50 hover:text-yellow-600 transition-colors text-sm font-medium flex flex-col items-center justify-center gap-2 text-center group">
                            <Star size={24} className="text-gray-400 group-hover:text-yellow-600" />
                            Review Moderation
                        </Link>
                        <button className="p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-sm font-medium flex flex-col items-center justify-center gap-2 text-center group opacity-50 cursor-not-allowed">
                            <Users size={24} className="text-gray-400 group-hover:text-indigo-600" />
                            Manage Admins (Soon)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, color }) => {
    const colorClasses = {
        blue: "bg-blue-100 text-blue-600",
        purple: "bg-purple-100 text-purple-600",
        green: "bg-green-100 text-green-600",
        indigo: "bg-indigo-100 text-indigo-600",
        yellow: "bg-yellow-100 text-yellow-600",
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-xl ${colorClasses[color]}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
        </div>
    );
};

export default AdminDashboard;
