const fs = require('fs');
const path = require('path');

const dir = '.';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const trackingScript = `
<!-- Analytics Tracking (Enhanced) -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
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
            } catch (e) { console.warn('Analytics: Could not fetch IP'); }

            trackView();
        } else {
            // Retry if supabase isn't loaded yet
            setTimeout(initTracking, 500);
        }
    }

    async function trackView() {
        if(!sb) return;
        const path = window.location.pathname.split('/').pop() || 'index.html';
        await sb.from('page_views').insert([{ 
            page_path: path,
            ip_address: userIP,
            user_agent: navigator.userAgent
        }]);
    }

    // Start tracking when DOM is ready
    if (document.readyState === 'complete') initTracking();
    else window.addEventListener('load', initTracking);

    document.addEventListener('click', async (e) => {
        const a = e.target.closest('a');
        if (a && sb) {
            const clickData = { 
                link_url: a.href, 
                link_text: a.innerText.trim().substring(0, 50),
                page_path: window.location.pathname.split('/').pop() || 'index.html',
                ip_address: userIP
            };
            
            // Use fetch with keepalive if possible for better reliability during navigation
            try {
                await sb.from('link_clicks').insert([clickData]);
            } catch (e) {
                console.warn('Analytics: Click tracking failed');
            }
        }
    });
})();
</script>
`;

files.forEach(f => {
    if (f === 'admin.html') return; // Skip admin.html
    let content = fs.readFileSync(path.join(dir, f), 'utf8');
    
    // Remove old tracking script if it exists (using the comment tags)
    const oldTag = '<!-- Analytics Tracking -->';
    const enhancedTag = '<!-- Analytics Tracking (Enhanced) -->';
    
    if (content.includes(oldTag) || content.includes(enhancedTag)) {
        // Simple regex to find and remove the script block starting with either tag
        const regex = /<!-- Analytics Tracking.*?<\/script>/gs;
        content = content.replace(regex, '');
    }

    // Inject new script
    const insertIdx = content.lastIndexOf('</body>');
    if (insertIdx !== -1) {
        content = content.substring(0, insertIdx) + trackingScript + content.substring(insertIdx);
        fs.writeFileSync(path.join(dir, f), content, 'utf8');
        console.log('Updated tracking in', f);
    }
});

console.log('Build complete (analytics). Admin.html skipped as it is manually integrated.');

