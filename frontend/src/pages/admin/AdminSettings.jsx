import React, { useState, useEffect } from 'react';
import { Upload, X, Save, Video } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE, getImageUrl } from '../../config/api';

const AdminSettings = () => {
    const [settings, setSettings] = useState({ hero_images: [], promo_video: '' });
    const [previewImages, setPreviewImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch(`${API_BASE}/settings`);
            const data = await res.json();
            if (data) {
                setSettings({
                    hero_images: data.hero_images || [],
                    promo_video: data.promo_video || ''
                });
                setPreviewImages(data.hero_images || []);
                setVideoPreview(data.promo_video || '');
            }
        } catch (error) {
            toast.error('Failed to load settings');
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + previewImages.length > 5) {
            toast.error('Maximum 5 images allowed');
            return;
        }

        setSelectedFiles(prev => [...prev, ...files]);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        const newPreviews = [...previewImages];
        newPreviews.splice(index, 1);
        setPreviewImages(newPreviews);

        // Complex logic: distinguishing between old and new files
        // For simplicity, we keep track of old images that weren't deleted
        const oldImages = settings.hero_images.filter(img => newPreviews.includes(img));
        setSettings(prev => ({ ...prev, hero_images: oldImages }));

        // Remove from selected files if it's a new file
        const fileIndex = index - settings.hero_images.length;
        if (fileIndex >= 0) {
            const newSelected = [...selectedFiles];
            newSelected.splice(fileIndex, 1);
            setSelectedFiles(newSelected);
        }
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    const removeVideo = () => {
        setVideoFile(null);
        setVideoPreview('');
        setSettings(prev => ({ ...prev, promo_video: '' }));
    };

    const handleSaveHero = async () => {
        setIsLoading(true);
        const formData = new FormData();
        const existingImages = previewImages.filter(src => !src.startsWith('blob:'));
        formData.append('existingImages', JSON.stringify(existingImages));

        selectedFiles.forEach(file => {
            formData.append('images', file);
        });

        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_BASE}/admin/settings/hero`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Hero images updated');
                fetchSettings();
                setSelectedFiles([]);
            } else {
                toast.error(data.error || 'Failed to update hero images');
            }
        } catch (error) {
            toast.error('Connection error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveVideo = async () => {
        setIsLoading(true);
        const formData = new FormData();
        if (!videoFile && videoPreview) {
            formData.append('existingVideo', videoPreview);
        } else if (videoFile) {
            formData.append('video', videoFile);
        }

        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_BASE}/admin/settings/video`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Promo video updated');
                fetchSettings();
                setVideoFile(null);
            } else {
                toast.error(data.error || 'Failed to update promo video');
            }
        } catch (error) {
            toast.error('Connection error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Site Settings</h1>

            {/* Hero Images Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Hero Background Carousel (Max 5)</h2>
                    <button
                        onClick={handleSaveHero}
                        disabled={isLoading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
                    >
                        <Save size={20} /> Save Hero Images
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    {previewImages.map((src, index) => (
                        <div key={index} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group">
                            <img src={src.startsWith('blob:') ? src : getImageUrl(src)} alt={`Hero ${index}`} className="w-full h-full object-cover" />
                            <button
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                    {previewImages.length < 5 && (
                        <label className="flex flex-col items-center justify-center aspect-video bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                            <Upload size={24} className="text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">Add Image</span>
                            <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                        </label>
                    )}
                </div>
            </div>

            {/* Promo Video Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Promotional Video Auto-Play</h2>
                    <button
                        onClick={handleSaveVideo}
                        disabled={isLoading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
                    >
                        <Save size={20} /> Save Promo Video
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-full max-w-lg aspect-video bg-gray-100 rounded-xl overflow-hidden relative flex items-center justify-center">
                        {videoPreview ? (
                            <>
                                <video src={videoPreview.startsWith('blob:') ? videoPreview : getImageUrl(videoPreview)} className="w-full h-full object-cover" controls />
                                <button
                                    onClick={removeVideo}
                                    className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                                >
                                    <X size={20} />
                                </button>
                            </>
                        ) : (
                            <div className="text-gray-400 flex flex-col items-center">
                                <Video size={48} className="mb-2 opacity-50" />
                                <span>No video selected</span>
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <label className="flex items-center gap-2 px-6 py-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors w-max">
                            <Upload size={24} className="text-gray-500" />
                            <span className="font-medium text-gray-700">Upload Video File (MP4/WebM)</span>
                            <input type="file" accept="video/mp4,video/webm" onChange={handleVideoChange} className="hidden" />
                        </label>
                        <p className="mt-4 text-sm text-gray-500">
                            This video will auto-play muted on the homepage. Keep files under 20MB for best performance.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
