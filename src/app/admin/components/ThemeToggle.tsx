"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";

export function ThemeToggle() {
    const [enabled, setEnabled] = useState(true);

    return (
        <div className="flex items-center justify-between py-2">
            <span>Dark Mode</span>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>
    );
}