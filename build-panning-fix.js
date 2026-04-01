const fs = require('fs');
const path = require('path');

const dir = 'G:/project/samscope website';
const adminPath = path.join(dir, 'admin.html');
let content = fs.readFileSync(adminPath, 'utf8');

// 1. Re-write the image scaling and Canvas crop logic
const oldGetCroppedImageObj = `        function getCroppedImageBlob(imgElement, scaleFactor) {
            return new Promise((resolve) => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const Wc = 400; const Hc = 250;
                    canvas.width = Wc; canvas.height = Hc;
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = "#050d1a";
                    ctx.fillRect(0, 0, Wc, Hc);
                    
                    const r = Math.max(Wc / img.width, Hc / img.height);
                    const Wd = img.width * r * scaleFactor;
                    const Hd = img.height * r * scaleFactor;
                    const dx = (Wc - Wd) / 2;
                    const dy = (Hc - Hd) / 2;
                    
                    ctx.drawImage(img, dx, dy, Wd, Hd);
                    canvas.toBlob(resolve, 'image/jpeg', 0.9);
                };
                img.onerror = () => resolve(null); // Fallback on cross-origin error
                img.src = imgElement.src;
            });
        }`;

const dragLogicAndNewCropper = `        /* ═══ IMAGE PAN AND CROP LOGIC ═══ */
        let panX = 0, panY = 0, isDragging = false, startX, startY, activeImg = null;

        window.addEventListener('pointerdown', e => {
            if (e.target.tagName === 'IMG' && e.target.id.includes('preview')) {
                isDragging = true; activeImg = e.target;
                startX = e.clientX - panX; startY = e.clientY - panY;
                e.preventDefault();
            }
        });
        window.addEventListener('pointermove', e => {
            if (!isDragging || !activeImg) return;
            panX = e.clientX - startX; panY = e.clientY - startY;
            const type = activeImg.id.includes('demo') ? 'demo' : 'guide';
            const scaleInput = document.getElementById('edit-' + type + '-img-scale');
            const scale = scaleInput ? scaleInput.value / 100 : 1;
            activeImg.style.transform = \`scale(\${scale}) translate(\${panX / scale}px, \${panY / scale}px)\`;
        });
        const stopDrag = () => { isDragging = false; activeImg = null; };
        window.addEventListener('pointerup', stopDrag);
        window.addEventListener('pointercancel', stopDrag);

        function updateImageScale(type, val) {
            const img = document.getElementById('edit-' + type + '-img-preview');
            const scale = val / 100;
            if (img) img.style.transform = \`scale(\${scale}) translate(\${panX / scale}px, \${panY / scale}px)\`;
        }

        function getCroppedImageBlob(imgElement, scaleFactor) {
            return new Promise((resolve) => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const Wc = 400; const Hc = 250;
                    canvas.width = Wc; canvas.height = Hc;
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = "#050d1a";
                    ctx.fillRect(0, 0, Wc, Hc);
                    
                    // object-fit: contain translates to Math.min scaling
                    const r = Math.min(Wc / img.width, Hc / img.height);
                    const Wd = img.width * r * scaleFactor;
                    const Hd = img.height * r * scaleFactor;
                    
                    // Add the visual pan offsets
                    const dx = (Wc - Wd) / 2 + panX;
                    const dy = (Hc - Hd) / 2 + panY;
                    
                    ctx.drawImage(img, dx, dy, Wd, Hd);
                    canvas.toBlob(resolve, 'image/jpeg', 0.9);
                };
                img.onerror = () => resolve(null);
                img.src = imgElement.src;
            });
        }`;

if (content.includes(oldGetCroppedImageObj)) {
    content = content.replace(oldGetCroppedImageObj, dragLogicAndNewCropper);
}

// 2. Remove the old updateImageScale definition if it exists
if (content.split('function updateImageScale').length > 2) {
    const doubleScaleDefPattern = /function updateImageScale\(type, val\) \{\s*const img = document\.getElementById\('edit-' \+ type \+ '-img-preview'\);\s*if \(img\) img\.style\.transform = `scale\(\$\{val \/ 100\}\)`;\s*\}/g;
    content = content.replace(doubleScaleDefPattern, '');
}


// 3. Reset panX and panY in editPost and handleImageSelect
content = content.replace(
    `if (scaleInput) { scaleInput.value = 100; prev.style.transform = 'scale(1)'; }`,
    `panX = 0; panY = 0;\n            if (scaleInput) { scaleInput.value = 100; prev.style.transform = 'scale(1) translate(0px, 0px)'; }`
);

content = content.replace(
    `if (scaleInput) { scaleInput.value = 100; prev.style.transform = 'scale(1)'; }`,
    `panX = 0; panY = 0;\n            if (scaleInput) { scaleInput.value = 100; prev.style.transform = 'scale(1) translate(0px, 0px)'; }`
);

// 4. Update saveEdit to trigger on pan movement too
content = content.replace(
    `if (file || scaleVal != 100) {`,
    `if (file || scaleVal != 100 || panX !== 0 || panY !== 0) {`
);
content = content.replace(
    `if (scaleVal != 100) {`,
    `if (scaleVal != 100 || panX !== 0 || panY !== 0) {`
);

fs.writeFileSync(adminPath, content, 'utf8');
console.log('Successfully injected panning logic and new cropper!');

