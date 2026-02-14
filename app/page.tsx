"use client";

import { useState, useEffect } from "react";
import {
    Plus,
    Trash2,
    Play,
    History as HistoryIcon,
    Activity,
    RefreshCw,
    CheckCircle2,
    ChevronRight,
    Settings2,
    FileText,
    Sparkles,
    ListFilter,
    Tags,
    Workflow
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";


function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type StepType = "clean_text" | "summarize" | "extract_points" | "tag_category";

interface Step {
    id: string;
    type: StepType;
    label: string;
    icon: any;
    prompt: string;
}

const STEP_OPTIONS: Record<StepType, { label: string; icon: any; defaultPrompt: string }> = {
    clean_text: {
        label: "Clean Text",
        icon: Trash2,
        defaultPrompt: "Remove extra whitespace, fix common typos, and normalize punctuation."
    },
    summarize: {
        label: "Summarize",
        icon: FileText,
        defaultPrompt: "Provide a concise summary of the text."
    },
    extract_points: {
        label: "Extract Points",
        icon: ListFilter,
        defaultPrompt: "Extract 3-5 key bullet points from the text."
    },
    tag_category: {
        label: "Tag Category",
        icon: Tags,
        defaultPrompt: "Suggest 3 relevant tags or categories for this content."
    },
};

export default function Home() {
    const [inputText, setInputText] = useState("");
    const [steps, setSteps] = useState<Step[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [results, setResults] = useState<{ stepId: string; output: string }[]>([]);
    const [activeStepIndex, setActiveStepIndex] = useState(-1);
    const [history, setHistory] = useState<any[]>([]);

    const [sessionId, setSessionId] = useState("");

    useEffect(() => {
        // Generate a fresh session ID on mount
        const newSessionId = crypto.randomUUID();
        setSessionId(newSessionId);
        fetchHistory(newSessionId);
    }, []);

    const fetchHistory = async (sid?: string) => {
        const activeSessionId = sid || sessionId;
        if (!activeSessionId) return;

        try {
            const res = await fetch(`/api/workflow/history?sessionId=${activeSessionId}`);
            const data = await res.json();
            setHistory(data);
        } catch (err) {
            console.error("Failed to fetch history", err);
        }
    };

    const addStep = (type: StepType) => {
        if (steps.length >= 4) return;
        const newStep: Step = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            label: STEP_OPTIONS[type].label,
            icon: STEP_OPTIONS[type].icon,
            prompt: STEP_OPTIONS[type].defaultPrompt,
        };
        setSteps([...steps, newStep]);
    };

    const removeStep = (id: string) => {
        setSteps(steps.filter(s => s.id !== id));
    };

    const runWorkflow = async () => {
        if (!inputText || steps.length === 0) return;
        setIsRunning(true);
        setResults([]);
        setActiveStepIndex(0);

        let currentText = inputText;
        const finalResults = [];

        for (let i = 0; i < steps.length; i++) {
            setActiveStepIndex(i);
            const step = steps[i];

            try {
                const puter = (window as any).puter;
                if (!puter) throw new Error("Puter.js not loaded");

                const fullPrompt = `${step.prompt}\n\nInput Text:\n${currentText}`;
                const response = await puter.ai.chat(fullPrompt, { model: "gpt-4o" });
                const output = response.toString();

                finalResults.push({ stepId: step.id, output });
                setResults([...finalResults]);
                currentText = output;
            } catch (err) {
                console.error(`Error in step ${i}:`, err);
                finalResults.push({ stepId: step.id, output: "Error executing step." });
                setResults([...finalResults]);
                break;
            }
        }

        setIsRunning(false);
        setActiveStepIndex(-1);

        try {
            await fetch("/api/workflow/run", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId, // Pass the session ID
                    input: inputText,
                    steps: steps.map(s => ({ type: s.type, label: s.label })),
                    results: finalResults
                })
            });
            fetchHistory(); // This will use the state sessionId
        } catch (err) {
            console.error("Failed to save history", err);
        }
    };

    return (
        <main className="max-w-6xl mx-auto px-4 py-12 md:py-20 text-neutral-900">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
            >
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-widest border border-brand-100">
                        <Workflow size={14} />
                        Automation Runner
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-neutral-900 tracking-tight leading-none">
                        Workflow <span className="text-brand-600">Builder</span>
                    </h1>
                    <p className="text-neutral-500 text-xl max-w-xl font-medium leading-relaxed">
                        Chain powerful AI steps to transform your data instantly.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <a href="/status" className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-neutral-200 text-neutral-700 text-sm font-bold shadow-sm hover:border-brand-300 hover:text-brand-600 transition-all">
                        <Activity size={18} />
                        Systems
                    </a>
                    <a href="/history" className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 text-white text-sm font-bold shadow-lg shadow-brand-200 hover:bg-brand-700 hover:scale-[1.02] active:scale-[0.98] transition-all">
                        <HistoryIcon size={18} />
                        History
                    </a>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Build Area */}
                <div className="lg:col-span-8 space-y-10">
                    {/* Input Area */}
                    <motion.section
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white border border-neutral-100 p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-shadow duration-500"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                                <FileText size={20} />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">Source Content</h2>
                        </div>
                        <textarea
                            className="w-full h-48 p-6 rounded-2xl bg-neutral-50 border border-neutral-200 focus:ring-4 focus:ring-brand-50 focus:border-brand-200 transition-all outline-none text-neutral-900 text-lg leading-relaxed placeholder:text-neutral-400 resize-none shadow-inner"
                            placeholder="Paste your content here to begin the transformation..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        />
                    </motion.section>

                    {/* Step Builder */}
                    <motion.section
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white border border-neutral-100 p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-shadow duration-500"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600">
                                    <Sparkles size={20} />
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight">Processing Chain</h2>
                            </div>
                            <div className="px-4 py-1.5 rounded-full bg-neutral-100 text-neutral-500 text-[10px] font-black uppercase tracking-widest border border-neutral-200">
                                {steps.length} / 4 Steps
                            </div>
                        </div>

                        <div className="space-y-4 relative">
                            <AnimatePresence mode="popLayout">
                                {steps.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="py-16 border-2 border-dashed border-neutral-200 rounded-[2rem] flex flex-col items-center justify-center text-neutral-400 bg-neutral-50"
                                    >
                                        <Plus size={40} className="mb-4 opacity-20" />
                                        <p className="font-bold uppercase tracking-widest text-[10px]">Add your first logic block below</p>
                                    </motion.div>
                                ) : (
                                    steps.map((step, index) => (
                                        <motion.div
                                            key={step.id}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ scale: 0.9, opacity: 0 }}
                                            className={cn(
                                                "group relative flex items-center gap-6 p-6 rounded-3xl border transition-all duration-500 shadow-sm hover:shadow-lg",
                                                activeStepIndex === index
                                                    ? "bg-brand-50 border-brand-200 ring-4 ring-brand-50"
                                                    : "bg-white border-neutral-100"
                                            )}
                                        >
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-900 text-white text-xs font-black italic">
                                                0{index + 1}
                                            </div>
                                            <div className="w-12 h-12 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-700 group-hover:scale-110 transition-transform">
                                                <step.icon size={24} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-neutral-900 text-lg uppercase tracking-tight">{step.label}</h3>
                                                <p className="text-xs text-neutral-400 font-medium truncate max-w-xs">{step.prompt}</p>
                                            </div>
                                            <button
                                                onClick={() => removeStep(step.id)}
                                                className="p-3 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={20} />
                                            </button>

                                            {index < steps.length - 1 && (
                                                <div className="absolute -bottom-5 left-20 transform -translate-x-1/2 z-10 text-neutral-200">
                                                    <ChevronRight className="rotate-90" size={24} />
                                                </div>
                                            )}
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {(Object.keys(STEP_OPTIONS) as StepType[]).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => addStep(type)}
                                    disabled={steps.length >= 4}
                                    className="flex flex-col items-center gap-3 p-5 rounded-[1.5rem] bg-white border border-neutral-100 shadow-sm hover:border-brand-500 hover:shadow-xl hover:shadow-brand-50 hover:-translate-y-1 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-all">
                                        {(() => {
                                            const Icon = STEP_OPTIONS[type].icon;
                                            return <Icon size={24} />;
                                        })()}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-600">{STEP_OPTIONS[type].label}</span>
                                </button>
                            ))}
                        </div>
                    </motion.section>

                    <motion.button
                        layout
                        onClick={runWorkflow}
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.02 }}
                        disabled={isRunning || !inputText || steps.length === 0}
                        className={cn(
                            "w-full py-8 rounded-[2rem] flex items-center justify-center gap-4 font-black text-xl uppercase tracking-widest shadow-[0_20px_50px_rgba(79,70,229,0.15)] transition-all",
                            isRunning
                                ? "bg-neutral-900 text-neutral-400 cursor-not-allowed"
                                : "bg-neutral-900 text-white hover:bg-neutral-800 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:shadow-none"
                        )}
                    >
                        {isRunning ? (
                            <>
                                <RefreshCw size={28} className="animate-spin text-brand-500" />
                                <span className="animate-pulse">Orchestrating...</span>
                            </>
                        ) : (
                            <>
                                <div className="p-2 rounded-lg bg-white/10">
                                    <Play size={20} fill="currentColor" />
                                </div>
                                Execute Workflow
                            </>
                        )}
                    </motion.button>
                </div>

                {/* Live Feed */}
                <div className="lg:col-span-4 space-y-10">
                    <motion.section
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white border border-neutral-100 p-8 rounded-[2rem] min-h-[500px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-shadow duration-500"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <CheckCircle2 size={20} />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">Live Output</h2>
                        </div>

                        <div className="space-y-6">
                            {results.length === 0 && !isRunning ? (
                                <div className="flex flex-col items-center justify-center py-24 text-neutral-300">
                                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-neutral-100 flex items-center justify-center mb-6">
                                        <Play size={32} className="opacity-20 ml-1" />
                                    </div>
                                    <p className="font-bold text-[10px] uppercase tracking-[0.2em] text-center">Awaiting execution data</p>
                                </div>
                            ) : (
                                results.map((result, idx) => (
                                    <motion.div
                                        key={result.stepId}
                                        initial={{ scale: 0.95, opacity: 0, y: 10 }}
                                        animate={{ scale: 1, opacity: 1, y: 0 }}
                                        className="p-6 rounded-3xl bg-neutral-50 border border-neutral-100 shadow-sm"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest italic">
                                                {steps.find(s => s.id === result.stepId)?.label || "Step Result"}
                                            </span>
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        </div>
                                        <div className="text-sm text-neutral-800 whitespace-pre-wrap leading-relaxed font-medium">
                                            {result.output}
                                        </div>
                                    </motion.div>
                                ))
                            )}
                            {isRunning && activeStepIndex >= results.length && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-6 rounded-3xl bg-brand-50 border border-brand-200 border-dashed"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                            <RefreshCw size={14} className="animate-spin text-brand-600" />
                                        </div>
                                        <span className="text-sm font-bold text-brand-900 uppercase tracking-tighter italic">
                                            Processing {steps[activeStepIndex]?.label}...
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.section>

                    {/* History Snapshot */}
                    <motion.section
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white border border-neutral-100 p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-shadow duration-500"
                    >
                        <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
                            <HistoryIcon size={20} className="text-neutral-400" />
                            Recent Activity
                        </h3>
                        <div className="space-y-4">
                            {history.length === 0 ? (
                                <p className="text-xs text-neutral-400 italic">No historical logs found.</p>
                            ) : (
                                history.map((run, i) => (
                                    <div key={i} className="p-5 rounded-2xl bg-white border border-neutral-100 shadow-sm hover:border-brand-200 transition-colors">
                                        <p className="font-bold text-neutral-800 text-sm line-clamp-2 leading-relaxed mb-4 italic">"{run.input}"</p>
                                        <div className="flex flex-wrap gap-2">
                                            {run.steps.map((s: any, j: number) => (
                                                <span key={j} className="px-3 py-1 rounded-full bg-neutral-50 border border-neutral-200 text-[9px] font-black text-neutral-500 uppercase tracking-tighter whitespace-nowrap">
                                                    {s.label}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.section>
                </div>
            </div>
        </main>
    );
}

