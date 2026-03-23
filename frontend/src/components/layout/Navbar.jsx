import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Categories', path: '/shop' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className="glass sticky top-0 z-50 py-3">
            <div className="max-w-[1400px] mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-3xl font-black text-neon-cyan tracking-tighter cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2">
                            <span className="bg-neon-cyan/10 p-2 rounded-lg border border-neon-cyan/20">MH</span>
                            Mobile hub
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-10">
                        {navLinks.map((link) => (
                            link.name === 'Contact' ? (
                                <a
                                    key={link.name}
                                    href="#contact-info"
                                    className="text-gray-300 hover:text-neon-cyan font-semibold tracking-wide transition-all duration-300 relative group"
                                >
                                    {link.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-cyan transition-all duration-300 group-hover:w-full"></span>
                                </a>
                            ) : (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="text-gray-300 hover:text-neon-cyan font-semibold tracking-wide transition-all duration-300 relative group"
                                >
                                    {link.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-cyan transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            )
                        ))}

                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden text-neon-cyan" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden py-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                        {navLinks.map((link) => (
                            link.name === 'Contact' ? (
                                <a
                                    key={link.name}
                                    href="#contact-info"
                                    onClick={() => setMenuOpen(false)}
                                    className="block w-full text-left py-3 text-gray-300 px-4 hover:bg-dark-700/50 rounded-xl font-semibold border border-transparent hover:border-neon-cyan/20 transition-all font-medium"
                                >
                                    {link.name}
                                </a>
                            ) : (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setMenuOpen(false)}
                                    className="block w-full text-left py-3 text-gray-300 px-4 hover:bg-dark-700/50 rounded-xl font-semibold border border-transparent hover:border-neon-cyan/20 transition-all font-medium"
                                >
                                    {link.name}
                                </Link>
                            )
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
