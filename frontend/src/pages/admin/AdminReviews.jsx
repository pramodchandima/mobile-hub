import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Star, X, Check, Clock, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE } from '../../config/api';

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form, setForm] = useState({
        customerName: '',
        rating: 5,
        comment: ''
    });

    useEffect(() => {
        fetchReviews();
        fetchProducts();
    }, []);

    const fetchReviews = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_BASE}/admin/reviews`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setReviews(data || []);
        } catch (error) {
            toast.error('Failed to load reviews');
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_BASE}/products`);
            const data = await res.json();
            setProducts(data || []);
        } catch (error) {
            toast.error('Failed to load products');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_BASE}/admin/reviews/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Review deleted');
                fetchReviews();
            } else {
                toast.error('Failed to delete review');
            }
        } catch (error) {
            toast.error('Connection error');
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            let url = '';
            let method = '';

            if (editingItem) {
                url = `${API_BASE}/admin/reviews/${editingItem.review_id}`;
                method = 'PUT';
            } else {
                url = `${API_BASE}/admin/reviews`;
                method = 'POST';
            }

            const payload = {
                product_id: null,
                customer_name: form.customerName,
                rating: form.rating,
                comment: form.comment
            };

            const res = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.success) {
                toast.success(editingItem ? 'Review updated' : 'Review added');
                fetchReviews();
                closeModal();
            } else {
                toast.error(data.error || 'Operation failed');
            }
        } catch (error) {
            toast.error('Connection error');
        }
    };

    const openModal = (item = null) => {
        setEditingItem(item);
        if (item) {
            setForm({
                customerName: item.customer_name,
                rating: item.rating,
                comment: item.comment || ''
            });
        } else {
            setForm({
                customerName: '',
                rating: 5,
                comment: ''
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
    };

    const renderStars = (rating) => {
        return (
            <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < rating ? "currentColor" : "none"} className={i < rating ? "text-yellow-500" : "text-gray-300"} />
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tighter italic">Review Moderation</h1>
                <button onClick={() => openModal()} className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700 font-bold shadow-lg shadow-blue-900/10 transition-all">
                    <Plus size={20} /> Add Review
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto text-xs md:text-sm">
                    <table className="min-w-[1000px] w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest hidden md:table-cell">Date</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Rating</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest w-1/4">Review</th>
                                <th className="px-6 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-50">
                            {reviews.length > 0 ? reviews.map(review => (
                                <tr key={review.review_id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-medium hidden md:table-cell">
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                                        {review.customer_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {renderStars(review.rating)}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 italic max-w-md break-words truncate">
                                        "{review.comment}"
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2 text-xs">
                                            <button onClick={() => openModal(review)} className="p-2 md:px-3 md:py-2 bg-gray-50 text-gray-500 rounded-lg hover:bg-gray-100 border border-gray-100 flex items-center gap-1.5" title="Edit">
                                                <Edit2 size={14} /> <span className="hidden md:inline">Edit</span>
                                            </button>
                                            <button onClick={() => handleDelete(review.review_id)} className="p-2 md:px-3 md:py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 border border-red-100 flex items-center gap-1.5" title="Delete">
                                                <Trash2 size={14} /> <span className="hidden md:inline">Delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-10 text-center text-gray-500 font-medium">
                                        No reviews have been posted yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-zoom-in">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-black uppercase tracking-tighter">{editingItem ? 'Edit Review' : 'Create New Review'}</h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-800 transition-colors"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Customer Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. John Doe"
                                    value={form.customerName}
                                    onChange={e => setForm({ ...form, customerName: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-100 outline-none font-bold text-gray-800"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Rating (Number of Stars)</label>
                                <div className="flex gap-2 p-3 bg-gray-50 rounded-xl">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setForm({ ...form, rating: star })}
                                            className={`p-2 rounded-lg transition-all ${form.rating >= star ? 'text-yellow-500 scale-110' : 'text-gray-300'}`}
                                        >
                                            <Star size={24} fill={form.rating >= star ? "currentColor" : "none"} />
                                        </button>
                                    ))}
                                    <span className="ml-auto text-xs font-black text-gray-400 flex items-center mr-2">{form.rating} / 5</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Review Content</label>
                                <textarea
                                    required
                                    rows="4"
                                    placeholder="Write the review content here..."
                                    value={form.comment}
                                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-100 outline-none font-bold text-gray-800 resize-none"
                                ></textarea>
                            </div>

                            <div className="flex gap-3 pt-6 border-t border-gray-100">
                                <button type="button" onClick={closeModal} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors">Abort</button>
                                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 shadow-xl shadow-blue-900/20 transition-all">
                                    {editingItem ? 'Save Changes' : 'Post Review'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReviews;
