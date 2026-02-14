"use client";

import { useState, useEffect } from "react";
import { History as HistoryIcon, ChevronLeft, RefreshCw, Calendar, ArrowRight, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function HistoryPage() {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/workflow/history");
            const data = await res.json();
            setHistory(data);
        } catch (err) {
            console.error("Failed to fetch history", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    return (
        <main className="max-w-5xl mx-auto px-4 py-12 md:py-20 text-neutral-900">
            {/* Header Area */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16"
            >
                <div className="flex items-center justify-between mb-8">
                    <a href="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-brand-600 transition-colors text-xs font-black uppercase tracking-[0.2em] group">
                        <div className="w-8 h-8 rounded-full border border-neutral-100 flex items-center justify-center group-hover:border-brand-100 group-hover:bg-brand-50 transition-all">
                            <ChevronLeft size={14} />
                        </div>
                        Back to Suite
                    </a>
                </div>
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-2xl bg-brand-50 text-brand-600 border border-brand-100">
                        <HistoryIcon size={24} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight">Execution logs</h1>
                </div>
                <p className="text-neutral-500 text-lg font-medium">Detailed audit trail of all automated workflows.</p>
            </motion.div>

            <div className="space-y-8">
                {loading ? (
                    <div className="py-32 flex flex-col items-center justify-center gap-6 text-neutral-300">
                        <RefreshCw size={40} className="animate-spin opacity-20" />
                        <p className="font-black text-[10px] uppercase tracking-[0.3em]">Querying database...</p>
                    </div>
                ) : history.length === 0 ? (
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="py-32 text-center bg-white rounded-[3rem] border-dashed border-2 border-neutral-200"
                    >
                        <Layers size={64} className="mx-auto mb-6 text-neutral-200" />
                        <p className="text-neutral-400 text-lg font-bold mb-6">No historical data available.</p>
                        <a href="/" className="inline-flex px-8 py-4 bg-brand-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-700 transition-all shadow-lg shadow-brand-100">
                            Create First Workflow
                        </a>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        {history.map((run, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white border border-neutral-100 rounded-[2.5rem] overflow-hidden group shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="px-8 py-6 bg-neutral-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/40">
                                            <Calendar size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Execution Timestamp</p>
                                            <p className="text-white font-bold text-sm">
                                                {run.createdAt ? new Date(run.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : "Real-time Run"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="px-5 py-2 rounded-full bg-brand-600 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                                        {run.steps.length} Sequence Steps
                                    </div>
                                </div>
                                <div className="p-8 md:p-10 space-y-10">
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                        <div className="lg:col-span-4 space-y-6">
                                            <div>
                                                <h4 className="text-[10px] font-black text-neutral-300 uppercase mb-4 tracking-[0.2em] italic">Original Input</h4>
                                                <div className="p-6 rounded-3xl bg-neutral-50 border border-neutral-100 text-sm text-neutral-600 leading-relaxed font-medium italic relative overflow-hidden group-hover:bg-white transition-colors">
                                                    <div className="absolute top-0 left-0 w-1 h-full bg-neutral-200" />
                                                    "{run.input}"
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-black text-neutral-300 uppercase mb-4 tracking-[0.2em] italic">Architecture</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {run.steps.map((step: any, sIdx: number) => (
                                                        <div key={sIdx} className="flex items-center gap-2">
                                                            <span className="px-3 py-1.5 rounded-xl bg-white border border-neutral-200 text-[10px] font-black text-neutral-800 uppercase tracking-tighter shadow-sm">
                                                                {step.label}
                                                            </span>
                                                            {sIdx < run.steps.length - 1 && <ArrowRight size={12} className="text-neutral-200" />}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="lg:col-span-8">
                                            <h4 className="text-[10px] font-black text-neutral-300 uppercase mb-4 tracking-[0.2em] italic">Step Results</h4>
                                            <div className="space-y-4">
                                                {run.results.map((res: any, rIdx: number) => (
                                                    <div key={rIdx} className="p-6 rounded-3xl bg-white border border-neutral-100 shadow-sm transition-all hover:border-brand-100 group/item">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">{run.steps[rIdx]?.label} Output</span>
                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                                        </div>
                                                        <div className="text-neutral-700 text-sm leading-relaxed font-medium whitespace-pre-wrap">{res.output}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
