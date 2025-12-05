export { };

declare global {
    interface Window {
        gtag: (
            command: 'config' | 'event' | 'js',
            targetId: string,
            config?: Record<string, any>
        ) => void;
        fbq: (
            command: 'track' | 'init' | 'trackCustom',
            eventName: string,
            params?: Record<string, any>
        ) => void;
        _fbq: any;
    }
}
