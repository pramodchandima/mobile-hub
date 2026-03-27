import React from 'react';
import { Facebook, Instagram, MessageCircle, ArrowRight, Target, Eye, ShieldCheck, Heart, Award, Users, MapPin, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import PublicLayout from '../components/layout/PublicLayout';
import AnimatedSection from '../components/common/AnimatedSection';

const About = () => {
    const socialLinks = {
        facebook: process.env.REACT_APP_FACEBOOK_URL || "#",
        instagram: process.env.REACT_APP_INSTAGRAM_URL || "#",
        whatsapp: `https://wa.me/${process.env.REACT_APP_WHATSAPP_NUMBER || "94789933967"}`
    };

    return (
        <PublicLayout>
            {/* HERO SECTION - FULL SCREEN */}
            <div className="relative h-screen w-full overflow-hidden">
                <img
                    src="/Images/shop.jpg"
                    alt="Mobile Hub Shop"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent"></div>

                <div className="absolute inset-0 flex flex-col justify-end pb-32 px-1 max-w-[1400px] mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                        className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-4"
                    >
                        Our <span className="neon-text-gradient">Story</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                        className="text-lg md:text-xl text-white max-w-3xl font-medium leading-relaxed drop-shadow-lg"
                    >
                        Founded with a passion for mobile technology, Mobile Hub has grown into a trusted destination for smartphones and accessories in Sri Lanka.
                    </motion.p>
                </div>
            </div>

            <div className="bg-dark-950 text-white pb-16">
                <div className="max-w-[1400px] mx-auto px-4">
                    <AnimatedSection className="py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-4">
                                <span className="w-12 h-1 bg-neon-cyan rounded-full"></span>
                                Who We Are
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed font-medium">
                                Founded with a passion for mobile technology, Mobile Hub has grown into a trusted destination for smartphones and accessories in Sri Lanka. From a small beginning, we have built a strong reputation by providing quality products, reliable service, and a customer-first approach.
                            </p>
                            <p className="text-gray-400 text-lg leading-relaxed font-medium">
                                Today, Mobile Hub continues to expand, serving customers with the latest mobile solutions and modern technology.
                            </p>
                        </div>
                        <div className="glass-card p-12 rounded-3xl border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/10 blur-[80px] group-hover:bg-neon-cyan/20 transition-all"></div>
                            <Target className="text-neon-cyan w-16 h-16 mb-8" />
                            <h3 className="text-2xl font-black uppercase mb-4">Our Mission</h3>
                            <p className="text-gray-400 leading-relaxed font-medium">
                                To deliver high-quality mobile products and services while building long-term relationships with our customers through trust, innovation, and excellent service. We aim to make modern technology accessible and affordable for everyone.
                            </p>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection className="py-16 border-y border-white/5 relative overflow-hidden">
                        {/* Background Animation Elements */}
                        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-neon-cyan/5 rounded-full blur-[100px] animate-pulse"></div>
                        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-neon-purple/5 rounded-full blur-[100px] animate-pulse delay-1000"></div>

                        <div className="relative z-10">
                            <h2 className="text-center text-4xl font-black uppercase tracking-tighter mb-16">What We Do</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { title: "Smartphones", desc: "Leading global brands & latest models", num: "01" },
                                    { title: "Accessories", desc: "Chargers, earphones, premium cases", num: "02" },
                                    { title: "Repairs", desc: "Expert technical support & service", num: "03" },
                                    { title: "Gadgets", desc: "Latest smart devices & technology", num: "04" }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -10 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        className="glass-card p-10 rounded-2xl transition-all duration-500 border-white/5 group relative overflow-hidden"
                                    >
                                        <div className="absolute -top-4 -right-2 text-8xl font-black text-white/5 group-hover:text-neon-cyan/10 transition-colors pointer-events-none">
                                            {item.num}
                                        </div>
                                        <div className="relative z-10 text-center md:text-left">
                                            <h4 className="text-2xl font-black uppercase mb-4 tracking-tighter group-hover:text-neon-cyan transition-colors">{item.title}</h4>
                                            <p className="text-gray-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* WHY CHOOSE US */}
                    <div className="py-16">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                            <AnimatedSection direction="right" className="space-y-12">
                                <h2 className="text-4xl font-black uppercase tracking-tighter">Why Choose Us</h2>
                                <div className="space-y-8">
                                    {[
                                        { t: "Trusted Quality", d: "We provide genuine products with warranty and reliable after-sales support.", i: Heart },
                                        { t: "Customer Satisfaction", d: "We always put our customers first and aim to give the best service experience.", i: Users },
                                        { t: "Affordable Prices", d: "Competitive pricing with great value for money.", i: Award },
                                        { t: "Expert Support", d: "Friendly and knowledgeable staff ready to help you choose the right product.", i: ShieldCheck }
                                    ].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: i * 0.1 }}
                                            className="flex gap-6 group"
                                        >
                                            <div className="w-12 h-12 bg-neon-cyan/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-neon-cyan/20 transition-all">
                                                <item.i className="text-neon-cyan w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold mb-2">{item.t}</h4>
                                                <p className="text-gray-500 font-medium">{item.d}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </AnimatedSection>
                            <AnimatedSection direction="left" className="relative">
                                <div className="glass-card p-12 rounded-3xl border-white/5 h-full flex flex-col justify-center relative z-10">
                                    <Eye className="text-neon-purple w-20 h-20 mb-8 opacity-20" />
                                    <h3 className="text-3xl font-black uppercase mb-6 tracking-tighter">Our Vision</h3>
                                    <p className="text-xl text-gray-400 font-medium leading-relaxed italic">
                                        "To become a leading mobile technology provider in Sri Lanka by continuously improving our services, expanding our product range, and delivering innovative solutions to our customers."
                                    </p>
                                </div>
                                <div className="absolute -top-10 -right-10 w-64 h-64 bg-neon-purple/10 blur-[100px] pointer-events-none"></div>
                                <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-neon-cyan/10 blur-[100px] pointer-events-none"></div>
                            </AnimatedSection>
                        </div>
                    </div>

                    {/* OUR JOURNEY */}
                    <AnimatedSection className="py-16 bg-dark-900/50 rounded-[3rem] p-12 md:p-20 border border-white/5">
                        <h2 className="text-4xl font-black uppercase tracking-tighter mb-16 text-center">Our Journey</h2>
                        <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/5 before:to-transparent">
                            {[
                                { t: "Beginning", d: "Mobile Hub started as a small mobile phone shop with a big vision.", date: "The Start" },
                                { t: "Growth", d: "Expanded product range and built a loyal customer base.", date: "Building Trust" },
                                { t: "Today", d: "A trusted mobile shop known for quality, service, and reliability.", date: "Present Day" }
                            ].map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: i % 2 === 0 ? 50 : -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: i * 0.2 }}
                                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                                >
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-dark-900 group-hover:border-neon-cyan group-hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all z-10 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                        <div className="w-2 h-2 rounded-full bg-neon-cyan"></div>
                                    </div>
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card p-8 rounded-2xl border-white/5 hover:bg-white/5 transition-all">
                                        <time className="font-black text-neon-cyan uppercase tracking-widest text-xs mb-2 block">{step.date}</time>
                                        <div className="text-xl font-bold text-white mb-2">{step.t}</div>
                                        <div className="text-gray-500 font-medium">{step.d}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </AnimatedSection>

                    {/* CONNECT */}
                    <div className="py-16 text-center">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-5xl font-black uppercase tracking-tighter mb-8 leading-none">Let's Connect</h2>
                            <p className="text-xl text-gray-500 font-medium mb-12">
                                Visit our store to explore the latest smartphones and accessories, or connect with us through our online platforms.
                            </p>

                            <div className="space-y-8 pt-4 border-t border-white/5 mb-16 max-w-2xl mx-auto text-left">
                                <div className="flex items-start gap-6 group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neon-cyan group-hover:bg-neon-cyan/10 transition-all shrink-0 mt-1">
                                        <MapPin size={20} />
                                    </div>
                                    <div className="text-gray-400 font-bold text-xl tracking-tight transition-colors group-hover:text-white flex flex-wrap gap-x-3">
                                        <span className="text-neon-cyan/80 shrink-0">address -</span>
                                        <span className="text-white">{process.env.REACT_APP_CONTACT_ADDRESS}</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-6 group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neon-cyan group-hover:bg-neon-cyan/10 transition-all shrink-0 mt-1">
                                        <Phone size={20} />
                                    </div>
                                    <div className="text-gray-400 font-bold text-xl tracking-tight transition-colors group-hover:text-white flex flex-wrap gap-x-3">
                                        <span className="text-neon-cyan/80 shrink-0">mobile -</span>
                                        <span className="text-white">{process.env.REACT_APP_CONTACT_PHONE}</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-6 group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neon-cyan group-hover:bg-neon-cyan/10 transition-all shrink-0 mt-1">
                                        <Mail size={20} />
                                    </div>
                                    <div className="text-gray-400 font-bold text-xl tracking-tight transition-colors group-hover:text-white flex flex-wrap gap-x-3">
                                        <span className="text-neon-cyan/80 shrink-0">email -</span>
                                        <span className="text-white">{process.env.REACT_APP_CONTACT_EMAIL}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-center gap-6">
                                <a
                                    href={socialLinks.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-8 py-4 bg-transparent border border-[#1877F2]/30 rounded-full text-[#1877F2] font-black uppercase tracking-tighter hover:border-[#1877F2] hover:shadow-[0_0_20px_rgba(24,119,242,0.6)] transition-all group"
                                >
                                    <Facebook size={24} /> Facebook
                                </a>
                                <a
                                    href={socialLinks.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-8 py-4 bg-transparent border border-[#E4405F]/30 rounded-full text-[#E4405F] font-black uppercase tracking-tighter hover:border-[#E4405F] hover:shadow-[0_0_20px_rgba(228,64,95,0.6)] transition-all group"
                                >
                                    <Instagram size={24} /> Instagram
                                </a>
                                <a
                                    href={socialLinks.whatsapp}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-8 py-4 bg-transparent border border-[#25D366]/30 rounded-full text-[#25D366] font-black uppercase tracking-tighter hover:border-[#25D366] hover:shadow-[0_0_20px_rgba(37,211,102,0.6)] transition-all group"
                                >
                                    <MessageCircle size={24} /> WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </PublicLayout>
    );
};

export default About;
