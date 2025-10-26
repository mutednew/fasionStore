import HeroSection from "@/components/home/HeroSection";
import ThisWeek from "@/components/home/ThisWeek";
import Collections from "@/components/home/Collections";
import ApproachSection from "@/components/home/ApproachSection";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center w-full overflow-hidden bg-gray-200">
        <HeroSection />
        <ThisWeek />
        <Collections />
        <ApproachSection />
    </main>
  );
}
