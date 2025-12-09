"use client";

import { motion } from "framer-motion";
import { CreditCard, Mail, Settings, Shield, User as UserIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "@/types";

interface AccountDetailsProps {
    user: User;
}

export function AccountDetails({ user }: AccountDetailsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
        >
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Account Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                        <div className="p-2 bg-neutral-100 rounded-lg">
                            <Mail size={16} className="text-neutral-600" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-neutral-500 text-xs">Email Address</span>
                            <span className="font-medium truncate max-w-[200px]">{user.email}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                        <div className="p-2 bg-neutral-100 rounded-lg">
                            <Shield size={16} className="text-neutral-600" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-neutral-500 text-xs">Account ID</span>
                            <span className="font-medium font-mono text-xs">
                                {user.id ? user.id.slice(0, 8) : "..."}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                        <div className="p-2 bg-neutral-100 rounded-lg">
                            <UserIcon size={16} className="text-neutral-600" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-neutral-500 text-xs">Member Since</span>
                            <span className="font-medium">
                                {user.createdAt ? new Date(user.createdAt).getFullYear() : "2024"}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                    <Settings size={20} />
                    <span className="text-xs">Settings</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                    <CreditCard size={20} />
                    <span className="text-xs">Cards</span>
                </Button>
            </div>
        </motion.div>
    );
}