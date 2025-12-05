'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function MetaPixel({ PIXEL_ID }: { PIXEL_ID: string }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (pathname && typeof window !== 'undefined' && window.fbq) {
            window.fbq('track', 'PageView');
        }
    }, [pathname, searchParams]);

    return (
        <>
            <Script
                id="facebook-pixel"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${PIXEL_ID}');
            fbq('track', 'PageView');
          `,
                }}
            />
            <noscript>
                <img
                    height="1"
                    width="1"
                    style={{ display: 'none' }}
                    src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
                    alt="facebook pixel"
                />
            </noscript>
        </>
    );
}
