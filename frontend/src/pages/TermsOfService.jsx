import React from 'react';
import PublicLayout from '../components/layout/PublicLayout';
import { ShieldCheck, Clock, Ban, Hammer, Database, Truck, AlertTriangle, FileText } from 'lucide-react';

const TermsOfService = () => {
    const sections = [
        {
            title: "Warranty Coverage",
            icon: ShieldCheck,
            content: "The warranty is only valid for the original buyer and cannot be transferred. A valid purchase receipt or warranty card must be provided when requesting any warranty service."
        },
        {
            title: "What We Will Do",
            icon: Hammer,
            content: "Mobile Hub will repair or replace defective parts within the warranty period. Repairs are carried out using new or approved replacement parts. Any repaired product will only be covered for the remaining period of the original warranty."
        },
        {
            title: "What is Not Covered",
            icon: Ban,
            content: "The warranty does not cover damage caused by physical impact such as drops or cracks, water or liquid exposure, improper use, or unauthorized repairs. Software-related issues caused by the user, including incorrect updates, apps, or viruses, are also not covered. Normal wear and tear is excluded."
        },
        {
            title: "Service Process",
            icon: Clock,
            content: "Customers are required to return the product to the place of purchase for inspection and repair processing. If the issue is not covered under warranty, any repair or service charges must be paid by the customer."
        },
        {
            title: "Data Responsibility",
            icon: Database,
            content: "Mobile Hub is not responsible for any loss of data during the repair process. Customers are strongly advised to back up their data before handing over the device."
        },
        {
            title: "Delivery and Handling",
            icon: Truck,
            content: "Any transport or delivery costs related to repairs or service may need to be covered by the customer."
        },
        {
            title: "Warranty Claims",
            icon: FileText,
            content: "All warranty claims must be made within the valid warranty period. Claims made after the warranty period may not be accepted."
        },
        {
            title: "Special Conditions",
            icon: AlertTriangle,
            content: "Devices with removed or damaged serial numbers or IMEI numbers are not eligible for warranty. Issues caused by network problems or external factors are also not covered."
        }
    ];

    return (
        <PublicLayout>
            <div className="bg-dark-950 min-h-screen pt-32 pb-24">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom duration-1000">
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-6">
                            Terms & <span className="neon-text-gradient">Conditions</span>
                        </h1>
                        <p className="text-xl text-gray-500 font-medium">Mobile Hub – Sri Lanka</p>
                    </div>

                    {/* Main Content */}
                    <div className="space-y-16">
                        {sections.map((section, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-8 animate-in fade-in slide-in-from-bottom"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-neon-cyan">
                                    <section.icon size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 flex items-center gap-3">
                                        <span className="text-neon-cyan text-sm tracking-[0.3em] font-black">{String(index + 1).padStart(2, '0')}</span>
                                        {section.title}
                                    </h3>
                                    <div className="pl-0 space-y-4">
                                        <p className="text-gray-400 text-lg leading-relaxed font-medium flex items-start gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan/40 mt-2.5 flex-shrink-0"></span>
                                            {section.content}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Important Notice Footer */}
                    <div className="mt-24 pt-16 border-t border-white/5 text-center animate-in fade-in zoom-in duration-1000 delay-500">
                        <AlertTriangle className="text-neon-purple w-12 h-12 mx-auto mb-6" />
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Important Notice</h2>
                        <p className="text-gray-300 text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                            No warranty is provided for water damage or physical damage. Customers are advised to use original accessories and keep their purchase invoice safe for future reference.
                        </p>
                        <p className="mt-8 text-sm text-gray-600 font-bold uppercase tracking-widest">
                            Mobile Hub reserves the right to update these terms at any time.
                        </p>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default TermsOfService;
