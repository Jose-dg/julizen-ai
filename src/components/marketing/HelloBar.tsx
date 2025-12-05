'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function HelloBar() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 flex items-center justify-between">
            <div className="flex-1 text-center text-sm md:text-base font-medium">
                🎉 BLACK FRIDAY: 20% OFF en todas las gift cards | Código: <span className="font-bold">BF2024</span>
            </div>
            <button onClick={() => setIsVisible(false)} className="ml-4">
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}
