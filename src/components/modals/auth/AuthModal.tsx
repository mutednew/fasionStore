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
    const [ref, bounds] = useMeasure();

    const toggleMode = () =>
        setMode((prev) => (prev === "login" ? "register" : "login"));

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[8px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleBackdropClick}
                >
                    {}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-32 -left-20 w-[400px] h-[400px] bg-pink-300/40 blur-[120px]" />
                        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-300/40 blur-[120px]" />
                    </div>

                    {}
                    <motion.div
                        animate={{ height: bounds.height }}
                        transition={{ type: "spring", stiffness: 160, damping: 22 }}
                        className="relative w-[400px] bg-white/70 backdrop-blur-2xl
                                   shadow-[0_8px_60px_-15px_rgba(255,75,43,0.4)]
                                   rounded-2xl border border-white/40
                                   text-center font-[Montserrat] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl transition"
                        >
                            ×
                        </button>

                        {}
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
                                        <LoginModal
                                            onSwitch={toggleMode}
                                            onClose={onClose}
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="register"
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -15 }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        <RegisterModal
                                            onSwitch={toggleMode}
                                            onClose={onClose}
                                        />
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