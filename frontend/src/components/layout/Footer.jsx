import { Link } from 'react-router-dom';
import { Facebook, Instagram, MessageCircle, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-dark-900 border-t border-white/5 pt-12 pb-12 relative overflow-hidden mt-6">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-[120px]"></div>

            <div className="max-w-[1400px] mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-8">
                    <div className="space-y-6">
                        <Link to="/" className="text-3xl font-black italic tracking-tighter flex items-center gap-2 group">
                            <span className="text-white group-hover:text-neon-cyan transition-colors">Mobile</span>
                            <span className="text-neon-cyan drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">hub</span>
                        </Link>
                        <p className="text-gray-500 font-medium leading-relaxed mb-6">
                            The definitive destination for cutting-edge mobile technology. We bridge the gap between today and the future.
                        </p>

                        <div className="flex gap-4">
                            <a href={process.env.REACT_APP_FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-neon-cyan hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all">
                                <Facebook size={20} />
                            </a>
                            <a href={process.env.REACT_APP_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-neon-cyan hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all">
                                <Instagram size={20} />
                            </a>
                            <a href={`https://wa.me/${process.env.REACT_APP_WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-neon-cyan hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all">
                                <MessageCircle size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h5 className="text-xs font-black uppercase tracking-[0.2em] text-neon-cyan mb-8">Contact Information</h5>
                        <div id="contact-info" className="space-y-4 text-left">
                            <div className="flex items-start gap-3 group">
                                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-neon-cyan group-hover:bg-neon-cyan/10 transition-all shrink-0 mt-0.5">
                                    <MapPin size={14} />
                                </div>
                                <div className="text-gray-400 font-bold text-sm tracking-tight transition-colors group-hover:text-white flex flex-wrap gap-x-2">
                                    <span className="text-neon-cyan/80 shrink-0">address -</span>
                                    <span className="text-white">{process.env.REACT_APP_CONTACT_ADDRESS}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 group">
                                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-neon-cyan group-hover:bg-neon-cyan/10 transition-all shrink-0 mt-0.5">
                                    <Phone size={14} />
                                </div>
                                <div className="text-gray-400 font-bold text-sm tracking-tight transition-colors group-hover:text-white flex flex-wrap gap-x-2">
                                    <span className="text-neon-cyan/80 shrink-0">mobile -</span>
                                    <span className="text-white">{process.env.REACT_APP_CONTACT_PHONE}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 group">
                                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-neon-cyan group-hover:bg-neon-cyan/10 transition-all shrink-0 mt-0.5">
                                    <Mail size={14} />
                                </div>
                                <div className="text-gray-400 font-bold text-sm tracking-tight transition-colors group-hover:text-white flex flex-wrap gap-x-2">
                                    <span className="text-neon-cyan/80 shrink-0">email -</span>
                                    <span className="text-white">{process.env.REACT_APP_CONTACT_EMAIL}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-black uppercase tracking-widest text-sm mb-8">Navigation</h4>
                        <ul className="space-y-4">
                            {['Home', 'Shop', 'About', 'Contact'].map((item) => (
                                <li key={item}>
                                    {item === 'Contact' ? (
                                        <a href="#contact-info" className="text-gray-500 hover:text-neon-cyan font-bold transition-colors flex items-center gap-2 group">
                                            <div className="w-0 h-0.5 bg-neon-cyan group-hover:w-3 transition-all"></div>
                                            {item}
                                        </a>
                                    ) : (
                                        <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-gray-500 hover:text-neon-cyan font-bold transition-colors flex items-center gap-2 group">
                                            <div className="w-0 h-0.5 bg-neon-cyan group-hover:w-3 transition-all"></div>
                                            {item}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-black uppercase tracking-widest text-sm mb-8">Intelligence</h4>
                        <ul className="space-y-4">
                            {['Terms of Service'].map((item) => (
                                <li key={item}>
                                    <Link to='/terms' className="text-gray-500 hover:text-neon-purple font-bold transition-colors flex items-center gap-2 group">
                                        <div className="w-0 h-0.5 bg-neon-purple group-hover:w-3 transition-all"></div>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-600 font-bold text-sm uppercase tracking-tighter">
                        &copy; {new Date().getFullYear()} <span className="text-neon-cyan">Mobile hub</span>. All rights reserved.
                    </p>
                    <div className="flex gap-8 text-gray-600 font-bold text-xs uppercase tracking-widest">
                        <a href="#" className="hover:text-white transition-colors">Privacy Protocol</a>
                        <a href="#" className="hover:text-white transition-colors">Security Core</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
