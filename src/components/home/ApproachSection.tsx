"use client";

export default function ApproachSection() {
    return (
        <section className="w-full bg-[#f5f5f5] py-24 text-center">
            {/* ===== HEADER ===== */}
            <div className="max-w-3xl mx-auto px-6 mb-16">
                <h2 className="text-2xl md:text-3xl font-semibold uppercase tracking-wide mb-4">
                    Our Approach To Fashion Design
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                    At Elegant Vogue, we blend creativity with craftsmanship to create
                    fashion that transcends trends and stands the test of time. Each
                    design is meticulously crafted, ensuring the highest quality and
                    exquisite finish.
                </p>
            </div>

            {/* ===== IMAGES GRID ===== */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-8">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="aspect-[3/4] bg-white border border-gray-200 flex items-center justify-center text-gray-400"
                    >
                        <span className="text-sm">Image {i}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}