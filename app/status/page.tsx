"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, RefreshCw, Activity, Server, Database, Cloud, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function StatusPage() {
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const checkHealth = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/health");
            const data = await res.json();
            setStatus(data);
        } catch (err) {
            console.error("Failed to check health", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkHealth();
    }, []);

    const StatusCard = ({ title, isActive, icon: Icon, description }: any) => (
        <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-neutral-100 p-8 rounded-[2.5rem] flex flex-col gap-6 shadow-sm hover:shadow-md transition-all"
        >
            <div className="flex items-center justify-between">
                <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shadow-sm",
                    isActive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                )}>
                    <Icon size={28} />
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900 border border-neutral-800">
                    <div className={cn("w-2 h-2 rounded-full", isActive ? "bg-emerald-500 animate-pulse" : "bg-red-500")} />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">
                        {isActive ? "Operational" : "Degraded"}
                    </span>
                </div>
            </div>
            <div>
                <h3 className="text-2xl font-black text-neutral-900 mb-2 tracking-tight">{title}</h3>
                <p className="text-neutral-500 text-sm font-medium leading-relaxed">{description}</p>
            </div>
        </motion.div>
    );

    return (
        <main className="max-w-5xl mx-auto px-4 py-12 md:py-20 text-center text-neutral-900">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16"
            >
                <div className="flex items-center justify-between mb-8 max-w-xs mx-auto md:max-w-none">
                    <a href="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-brand-600 transition-colors text-xs font-black uppercase tracking-[0.2em] group">
                        <div className="w-8 h-8 rounded-full border border-neutral-100 flex items-center justify-center group-hover:border-brand-100 group-hover:bg-brand-50 transition-all">
                            <ChevronLeft size={14} />
                        </div>
                        Back to Suite
                    </a>
                </div>
                <div className="flex flex-col items-center gap-4 mb-4">
                    <div className="p-4 rounded-[2rem] bg-neutral-900 text-white shadow-2xl animate-float">
                        <Activity size={32} />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-neutral-900 tracking-tight leading-none mt-4">
                        System <span className="text-brand-600">Health</span>
                    </h1>
                </div>
                <p className="text-neutral-500 text-xl font-medium max-w-lg mx-auto leading-relaxed">
                    Real-time diagnostics for our automation infrastructure.
                </p>
            </motion.div>

            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-6 text-neutral-300">
                    <RefreshCw size={40} className="animate-spin opacity-20" />
                    <p className="font-black text-[10px] uppercase tracking-[0.3em]">Synching Nodes...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    <StatusCard
                        title="Core Engine"
                        isActive={status?.backend === "healthy"}
                        icon={Server}
                        description="Next.js edge runtime and API orchestration layers."
                    />
                    <StatusCard
                        title="Quantum DB"
                        isActive={status?.mongodb === "connected"}
                        icon={Database}
                        description="Cluster status for history preservation and analytics."
                    />
                    <StatusCard
                        title="Neural Link"
                        isActive={status?.llm === "connected"}
                        icon={Cloud}
                        description="Upstream connection to gpt-4o processing units."
                    />
                </div>
            )}

            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={checkHealth}
                className="mt-16 px-10 py-5 bg-white border border-neutral-200 rounded-2xl text-neutral-500 font-black text-xs uppercase tracking-[0.3em] hover:text-brand-600 hover:border-brand-200 transition-all shadow-sm flex items-center gap-3 mx-auto group"
            >
                <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-700" />
                Refresh Diagnostic
            </motion.button>
        </main>
    );
}
