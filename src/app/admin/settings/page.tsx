import { SettingsSection } from "../components/SettingsSection";
import { ProfileForm } from "../components/ProfileForm";
import { ThemeToggle } from "../components/ThemeToggle";
import { SecurityForm } from "../components/SecurityForm";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

export default function AdminSettings() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-semibold">Settings</h1>

            {/* Profile */}
            <SettingsSection title="Admin Profile">
                <ProfileForm />
            </SettingsSection>

            {/* Preferences */}
            <SettingsSection title="Preferences">
                <ThemeToggle />
            </SettingsSection>

            {/* Security */}
            <SettingsSection title="Security">
                <SecurityForm />
            </SettingsSection>

            {/* Notifications */}
            <SettingsSection title="Notifications">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span>Order Updates</span>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Stock Alerts</span>
                        <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                        <span>New User Registrations</span>
                        <Switch defaultChecked />
                    </div>
                </div>
            </SettingsSection>

            {/* API Settings */}
            <SettingsSection title="API Settings">
                <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
                    <div>
                        <label className="text-sm font-medium">Base URL</label>
                        <Input placeholder="https://api.yourstore.com" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">API Key</label>
                        <Input placeholder="sk_live_************" type="password" />
                    </div>
                </div>
            </SettingsSection>
        </div>
    );
}