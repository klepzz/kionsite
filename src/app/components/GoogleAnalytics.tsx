'use client';

import { useEffect } from 'react';

export default function GoogleAnalytics({ gaId }: { gaId: string }) {
    useEffect(() => {
        // Prevent duplicate injection
        if (document.getElementById('ga-init')) return;

        // Create the async script tag (gtag.js)
        const script1 = document.createElement('script');
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        script1.async = true;
        script1.id = 'ga-script-src';
        document.head.appendChild(script1);

        // Create the config script tag
        const script2 = document.createElement('script');
        script2.id = 'ga-init';
        script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}', {
        page_path: window.location.pathname,
      });
    `;
        document.head.appendChild(script2);

        // Debugging marker
        console.log('Google Analytics Injected Forcefully');
    }, [gaId]);

    return (
        <div id="ga-force-inject-marker" style={{ display: 'none' }} />
    );
}
