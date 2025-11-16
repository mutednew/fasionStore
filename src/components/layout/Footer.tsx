import {FooterLogo} from "@/components/icons/FooterLogo";

export default function Footer() {
    return (
        <footer className="w-full relative text-gray-700 py-28 px-8 h-[630px] bg-[url('/footerBg.png')] bg-cover bg-center bg-no-repeat">
            <div className="max-w-6xl mx-auto flex md:items-start gap-10">
                <div className="flex flex-col gap-8 text-sm uppercase tracking-wider">
                    <div>
                        <p className="text-gray-400 text-xs mb-2">INFO</p>
                        <ul className="flex flex-col gap-1 font-semibold">
                            <li className="hover:opacity-70 cursor-pointer">Pricing /</li>
                            <li className="hover:opacity-70 cursor-pointer">About /</li>
                            <li className="hover:opacity-70 cursor-pointer">Contacts</li>
                        </ul>
                    </div>

                    <div>
                        <p className="text-gray-400 text-xs mb-2">LANGUAGES</p>
                        <ul className="flex flex-col gap-1 font-semibold">
                            <li className="hover:opacity-70 cursor-pointer">ENG /</li>
                            <li className="hover:opacity-70 cursor-pointer">ESP /</li>
                            <li className="hover:opacity-70 cursor-pointer">SVE</li>
                        </ul>
                    </div>
                </div>

                <div className="flex mx-auto flex-col items-center gap-3 text-center">
                    <p className="text-xs text-gray-400 tracking-wider">TECHNOLOGIES</p>

                    <div className="flex flex-col items-center gap-1">
                        <FooterLogo/>
                        <p className="text-gray-400 text-xs mt-2">Near-field communication</p>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-6 left-[49%] text-xs text-gray-400">
                <p>© 2025 — copyright privacy</p>
            </div>
        </footer>
    );
}