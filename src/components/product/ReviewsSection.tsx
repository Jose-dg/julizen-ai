'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Star, Zap } from 'lucide-react'; // Added Zap

export function ReviewsSection() {
    return (
        <section className="container mx-auto px-4 py-8 max-w-2xl">
            {/* Featured Review */}
            <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12 border-2 border-blue-100">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>MK</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="flex text-yellow-400 mb-1">
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                        </div>
                        <p className="text-gray-800 font-medium italic mb-2">
                            &quot;Super fast delivery! Received my code in less than 1 minute. Redeemed it on my PS5 immediately. Will buy again!&quot;
                        </p>
                        <p className="text-sm text-gray-500 font-bold">- Mike K.</p>
                    </div>
                </div>
            </div>

            {/* Shipping Estimate */}
            <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg text-blue-800 text-sm font-medium mb-8">
                <Zap className="w-5 h-5 text-blue-600" />
                <span>Estimated Delivery: <strong>Instantly via Email</strong></span>
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
