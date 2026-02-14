"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm hover:shadow-md transition-all group overflow-hidden"
            aria-label="Toggle theme"
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={theme}
                    initial={{ y: 20, opacity: 0, rotate: -45 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: -20, opacity: 0, rotate: 45 }}
                    transition={{ duration: 0.3, ease: "circOut" }}
                    className="text-brand-600 dark:text-brand-400"
                >
                    {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
                </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 bg-brand-500/0 group-hover:bg-brand-500/5 transition-colors" />
        </button>
    );
}
