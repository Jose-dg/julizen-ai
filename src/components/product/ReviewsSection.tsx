'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Star, Truck } from 'lucide-react';

export function ReviewsSection() {
    return (
        <section className="container mx-auto px-4 py-8 max-w-2xl">
            {/* Featured Review */}
            <div className="flex items-start gap-4 mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                    <AvatarImage src="https://placehold.co/100x100/png?text=A" />
                    <AvatarFallback>AL</AvatarFallback>
                </Avatar>
                <div>
                    <div className="flex items-center gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-sm font-bold ml-2">Alex</span>
                    </div>
                    <p className="text-sm text-gray-600 italic">
                        "Absolutely amazing! I've tried everything for my back pain and this is the only thing that works consistently. Highly recommend!"
                    </p>
                </div>
            </div>

            {/* Shipping Estimate */}
            <div className="flex items-center gap-3 mb-8 p-4 bg-green-50 text-green-800 rounded-lg border border-green-100">
                <Truck className="w-5 h-5" />
                <span className="text-sm font-medium">
                    Get it between <strong>Thursday, December 4th</strong> and <strong>Tuesday, December 9th</strong>.
                </span>
            </div>

            {/* Accordions */}
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="shipping">
                    <AccordionTrigger className="text-base font-bold">Shipping & Returns</AccordionTrigger>
                    <AccordionContent>
                        We offer free shipping on orders over €90. Orders are processed within 24-48 hours.
                        If you are not satisfied with your purchase, you can return it within 30 days for a full refund.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faqs">
                    <AccordionTrigger className="text-base font-bold">Common FAQs</AccordionTrigger>
                    <AccordionContent>
                        <ul className="list-disc pl-4 space-y-2">
                            <li><strong>How does it work?</strong> It uses suction to increase blood flow.</li>
                            <li><strong>Is it painful?</strong> No, you can adjust the intensity.</li>
                            <li><strong>How long should I use it?</strong> We recommend 10-20 minutes per session.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </section>
    );
}
