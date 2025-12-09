"use client";

import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "@/types";

interface ProfileHeaderProps {
    user: User;
    onLogout: () => void;
    isLogoutLoading: boolean;
}

export function ProfileHeader({ user, onLogout, isLogoutLoading }: ProfileHeaderProps) {
    const safeEmail = user.email || "";
    const displayName = user.name || (safeEmail.includes("@") ? safeEmail.split("@")[0] : "User");
    const initials = displayName.slice(0, 2).toUpperCase();

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-white shadow-md">
                    <AvatarImage src={user.avatarUrl || ""} alt={displayName} />
                    <AvatarFallback className="bg-neutral-900 text-white text-xl">
                        {initials}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900">{displayName}</h1>
                    <p className="text-neutral-500">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge variant={user.role === "ADMIN" ? "destructive" : "secondary"} className="text-xs">
                            {user.role}
                        </Badge>
                    </div>
                </div>
            </div>

            <Button
                variant="outline"
                onClick={onLogout}
                disabled={isLogoutLoading}
                isLoading={isLogoutLoading}
                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
                {!isLogoutLoading && <LogOut size={16} />}
                Sign Out
            </Button>
        </motion.div>
    );
}