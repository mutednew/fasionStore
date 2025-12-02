"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function ProfileForm() {
    return (
        <form className="space-y-4">
            <div className="flex items-center gap-4">
                <Image
                    src="/images/admin-avatar.png"
                    alt="Admin Avatar"
                    width={64}
                    height={64}
                    className="rounded-full border"
                />
                <Button variant="outline" type="button">
                    Change Avatar
                </Button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <Input placeholder="John Doe" />
                </div>
                <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input placeholder="admin@example.com" type="email" />
                </div>
            </div>

            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Save Changes
            </Button>
        </form>
    );
}