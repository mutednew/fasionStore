"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

interface ProductAccordionProps {
    description?: string | null;
}

export function ProductAccordion({ description }: ProductAccordionProps) {
    return (
        <Accordion type="single" collapsible className="w-full border-t pt-4">
            <AccordionItem value="desc" className="border-b-0">
                <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">
                    Description
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600 leading-relaxed">
                    {description || "No description available for this product."}
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping" className="border-b-0">
                <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">
                    Shipping & Returns
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600 leading-relaxed">
                    Free standard shipping on orders over $200. Returns accepted within 30 days of purchase.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="care" className="border-b-0">
                <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">
                    Care Instructions
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600 leading-relaxed">
                    Machine wash cold. Do not bleach. Tumble dry low. Iron low heat.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}