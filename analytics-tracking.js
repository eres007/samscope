// Centralized Analytics Tracking - One view per IP per page
(function() {
    const SB_URL = 'https://ocaeyapzahotesvybfon.supabase.co';
    const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jYWV5YXB6YWhvdGVzdnliZm9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNzE2OTEsImV4cCI6MjA4Nzk0NzY5MX0.dkOHsv1zHDTvlbQIqYQ_VaI6d2e6uZxEBs__ldbpj9k';
    
    let sb = null;
    let userIP = 'unknown';

    async function initTracking() {
        if (typeof supabase !== 'undefined') {
            sb = supabase.createClient(SB_URL, SB_KEY);
            
            // Get IP address
            try {
                const res = await fetch('https://api.ipify.org?format=json');
                const json = await res.json();
                userIP = json.ip;
            } catch (e) { 
                console.warn('Analytics: Could not fetch IP'); 
            }

            trackView();
        } else {
            setTimeout(initTracking, 500);
        }
    }

    async function trackView() {
        if (!sb) return;
        
        const path = window.location.pathname.split('/').pop() || 'index.html';
        
        try {
            // Check if this IP has already viewed this page
            const { data: existing, error: checkError } = await sb
                .from('page_views')
                .select('id')
                .eq('page_path', path)
                .eq('ip_address', userIP)
                .limit(1);
            
            if (checkError) throw checkError;
            
            // Only insert if this IP hasn't viewed this page before
            if (!existing || existing.length === 0) {
                await sb.from('page_views').insert([{ 
                    page_path: path,
                    ip_address: userIP,
                    user_agent: navigator.userAgent
                }]);
            }
        } catch (err) {
            console.warn('Analytics tracking error:', err);
        }
    }

    // Start tracking when DOM is ready
    if (document.readyState === 'complete') {
        initTracking();
    } else {
        window.addEventListener('load', initTracking);
    }

    // Track link clicks
    document.addEventListener('click', async (e) => {
        const a = e.target.closest('a');
        if (a && sb) {
            const clickData = { 
                link_url: a.href, 
                link_text: a.innerText.trim().substring(0, 50),
                page_path: window.location.pathname.split('/').pop() || 'index.html',
                ip_address: userIP
            };
            
            try {
                await sb.from('link_clicks').insert([clickData]);
            } catch (e) {
                console.warn('Analytics: Click tracking failed');
            }
        }
    });
})();
