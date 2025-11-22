"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useMeasure from "react-use-measure";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [mode, setMode] = useState<"login" | "register">("login");

    // dynamic height
    const [ref, bounds] = useMeasure();

    // toggle Login/Register
    const toggleMode = () =>
        setMode((prev) => (prev === "login" ? "register" : "login"));

    // lock scroll
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // close on backdrop click
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="auth-backdrop"
                    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleBackdropClick}
                >
                    {/* Background Blur Orbs */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-32 -left-20 w-[380px] h-[380px] bg-pink-300/40 blur-[120px]" />
                        <div className="absolute bottom-0 right-0 w-[380px] h-[380px] bg-blue-300/30 blur-[120px]" />
                    </div>

                    {/* Modal container with dynamic height */}
                    <motion.div
                        key="auth-content"
                        animate={{ height: bounds.height }}
                        transition={{ type: "spring", stiffness: 150, damping: 23 }}
                        className="
              relative
              w-[400px]
              bg-white/70
              backdrop-blur-2xl
              rounded-2xl
              border border-white/40
              shadow-[0_8px_40px_-10px_rgba(0,0,0,0.25)]
              overflow-hidden
            "
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl transition"
                        >
                            ×
                        </button>

                        {/* Animated content wrapper */}
                        <div ref={ref} className="px-8 pt-10 pb-8">
                            <AnimatePresence mode="wait">
                                {mode === "login" ? (
                                    <motion.div
                                        key="login"
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -15 }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        <LoginModal onSwitch={toggleMode} onClose={onClose} />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="register"
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -15 }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        <RegisterModal onSwitch={toggleMode} onClose={onClose} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}