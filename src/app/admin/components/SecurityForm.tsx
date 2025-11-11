"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SecurityForm() {
    return (
        <form className="space-y-4 max-w-md">
            <div>
                <label className="text-sm font-medium">Current Password</label>
                <Input type="password" />
            </div>
            <div>
                <label className="text-sm font-medium">New Password</label>
                <Input type="password" />
            </div>
            <div>
                <label className="text-sm font-medium">Confirm Password</label>
                <Input type="password" />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Update Password
            </Button>
        </form>
    );
}