import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Minus, Plus, ShoppingBag, Truck, ShieldCheck, Share2, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE, getImageUrl } from '../config/api';
import PublicLayout from '../components/layout/PublicLayout';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // Selection State
    const [selectedColor, setSelectedColor] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const whatsappNumber = process.env.REACT_APP_WHATSAPP_NUMBER || "94789933967";

    // Order Form State
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orderDetails, setOrderDetails] = useState({
        name: '',
        phone: '',
        address: '',
        email: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(() => {
        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);


    const fetchProduct = async () => {
        try {
            const res = await fetch(`${API_BASE}/products/${id}`);
            if (res.ok) {
                const data = await res.json();
                setProduct(data);
                if (data.colors && data.colors.length > 0) {
                    setSelectedColor(data.colors[0]);
                }
            } else {
                console.error("Product not found");
            }
        } catch (error) {
            console.error("Error fetching product:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (delta) => {
        const newQ = quantity + delta;
        if (newQ >= 1 && newQ <= (product?.stock_quantity || 10)) {
            setQuantity(newQ);
        }
    };


    const openOrderModal = () => {
        if (!product) return;
        if (product.colors && product.colors.length > 0 && !selectedColor) {
            alert("Please select a color/finish");
            return;
        }
        setShowOrderModal(true);
    };

    const handleConfirmOrder = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const price = product.base_price || product.price;
        const colorName = selectedColor ? (selectedColor.color_name || selectedColor.name) : "Standard";

        try {
            const orderData = {
                customerName: orderDetails.name,
                customerPhone: orderDetails.phone,
                customerEmail: orderDetails.email,
                shippingAddress: orderDetails.address,
                totalAmount: price * quantity,
                items: [{
                    productId: product.product_id,
                    color: colorName,
                    size: "N/A",
                    quantity: quantity,
                    price: price
                }]
            };

            const response = await fetch(`${API_BASE}/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (!result.success) {
                alert("Order Failed: " + (result.error || "Unknown error"));
                setIsSubmitting(false);
                return;
            }

            // WhatsApp Message
            const message = `⚡ *UPLINK CONFIRMED | Mobile hub* 
--------------------------------
👤 *Identity:* ${orderDetails.name}
📞 *Comm Link:* ${orderDetails.phone}
📍 *Coordinates:* ${orderDetails.address}
--------------------------------
🛒 *UNIT SPECIFICATIONS*
🆔 *Order No:* #${result.orderId}
📱 *Unit:* ${product.product_name}
🎨 *Finish:* ${colorName}
🔢 *Quantity:* ${quantity}
🏷️ *Unit Price:* Rs. ${Number(price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
--------------------------------
💰 *TOTAL CREDITS: Rs. ${(price * quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}*
--------------------------------
_Transmitted via Mobile hub Terminal_`;

            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, "_blank");

            setShowOrderModal(false);
            alert("Order placed successfully! Redirecting to WhatsApp...");
            navigate('/shop');

        } catch (error) {
            console.error("Order error:", error);
            alert("Could not connect to server.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <PublicLayout>
            <div className="min-h-screen flex justify-center items-center">
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 rounded-full border-4 border-neon-cyan/20 border-t-neon-cyan animate-spin"></div>
                    <div className="absolute inset-4 rounded-full border-4 border-neon-purple/20 border-b-neon-purple animate-spin-reverse"></div>
                </div>
            </div>
        </PublicLayout>
    );

    if (!product) return (
        <PublicLayout>
            <div className="min-h-screen flex flex-col justify-center items-center text-center px-6">
                <div className="glass-card p-16 rounded-lg max-w-lg">
                    <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Signal Lost</h2>
                    <p className="text-gray-400 mb-8 font-medium">The requested tech unit does not exist in our current database.</p>
                    <button onClick={() => navigate('/shop')} className="bg-neon-cyan text-dark-900 px-10 py-4 rounded-full font-black uppercase tracking-tighter hover:shadow-[0_0_20px_theme('colors.neon.cyan')] transition-all">Back to Hub</button>
                </div>
            </div>
        </PublicLayout>
    );

    return (
        <PublicLayout>
            <div className="max-w-[1400px] mx-auto px-4 py-8 min-h-screen relative">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-10 flex items-center gap-3 text-gray-400 hover:text-neon-cyan transition-all group font-bold uppercase tracking-widest text-sm"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Inventory
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Image Section */}
                    <div className="glass-card rounded-lg overflow-hidden relative group aspect-square flex items-center justify-center p-12">
                        <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 via-transparent to-neon-purple/5"></div>
                        <img
                            src={getImageUrl(product.image_path)}
                            alt={product.product_name}
                            className="w-full h-full object-cover relative z-10 transition-transform duration-700 group-hover:scale-105"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/800x800?text=Tech+Unit"; }}
                        />
                        {/* Status Badge */}
                        {product.stock_quantity <= 0 && (
                            <div className="absolute top-8 left-8 bg-red-600/20 backdrop-blur-xl border border-red-600 text-red-500 px-6 py-2 rounded-full font-black uppercase tracking-widest text-xs z-20">
                                Offline / Out of Stock
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col">
                        <div className="mb-10">
                            <h2 className="text-neon-cyan font-black tracking-[0.3em] uppercase text-xs mb-4">
                                {product.category_name || 'Classified Unit'}
                            </h2>
                            <h1 className="text-5xl lg:text-6xl font-black text-white mb-6 uppercase tracking-tighter leading-none">
                                {product.product_name}
                            </h1>
                            <div className="flex items-baseline gap-4">
                                <span className="text-4xl font-black text-white">Rs. {Number(product.base_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        </div>

                        {/* Specs / Information Box */}
                        <div className="glass-card p-10 rounded-lg mb-10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/5 rounded-full blur-3xl group-hover:bg-neon-cyan/10 transition-colors"></div>
                            <h3 className="text-white font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-3">
                                Technical Specifications
                            </h3>
                            <div className="text-gray-400 font-medium leading-relaxed whitespace-pre-line space-y-4">
                                {product.information ? (
                                    product.information.split('\n').map((line, i) => (
                                        <div key={i} className="flex gap-3 items-start">
                                            <Check size={16} className="text-neon-cyan mt-1 flex-shrink-0" />
                                            <span>{line}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p>{product.description || "System data unavailable."}</p>
                                )}
                            </div>
                        </div>

                        {/* Colors */}
                        {product.colors && product.colors.length > 0 && (
                            <div className="mb-10">
                                <h3 className="text-white font-black uppercase tracking-widest text-xs mb-6">Visual Profile: <span className="text-neon-cyan">{selectedColor?.color_name || selectedColor?.name}</span></h3>
                                <div className="flex gap-4">
                                    {product.colors.map((color, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-12 h-12 rounded-lg border-2 transition-all transform hover:scale-110 relative ${selectedColor === color ? 'border-neon-cyan shadow-[0_0_15px_rgba(34,211,238,0.4)] scale-110' : 'border-white/10'}`}
                                            title={color.color_name || color.name}
                                            style={{ backgroundColor: color.color_code || color.code }}
                                        >
                                            {selectedColor === color && <div className="absolute inset-0 border-2 border-white/30 rounded-lg"></div>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Trust Badges */}
                        <div className="mt-8 pt-10 border-t border-white/5 flex flex-wrap gap-8">
                            <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-tighter">
                                <Truck size={20} className="text-neon-cyan" /> Secure Logistics
                            </div>
                            <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-tighter">
                                <ShieldCheck size={20} className="text-neon-purple" /> Authentic Core
                            </div>
                        </div>
                    </div>
                </div>


                {/* Order Modal */}
                {showOrderModal && (
                    <div className="fixed inset-0 bg-dark-900/90 backdrop-blur-2xl z-50 flex items-center justify-center p-6">
                        <div className="glass-card w-full max-w-xl p-12 rounded-lg relative animate-in fade-in zoom-in duration-500 border-neon-cyan/20">
                            <button
                                onClick={() => setShowOrderModal(false)}
                                className="absolute top-8 right-8 text-gray-400 hover:text-neon-cyan transition-colors"
                            >
                                <Plus size={32} className="rotate-45" />
                            </button>

                            <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">Enter Identity</h2>
                            <p className="text-gray-400 font-medium mb-10">Provide your uplink coordinates for delivery.</p>

                            <form onSubmit={handleConfirmOrder} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-4">Full Identity</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-dark-900 border border-white/10 rounded-lg px-6 py-4 outline-none focus:border-neon-cyan focus:ring-4 focus:ring-neon-cyan/10 transition-all text-white font-medium"
                                            value={orderDetails.name}
                                            onChange={(e) => setOrderDetails({ ...orderDetails, name: e.target.value })}
                                            placeholder="Your Name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-4">Comm Link (Phone)</label>
                                        <input
                                            type="tel"
                                            required
                                            className="w-full bg-dark-900 border border-white/10 rounded-lg px-6 py-4 outline-none focus:border-neon-cyan focus:ring-4 focus:ring-neon-cyan/10 transition-all text-white font-medium"
                                            value={orderDetails.phone}
                                            onChange={(e) => setOrderDetails({ ...orderDetails, phone: e.target.value })}
                                            placeholder="077xxxxxxx"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-4">Delivery Coordinates (Address)</label>
                                    <textarea
                                        required
                                        rows="3"
                                        className="w-full bg-dark-900 border border-white/10 rounded-lg px-6 py-4 outline-none focus:border-neon-cyan focus:ring-4 focus:ring-neon-cyan/10 transition-all text-white font-medium resize-none text-sm"
                                        value={orderDetails.address}
                                        onChange={(e) => setOrderDetails({ ...orderDetails, address: e.target.value })}
                                        placeholder="Full delivery address"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-20 rounded-lg font-black text-xl uppercase tracking-widest bg-gradient-to-r from-neon-cyan to-neon-purple text-dark-900 hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] transition-all disabled:opacity-50 mt-4"
                                >
                                    {isSubmitting ? 'Transmitting...' : 'Initialize Uplink Order'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout >
    );
};

export default ProductDetails;
