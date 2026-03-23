import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../../config/api';
import toast, { Toaster } from 'react-hot-toast';
import { User, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(`${API_BASE}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (data.success) {
                localStorage.setItem('adminToken', data.token);
                toast.success('Login Successful', { duration: 1500 });

                // Allow toast to show
                setTimeout(() => {
                    navigate('/shop-admin-portal-2002/dashboard');
                }, 1000);
            } else {
                toast.error(data.error || 'Invalid credentials');
                setIsLoading(false);
            }
        } catch (err) {
            console.error(err);
            toast.error('Connection failed. Check if backend is running.');
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-dark-900 p-4 md:p-8 relative overflow-hidden">
            <Toaster position="top-right" />

            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-neon-cyan/20 rounded-full blur-[150px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-neon-purple/20 rounded-full blur-[150px]"></div>
            </div>

            <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 relative z-10">
                {/* Left Side - Brand Identity */}
                <div className="flex flex-col justify-center items-center md:items-start w-full md:w-1/2 text-center md:text-left">
                    <div className="relative z-20">
                        <div className="w-16 h-16 rounded-2xl bg-neon-cyan/5 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan mb-8 animate-pulse mx-auto md:mx-0">
                            <ShieldCheck size={32} />
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black mb-4 uppercase tracking-tighter italic leading-none">
                            <span className="text-white block">Mobile</span>
                            <span className="text-neon-cyan drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">hub</span>
                        </h1>
                        <p className="text-gray-500 font-black uppercase tracking-[0.4em] text-[10px] mt-4 opacity-60">Administrative Node</p>
                    </div>
                </div>

                {/* Right Side - Authentication Gate */}
                <div className="w-full max-w-md relative">
                    <div className="p-8 md:p-10 rounded-[2.5rem] border border-white/5 bg-dark-800/40 backdrop-blur-xl shadow-2xl">
                        <h2 className="text-3xl font-black text-white mb-1 uppercase tracking-tighter">Access Gate</h2>
                        <p className="text-gray-400 text-sm font-medium mb-8">Enter credentials to connect.</p>

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 ml-3">Identifier</label>
                                <div className="relative group">
                                    <User className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-neon-cyan transition-colors" size={16} />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full pl-12 pr-5 py-3.5 bg-dark-900/40 border border-white/10 rounded-xl text-white text-sm font-medium outline-none focus:border-neon-cyan/50 focus:ring-4 focus:ring-neon-cyan/5 transition-all"
                                        placeholder="Admin Username"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 ml-3">Passkey</label>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-neon-purple transition-colors" size={16} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-5 py-3.5 bg-dark-900/40 border border-white/10 rounded-xl text-white text-sm font-medium outline-none focus:border-neon-purple/50 focus:ring-4 focus:ring-neon-purple/5 transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full h-14 rounded-xl font-black text-sm uppercase tracking-widest bg-gradient-to-r from-neon-cyan to-neon-purple text-dark-900 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all flex items-center justify-center gap-3 group mt-6 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? 'Verifying...' : (
                                    <>
                                        Authorize <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
