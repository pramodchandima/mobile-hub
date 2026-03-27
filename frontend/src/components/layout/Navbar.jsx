import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Categories', path: '/shop' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    const handleNavClick = (path, e) => {
        if (window.location.pathname === path) {
            if (e) e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setMenuOpen(false);
        }
    };

    return (
        <nav className="glass sticky top-0 z-50 py-3">
            <div className="max-w-[1400px] mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to="/"
                                onClick={(e) => handleNavClick('/', e)}
                                className="text-3xl font-black text-neon-cyan tracking-tighter cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2"
                            >
                                <span className="bg-neon-cyan/10 p-2 rounded-lg border border-neon-cyan/20">MH</span>
                                Mobile hub
                            </Link>
                        </motion.div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-10">
                        {navLinks.map((link, idx) => (
                            <motion.div
                                key={link.name}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: idx * 0.1 }}
                            >
                                {link.name === 'Contact' ? (
                                    <a
                                        href="#contact-info"
                                        className="text-gray-300 hover:text-neon-cyan font-semibold tracking-wide transition-all duration-300 relative group"
                                    >
                                        {link.name}
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-cyan transition-all duration-300 group-hover:w-full"></span>
                                    </a>
                                ) : (
                                    <Link
                                        to={link.path}
                                        onClick={(e) => handleNavClick(link.path, e)}
                                        className="text-gray-300 hover:text-neon-cyan font-semibold tracking-wide transition-all duration-300 relative group"
                                    >
                                        {link.name}
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-cyan transition-all duration-300 group-hover:w-full"></span>
                                    </Link>
                                )}
                            </motion.div>
                        ))}

                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden text-neon-cyan" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="md:hidden py-6 space-y-4 overflow-hidden"
                        >
                            {navLinks.map((link, idx) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                                >
                                    {link.name === 'Contact' ? (
                                        <a
                                            href="#contact-info"
                                            onClick={() => setMenuOpen(false)}
                                            className="block w-full text-left py-3 text-gray-300 px-4 hover:bg-dark-700/50 rounded-xl font-semibold border border-transparent hover:border-neon-cyan/20 transition-all font-medium"
                                        >
                                            {link.name}
                                        </a>
                                    ) : (
                                        <Link
                                            to={link.path}
                                            onClick={(e) => {
                                                handleNavClick(link.path, e);
                                                setMenuOpen(false);
                                            }}
                                            className="block w-full text-left py-3 text-gray-300 px-4 hover:bg-dark-700/50 rounded-xl font-semibold border border-transparent hover:border-neon-cyan/20 transition-all font-medium"
                                        >
                                            {link.name}
                                        </Link>
                                    )}
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};

export default Navbar;
