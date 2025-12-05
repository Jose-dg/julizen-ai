'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function NewsletterPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');

    useEffect(() => {
        const hasSeenPopup = localStorage.getItem('newsletter-popup-seen');
        const timer = setTimeout(() => {
            if (!hasSeenPopup) {
                setIsOpen(true);
            }
        }, 10000); // Show after 10 seconds

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('newsletter-popup-seen', 'true');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Send to email service
        console.log('Email:', email);
        handleClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md">
                <button onClick={handleClose} className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>
                <DialogHeader>
                    <DialogTitle>🎮 ¡Obtén 10% OFF!</DialogTitle>
                    <DialogDescription>Suscríbete y recibe descuentos exclusivos en gift cards</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Button type="submit" className="w-full">
                        Quiero mi descuento
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
