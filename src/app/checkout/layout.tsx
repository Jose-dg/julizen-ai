export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
    return (
        // <div className="min-h-screen bg-white text-gray-900">
        <div className="min-h-screen bg-white">
            <div className="max-w-[1100px] mx-auto">
                {children}
            </div>
        </div>
    )
}