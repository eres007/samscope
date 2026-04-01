document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Scroll Indicator Interaction
    const scrollBtn = document.querySelector('.scroll-btn');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            // Scroll to the next section or a specific offset
            // Since we don't have a next section yet, we'll just scroll down a bit for effect
            window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
        });
    }
    // FAQ Accordion Interaction
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other items (optional - currently allowing multiple open)
            // faqItems.forEach(otherItem => {
            //     if (otherItem !== item) otherItem.classList.remove('active');
            // });

            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Custom Multi-Select Dropdown Logic
    const serviceTrigger = document.getElementById('serviceTrigger');
    const serviceOptions = document.getElementById('serviceOptions');
    const selectedServicesInput = document.getElementById('selectedServices');
    const selectedItemsContainer = document.querySelector('.selected-items');

    if (serviceTrigger && serviceOptions) {
        serviceTrigger.addEventListener('click', () => {
            serviceOptions.classList.toggle('show');
            serviceTrigger.classList.toggle('active');
        });

        const options = serviceOptions.querySelectorAll('.select-option');
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent closing when selecting
                option.classList.toggle('selected');
                updateSelectedServices();
            });
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!serviceTrigger.contains(e.target) && !serviceOptions.contains(e.target)) {
                serviceOptions.classList.remove('show');
                serviceTrigger.classList.remove('active');
            }
        });

        function updateSelectedServices() {
            const selectedOptions = Array.from(serviceOptions.querySelectorAll('.select-option.selected'));
            const values = selectedOptions.map(opt => opt.getAttribute('data-value'));
            const texts = selectedOptions.map(opt => opt.textContent);

            selectedServicesInput.value = values.join(',');

            // Update UI
            selectedItemsContainer.innerHTML = '';
            const triggerLabel = document.querySelector('.trigger-label');

            if (values.length > 0) {
                triggerLabel.style.display = 'none';

                // Show first few or just a count if too many
                if (values.length <= 2) {
                    texts.forEach(text => {
                        const tag = document.createElement('span');
                        tag.className = 'selected-tag';
                        tag.textContent = text;
                        selectedItemsContainer.appendChild(tag);
                    });
                } else {
                    const tag = document.createElement('span');
                    tag.className = 'selected-tag';
                    tag.textContent = `${values.length} Services Selected`;
                    selectedItemsContainer.appendChild(tag);
                }
            } else {
                triggerLabel.style.display = 'block';
            }
        }
    }

    // Custom Calendar logic
    const dateInput = document.getElementById('appointmentDate');
    const calendarDropdown = document.getElementById('calendarDropdown');
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    if (dateInput && calendarDropdown) {
        dateInput.addEventListener('click', () => {
            calendarDropdown.classList.toggle('show');
            generateCalendar(currentMonth, currentYear);
        });

        function generateCalendar(month, year) {
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            calendarDropdown.innerHTML = `
                <div class="calendar-header">
                    <span class="calendar-month-year">${monthNames[month]} ${year}</span>
                    <div class="calendar-nav">
                        <button id="prevMonth" type="button"><i class="fas fa-chevron-left"></i></button>
                        <button id="nextMonth" type="button"><i class="fas fa-chevron-right"></i></button>
                    </div>
                </div>
                <div class="calendar-weekdays">
                    <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                </div>
                <div class="calendar-days" id="calendarDays"></div>
            `;

            const calendarDays = document.getElementById('calendarDays');
            for (let i = 0; i < firstDay; i++) {
                const day = document.createElement('div');
                day.className = 'calendar-day empty';
                calendarDays.appendChild(day);
            }

            for (let i = 1; i <= daysInMonth; i++) {
                const day = document.createElement('div');
                day.className = 'calendar-day';
                day.textContent = i;
                const d = new Date(year, month, i);
                const dateString = `${i} ${monthNames[month]} ${year}`;

                if (dateInput.value === dateString) day.classList.add('active');

                day.addEventListener('click', () => {
                    dateInput.value = dateString;
                    calendarDropdown.classList.remove('show');
                });
                calendarDays.appendChild(day);
            }

            document.getElementById('prevMonth').onclick = (e) => {
                e.stopPropagation();
                currentMonth--;
                if (currentMonth < 0) { currentMonth = 11; currentYear--; }
                generateCalendar(currentMonth, currentYear);
            };
            document.getElementById('nextMonth').onclick = (e) => {
                e.stopPropagation();
                currentMonth++;
                if (currentMonth > 11) { currentMonth = 0; currentYear++; }
                generateCalendar(currentMonth, currentYear);
            };
        }
    }

    // Custom Time Picker logic
    const timeInput = document.getElementById('appointmentTime');
    const timepickerDropdown = document.getElementById('timepickerDropdown');

    if (timeInput && timepickerDropdown) {
        timeInput.addEventListener('click', () => {
            timepickerDropdown.classList.toggle('show');
            if (timepickerDropdown.classList.contains('show')) generateTimeSlots();
        });

        function generateTimeSlots() {
            const slots = ["09:00 AM (UTC+6)", "09:30 AM (UTC+6)", "10:00 AM (UTC+6)", "10:30 AM (UTC+6)", "11:00 AM (UTC+6)", "11:30 AM (UTC+6)", "12:00 PM (UTC+6)", "12:30 PM (UTC+6)", "01:00 PM (UTC+6)", "01:30 PM (UTC+6)", "02:00 PM (UTC+6)", "02:30 PM (UTC+6)", "03:00 PM (UTC+6)", "03:30 PM (UTC+6)", "04:00 PM (UTC+6)", "04:30 PM (UTC+6)", "05:00 PM (UTC+6)"];
            timepickerDropdown.innerHTML = '<div class="timepicker-list"></div>';
            const list = timepickerDropdown.querySelector('.timepicker-list');

            slots.forEach(slot => {
                const el = document.createElement('div');
                el.className = 'time-slot';
                el.textContent = slot;
                if (timeInput.value === slot) el.classList.add('active');
                el.addEventListener('click', () => {
                    timeInput.value = slot;
                    timepickerDropdown.classList.remove('show');
                });
                list.appendChild(el);
            });
        }
    }

    // Global click listener to close dropdowns
    document.addEventListener('click', (e) => {
        if (dateInput && !dateInput.contains(e.target) && !calendarDropdown.contains(e.target)) {
            calendarDropdown.classList.remove('show');
        }
        if (timeInput && !timeInput.contains(e.target) && !timepickerDropdown.contains(e.target)) {
            timepickerDropdown.classList.remove('show');
        }
    });

    /* ═══ GLOBAL SUPABASE INIT ═══ */
    const SUPABASE_URL = 'https://ocaeyapzahotesvybfon.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jYWV5YXB6YWhvdGVzdnliZm9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNzE2OTEsImV4cCI6MjA4Nzk0NzY5MX0.dkOHsv1zHDTvlbQIqYQ_VaI6d2e6uZxEBs__ldbpj9k';

    if (!window.db && window.supabase) {
        window.db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }

    /* ═══ APPOINTMENT SUBMISSION ═══ */
    function bindAppointmentForms() {
        const appointmentForms = document.querySelectorAll('.appointment-form');
        appointmentForms.forEach(appointmentForm => {
            // Avoid double-binding
            if(appointmentForm.dataset.bound) return;
            appointmentForm.dataset.bound = 'true';

            appointmentForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = appointmentForm.querySelector('button[type="submit"]');
                const originalText = btn.textContent;
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> &nbsp;Booking...';

                const formData = new FormData(appointmentForm);
                const formDataObj = {
                    full_name: formData.get('name') || formData.get('Full Name'),
                    phone: formData.get('phone') || formData.get('Phone Number'),
                    whatsapp: formData.get('whatsapp') || formData.get('Whatsapp Number'),
                    email: formData.get('email') || formData.get('E-mail Address'),
                    service: formData.get('services') || 'General Appt',
                    appointment_date: formData.get('Appointment Date') || '',
                    appointment_time: formData.get('Appointment Time') || '',
                    message: formData.get('message') || formData.get('Briefly Describe Your Project or Goals') || formData.get('How can we help you?')
                };

                try {
                    if (!window.db) throw new Error("Database not initialized");
                    const { error } = await window.db.from('consultations').insert([formDataObj]);
                    if (error) throw error;

                    fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });
                    showToast('Appointment booked successfully!', 'success');
                    appointmentForm.reset();
                    document.querySelectorAll('.selected-tag').forEach(el => el.remove());
                    const triggerLabel = appointmentForm.querySelector('.trigger-label');
                    if (triggerLabel) triggerLabel.style.display = 'block';
                    const hiddenInput = appointmentForm.querySelector('input[name="services"]');
                    if (hiddenInput) hiddenInput.value = '';
                    
                    // Close modal if this form was inside a modal
                    const modal = document.getElementById('globalAppointmentModal');
                    if (modal && modal.style.display === 'flex') {
                        setTimeout(() => modal.style.display = 'none', 1500);
                    }
                } catch (err) {
                    showToast('Failed to book appointment', 'error');
                } finally {
                    btn.disabled = false;
                    btn.textContent = originalText;
                }
            });
        });
    }

    // Bind initially
    bindAppointmentForms();

    /* ═══ DYNAMIC APPOINTMENT MODAL INJECTION & LOGIC ═══ */
    const modalHTML = `
    <div class="modal-overlay appointment-modal-overlay" id="globalAppointmentModal">
        <div class="modal-content appointment-modal-content">
            <div class="modal-header">
                <h3>BOOK AN APPOINTMENT</h3>
                <button type="button" class="btn-close" id="closeAppointmentModal">&times;</button>
            </div>
            <div class="modal-body">
                <form class="appointment-form" action="https://api.web3forms.com/submit" method="POST">
                    <input type="hidden" name="access_key" value="4f9f5e56-d1e3-4df7-9859-7ccb1e1ccc33">
                    <input type="hidden" name="subject" value="New Appointment Request - Global Modal">

                    <div class="form-group" style="margin-bottom:15px;">
                        <input type="text" class="form-input" name="name" placeholder="Full Name" required>
                    </div>

                    <div class="form-group" style="margin-bottom:15px;">
                        <input type="tel" class="form-input" name="phone" placeholder="Phone Number" required>
                    </div>
                    
                    <div class="form-group" style="margin-bottom:15px;">
                        <input type="email" class="form-input" name="email" placeholder="E-mail Address" required>
                    </div>

                    <div class="form-group" style="margin-bottom:20px;">
                        <textarea name="message" class="form-input" required placeholder="Briefly Describe Your Project or Goals" rows="4"></textarea>
                    </div>

                    <button type="submit" class="book-appointment-btn" style="width:100%;">Confirm Booking</button>
                </form>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const mainModal = document.getElementById('globalAppointmentModal');
    const closeBtn = document.getElementById('closeAppointmentModal');

    // Re-bind forms since we just appended a new one
    bindAppointmentForms();

    // Event listener to open modal via any trigger
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.open-modal-btn');
        if (trigger) {
            e.preventDefault(); // prevent navigation if it's an <a> tag
            mainModal.style.display = 'flex';
        }
    });

    // Close logic
    if(closeBtn) {
        closeBtn.addEventListener('click', () => {
            mainModal.style.display = 'none';
        });
    }
    
    // Clicking outside modal body
    mainModal.addEventListener('click', (e) => {
        if (e.target === mainModal) {
            mainModal.style.display = 'none';
        }
    });


    /* ═══ GLOBAL ANALYTICS TRACKER ═══ */
    (async function () {
        if (!window.db) return;

        // 1. Page View Tracking
        try {
            let ip = 'unknown';
            try {
                const r = await fetch('https://api.ipify.org?format=json');
                const d = await r.json();
                ip = d.ip;
            } catch (e) { }

            let path = window.location.pathname.split('/').pop() || 'index';
            if (path === '') path = 'index';

            await window.db.from('page_views').insert([{
                page_path: path,
                user_agent: navigator.userAgent,
                ip_address: ip
            }]);

            // 2. Global Click Tracking
            document.addEventListener('click', async (e) => {
                const target = e.target.closest('a, button');
                if (!target) return;

                // Skip tracking for admin actions or internal form triggers if needed
                if (target.classList.contains('action-btn') || target.id === 'serviceTrigger') return;

                const linkText = target.innerText.trim() || target.getAttribute('title') || target.getAttribute('aria-label') || 'unnamed-element';
                const linkUrl = target.href || 'button-click';

                try {
                    await window.db.from('link_clicks').insert([{
                        link_text: linkText,
                        link_url: linkUrl,
                        page_path: path,
                        ip_address: ip
                    }]);
                } catch (err) {
                    console.error('Click tracking failed:', err);
                }
            });

        } catch (err) {
            console.error('Analytics init failed:', err);
        }
    })();

});

/* ═══ GLOBAL UTILITIES ═══ */
function showToast(msg, type = 'success') {
    let t = document.getElementById('toast');

    // Create toast element if it doesn't exist
    if (!t) {
        t = document.createElement('div');
        t.id = 'toast';
        t.className = 'toast';
        t.style.cssText = `position:fixed; bottom:28px; right:28px; background:rgba(10, 24, 50, 0.95); border:1px solid rgba(255,255,255,0.1); border-top:1px solid rgba(255,255,255,0.3); border-radius:14px; color:#e0eaf8; font-size:0.88rem; padding:14px 22px; display:flex; align-items:center; gap:10px; box-shadow:0 20px 50px rgba(0,0,0,0.5); transform:translateY(80px); opacity:0; transition:all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); z-index:9999;`;
        t.innerHTML = `<i class="fas fa-check-circle"></i><span id="toast-msg"></span>`;
        document.body.appendChild(t);
    }

    const ic = t.querySelector('i');
    const msgEl = t.querySelector('#toast-msg');

    msgEl.textContent = msg;
    t.style.borderColor = type === 'success' ? '#3ecf8e' : '#e05252';
    ic.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    ic.style.color = type === 'success' ? '#3ecf8e' : '#e05252';

    t.style.opacity = '1';
    t.style.transform = 'translateY(0)';

    setTimeout(() => {
        t.style.opacity = '0';
        t.style.transform = 'translateY(80px)';
    }, 4000);
}



