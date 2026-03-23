import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE } from '../../config/api';

const AdminSections = () => {
    const [sections, setSections] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ title: '', type: 'latest_products', category_id: '', order_index: 0, is_active: true });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchSections();
        fetchCategories();
    }, []);

    const fetchSections = async () => {
        try {
            const res = await fetch(`${API_BASE}/sections`);
            const data = await res.json();
            setSections(data || []);
        } catch (error) {
            toast.error('Failed to load sections');
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_BASE}/categories`);
            const data = await res.json();
            setCategories(data || []);
        } catch (error) {
            toast.error('Failed to load categories');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            const url = editingId ? `${API_BASE}/admin/sections/${editingId}` : `${API_BASE}/admin/sections`;
            const method = editingId ? 'PUT' : 'POST';

            const payload = {
                ...formData,
                category_id: formData.type === 'category_products' ? formData.category_id : null
            };

            const res = await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.success) {
                toast.success(editingId ? 'Section updated' : 'Section created');
                fetchSections();
                resetForm();
            } else {
                toast.error(data.error || 'Operation failed');
            }
        } catch (error) {
            toast.error('Connection error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this section?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_BASE}/admin/sections/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Section deleted');
                fetchSections();
            } else {
                toast.error('Failed to delete section');
            }
        } catch (error) {
            toast.error('Connection error');
        }
    };

    const editSection = (section) => {
        setIsEditing(true);
        setEditingId(section.section_id);
        setFormData({
            title: section.title,
            type: section.type,
            category_id: section.category_id || '',
            order_index: section.order_index || 0,
            is_active: section.is_active === 1 || section.is_active === true
        });
        window.scrollTo(0, 0);
    };

    const resetForm = () => {
        setIsEditing(false);
        setEditingId(null);
        setFormData({ title: '', type: 'latest_products', category_id: '', order_index: 0, is_active: true });
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Dynamic Home Sections</h1>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6">{isEditing ? 'Edit Section' : 'Add New Section'}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full border-gray-300 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full border-gray-300 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="latest_products">Latest 4 Products</option>
                            <option value="category_products">Products from Category</option>
                        </select>
                    </div>

                    {formData.type === 'category_products' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Category</label>
                            <select
                                value={formData.category_id}
                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                className="w-full border-gray-300 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">-- Choose Category --</option>
                                {categories.map(c => <option key={c.category_id} value={c.category_id}>{c.category_name}</option>)}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                        <input
                            type="number"
                            value={formData.order_index}
                            onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                            className="w-full border-gray-300 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex items-center gap-2 col-span-1 md:col-span-2">
                        <input
                            type="checkbox"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            id="isActive"
                            className="w-4 h-4 text-blue-600 rounded"
                        />
                        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Section Active on Homepage</label>
                    </div>

                    <div className="col-span-1 md:col-span-2 flex gap-4">
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                            {isEditing ? 'Update Section' : 'Create Section'}
                        </button>
                        {isEditing && (
                            <button type="button" onClick={resetForm} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                <table className="min-w-[600px] md:min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type / Target</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sections.map(section => (
                            <tr key={section.section_id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{section.section_id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{section.order_index}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{section.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {section.type === 'latest_products' ? 'Latest Products' : `Category: ${categories.find(c => c.category_id === section.category_id)?.category_name || section.category_id}`}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${section.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {section.is_active ? 'Active' : 'Hidden'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => editSection(section)} className="text-blue-600 hover:text-blue-900 mr-4">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(section.section_id)} className="text-red-600 hover:text-red-900">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminSections;
