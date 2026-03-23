import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShieldCheck, Settings, Star } from 'lucide-react';
import { API_BASE, getImageUrl } from '../config/api';
import PublicLayout from '../components/layout/PublicLayout';

const Home = () => {
    const navigate = useNavigate();
    const [settings, setSettings] = useState({ hero_images: [], promo_video: '' });
    const [sections, setSections] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const videoRef = useRef(null);

    // Fetch data
    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            try {
                const [settingsRes, sectionsRes] = await Promise.all([
                    fetch(`${API_BASE}/settings`),
                    fetch(`${API_BASE}/sections`)
                ]);

                if (settingsRes.ok) setSettings(await settingsRes.json());

                // Fetch Reviews
                const reviewsRes = await fetch(`${API_BASE}/reviews`);
                if (reviewsRes.ok) setReviews(await reviewsRes.json());

                if (sectionsRes.ok) {
                    const allSections = await sectionsRes.json();
                    const activeSections = allSections.filter(s => s.is_active);

                    const sectionsWithData = await Promise.all(activeSections.map(async (sec) => {
                        let data = [];
                        let endpoint = '';
                        if (sec.type === 'latest_products') {
                            endpoint = `${API_BASE}/products`;
                        } else if (sec.type === 'category_products' && sec.category_id) {
                            endpoint = `${API_BASE}/products?category=${sec.category_id}`;
                        }

                        if (endpoint) {
                            const res = await fetch(endpoint);
                            if (res.ok) data = await res.json();
                        }

                        if (sec.type === 'latest_products' && Array.isArray(data)) data = data.slice(0, 4);
                        if (sec.type === 'category_products' && Array.isArray(data)) data = data.slice(0, 4);

                        return { ...sec, products: Array.isArray(data) ? data : [] };
                    }));
                    setSections(sectionsWithData);
                }
            } catch (error) {
                console.error("Error fetching home data:", error);
            }
        };
        fetchData();
    }, []);

    // Slide interval for hero
    useEffect(() => {
        if (!settings.hero_images || settings.hero_images.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % settings.hero_images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [settings.hero_images]);

    // Intersection observer
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('.section-reveal').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [sections, settings]);

    // Handle Video Autoplay
    useEffect(() => {
        if (settings.promo_video && videoRef.current) {
            const playVideo = () => {
                videoRef.current.play().catch(error => {
                    console.warn("Video autoplay failed, waiting for interaction:", error);
                });
            };
            playVideo();
            // Also try on first click/interaction if it fails
            window.addEventListener('click', playVideo, { once: true });
            return () => window.removeEventListener('click', playVideo);
        }
    }, [settings.promo_video]);

    return (
        <PublicLayout>
            <div className="animate-fade-in pb-6 text-gray-200">
                {/* 1. HERO */}
                <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">

                    {/* Background Images Carousel */}
                    {settings.hero_images && settings.hero_images.length > 0 && (
                        <div className="absolute inset-0 z-0 opacity-60 pointer-events-none bg-dark-900">
                            {settings.hero_images.map((img, idx) => (
                                <div
                                    key={idx}
                                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent z-10"></div>
                                    <img src={getImageUrl(img)} alt="Hero Background" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="max-w-[1400px] mx-auto px-4 text-center relative z-10 w-full">
                        <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tighter section-reveal">
                            <span className="neon-text-gradient animate-pulse-glow block">The Future</span>
                            <span className="text-white drop-shadow-lg">In Your Hands.</span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-md">
                            Experience the next generation of mobile technology. Premium devices, cutting-edge performance, and seamless connectivity.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <button
                                onClick={() => navigate("/shop")}
                                className="group relative bg-gradient-to-r from-neon-cyan to-neon-blue text-dark-900 px-12 py-5 rounded-full font-bold text-xl hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all duration-500 hover:scale-105 active:scale-95"
                            >
                                Explore Collection
                                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                            </button>

                            <button
                                onClick={() => navigate("/contact")}
                                className="glass-card px-12 py-5 rounded-full font-bold text-xl text-white hover:bg-white/10 transition-all duration-300"
                            >
                                Tech Support
                            </button>
                        </div>
                    </div>
                </div>

                {/* 1.5 PROMO VIDEO SECTION */}
                {settings.promo_video && (
                    <div className="relative w-full overflow-hidden bg-black">
                        <video
                            ref={videoRef}
                            src={getImageUrl(settings.promo_video)}
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                            className="w-full h-auto object-cover"
                        ></video>
                    </div>
                )}

                {/* 2. FEATURES */}
                <div className="py-8 relative overflow-hidden section-reveal border-b border-white/5 bg-dark-900/50 backdrop-blur-sm">
                    <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
                        <FeatureCard
                            icon={Search}
                            title="Expert Product Guidance"
                            text="Get help from our team to choose the best device for your needs."
                            color="cyan"
                        />
                        <FeatureCard
                            icon={ShieldCheck}
                            title="Certified Warranty"
                            text="Official brand warranty and expert technical support."
                            color="purple"
                        />
                        <FeatureCard
                            icon={Settings}
                            title="Expert Technical Support"
                            text="Our skilled team is ready to help you choose and use your devices with confidence."
                            color="blue"
                        />
                    </div>
                </div>

                {/* 3. DYNAMIC SECTIONS */}
                {sections.map((section) => (
                    <div key={section.section_id} className="py-4 section-reveal">
                        <div className="max-w-[1400px] mx-auto px-4">
                            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                                <h3 className="text-4xl font-black tracking-tight text-white capitalize">
                                    {section.title}
                                </h3>
                                <button
                                    onClick={() => navigate(section.type === 'category_products' ? `/shop?category=${section.category_id}` : '/shop')}
                                    className="glass-card px-8 py-3 rounded-full font-bold hover:text-neon-cyan transition-all border-none"
                                >
                                    View Interface &rarr;
                                </button>
                            </div>

                            {section.products && section.products.length > 0 ? (
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                                    {section.products.map((product) => (
                                        <div
                                            key={product.product_id}
                                            onClick={() => navigate(`/product/${product.product_id}`)}
                                            className="group glass-card rounded-2xl overflow-hidden cursor-pointer p-2 transition-all duration-500 hover:-translate-y-4 shadow-xl hover:shadow-neon-cyan/10"
                                        >
                                            <div className="aspect-square overflow-hidden rounded-xl relative bg-dark-900 flex items-center justify-center">
                                                <img
                                                    src={getImageUrl(product.image_path)}
                                                    alt={product.product_name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    onError={(e) => { e.target.src = "https://via.placeholder.com/800x800?text=Product"; }}
                                                />
                                                <div className="absolute inset-0 bg-dark-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                                    <span className="bg-neon-cyan text-dark-900 px-6 py-2 rounded-full font-black text-sm uppercase tracking-tighter shadow-lg">Initialize View</span>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <div className="flex flex-col mb-1">
                                                    <h4 className="font-black text-lg text-white group-hover:text-neon-cyan transition-colors mb-1 min-h-[2.5rem] leading-tight">
                                                        {product.product_name}
                                                    </h4>
                                                    <span className="text-neon-cyan font-black text-sm">Rs. {Number(product.base_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 italic py-10 bg-dark-800/20 rounded-3xl border border-white/5">
                                    No modules found in this sector.
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* 4. CUSTOMER REVIEWS */}
                {reviews.length > 0 && (
                    <div className="py-12 relative overflow-hidden section-reveal border-t border-white/5 bg-dark-900/30">
                        <div className="absolute top-0 left-1/4 w-64 h-64 bg-neon-cyan/5 rounded-full blur-[120px] pointer-events-none"></div>
                        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-neon-purple/5 rounded-full blur-[120px] pointer-events-none"></div>

                        <div className="max-w-[1400px] mx-auto px-4 relative z-10">
                            <div className="text-center mb-10">
                                <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
                                    Customer <span className="neon-text-gradient">Experience</span>
                                </h3>
                                <div className="w-24 h-1 bg-gradient-to-r from-neon-cyan to-neon-purple mx-auto rounded-full"></div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {reviews.slice(0, 8).map((review) => (
                                    <div key={review.review_id} className="glass-card p-6 rounded-2xl flex flex-col h-full hover:-translate-y-2 transition-all duration-500 border-white/5 group relative">
                                        {/* Google Icon in corner */}
                                        <div className="absolute top-4 right-4 bg-white/10 p-1 rounded-md border border-white/5 backdrop-blur-sm group-hover:bg-white/20 transition-all">
                                            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-3.5 h-3.5 object-contain opacity-80 group-hover:opacity-100" />
                                        </div>

                                        <div className="flex items-center gap-3 mb-4 pr-6">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-dark-800 to-dark-900 border border-white/10 flex items-center justify-center text-neon-cyan font-black text-sm uppercase relative">
                                                {review.customer_name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-white font-bold text-sm truncate max-w-[120px]">{review.customer_name}</span>
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={10} fill={i < review.rating ? "#fbbf24" : "transparent"} className={i < review.rating ? "text-amber-400" : "text-gray-600"} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-400 text-sm leading-relaxed italic mt-2">
                                            "{review.comment}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
};

const FeatureCard = ({ icon: Icon, title, text, color }) => {
    const colorClasses = {
        cyan: "text-neon-cyan border-neon-cyan/20 bg-neon-cyan/5",
        purple: "text-neon-purple border-neon-purple/20 bg-neon-purple/5",
        blue: "text-neon-blue border-neon-blue/20 bg-neon-blue/5",
    };

    return (
        <div className="glass-card flex flex-col items-center text-center p-8 rounded-xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
            {/* Background glow on hover */}
            <div className={`absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-0 group-hover:opacity-30 transition-opacity bg-neon-${color}`}></div>

            <div className={`p-5 rounded-2xl mb-8 border transition-all duration-500 group-hover:scale-110 ${colorClasses[color]}`}>
                <Icon size={40} />
            </div>
            <h4 className="font-black text-2xl text-white mb-4 tracking-tight">{title}</h4>
            <p className="text-gray-400 font-medium leading-relaxed">{text}</p>
        </div>
    );
};

export default Home;
