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
    const appointmentForm = document.querySelector('.appointment-form');
    if (appointmentForm) {
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
                service: formData.get('services'),
                appointment_date: formData.get('Appointment Date'),
                appointment_time: formData.get('Appointment Time'),
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
                const triggerLabel = document.querySelector('.trigger-label');
                if (triggerLabel) triggerLabel.style.display = 'block';
                const hiddenInput = document.getElementById('selectedServices');
                if (hiddenInput) hiddenInput.value = '';
            } catch (err) {
                showToast('Failed to book appointment', 'error');
            } finally {
                btn.disabled = false;
                btn.textContent = originalText;
            }
        });
    }

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

    /* ═══ APPOINTMENT MODAL LOGIC (Updated for New Design) ═══ */
    const modal = document.querySelector('.appointment-modal-overlay');
    const openModalBtns = document.querySelectorAll('.btn-open-modal');
    const closeModalBtn = document.querySelector('.appointment-modal-close');

    if (modal) {
        // Open Modal
        openModalBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; 
            });
        });

        // Close Modal
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // --- Modal Multi-Select ---
        const modalServiceTrigger = document.getElementById('modalServiceTrigger');
        const modalServiceOptions = document.getElementById('modalServiceOptions');
        const modalSelectedServicesInput = document.getElementById('modalSelectedServices');
        const modalSelectedItemsContainer = modal.querySelector('.selected-items');

        if (modalServiceTrigger && modalServiceOptions) {
            modalServiceTrigger.addEventListener('click', () => {
                modalServiceOptions.classList.toggle('show');
                modalServiceTrigger.classList.toggle('active');
            });

            modalServiceOptions.querySelectorAll('.select-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    option.classList.toggle('selected');
                    updateModalSelectedServices();
                });
            });

            function updateModalSelectedServices() {
                const selected = Array.from(modalServiceOptions.querySelectorAll('.select-option.selected'));
                const values = selected.map(opt => opt.getAttribute('data-value'));
                const texts = selected.map(opt => opt.textContent);
                modalSelectedServicesInput.value = values.join(',');

                modalSelectedItemsContainer.innerHTML = '';
                const label = modalServiceTrigger.querySelector('.trigger-label');

                if (values.length > 0) {
                    label.style.display = 'none';
                    if (values.length <= 2) {
                        texts.forEach(text => {
                            const tag = document.createElement('span');
                            tag.className = 'selected-tag';
                            tag.textContent = text;
                            modalSelectedItemsContainer.appendChild(tag);
                        });
                    } else {
                        const tag = document.createElement('span');
                        tag.className = 'selected-tag';
                        tag.textContent = `${values.length} Services Selected`;
                        modalSelectedItemsContainer.appendChild(tag);
                    }
                } else {
                    label.style.display = 'block';
                }
            }
        }

        // --- Modal Date & Time Pickers (Updated) ---
        const mDateInput = document.getElementById('modalAppointmentDate');
        const mCalendar = document.getElementById('modalCalendarDropdown');
        if (mDateInput && mCalendar) {
            mDateInput.addEventListener('click', () => {
                mCalendar.classList.toggle('show');
                generateModalCalendar(currentMonth, currentYear);
            });

            function generateModalCalendar(month, year) {
                const firstDay = new Date(year, month, 1).getDay();
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                mCalendar.innerHTML = `
                    <div class="calendar-header">
                        <span class="calendar-month-year">${monthNames[month]} ${year}</span>
                        <div class="calendar-nav">
                            <button id="mPrevMonth" type="button"><i class="fas fa-chevron-left"></i></button>
                            <button id="mNextMonth" type="button"><i class="fas fa-chevron-right"></i></button>
                        </div>
                    </div>
                    <div class="calendar-weekdays">
                        <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                    </div>
                    <div class="calendar-days" id="mCalendarDays"></div>`;
                const daysContainer = document.getElementById('mCalendarDays');
                for (let i = 0; i < firstDay; i++) daysContainer.appendChild(Object.assign(document.createElement('div'), {className:'calendar-day empty'}));
                for (let i = 1; i <= daysInMonth; i++) {
                    const day = document.createElement('div');
                    day.className = 'calendar-day';
                    day.textContent = i;
                    const ds = `${i} ${monthNames[month]} ${year}`;
                    if (mDateInput.value === ds) day.classList.add('active');
                    day.addEventListener('click', () => { mDateInput.value = ds; mCalendar.classList.remove('show'); });
                    daysContainer.appendChild(day);
                }
                document.getElementById('mPrevMonth').onclick = (e) => { e.stopPropagation(); currentMonth--; if(currentMonth<0){currentMonth=11;currentYear--;} generateModalCalendar(currentMonth, currentYear); };
                document.getElementById('mNextMonth').onclick = (e) => { e.stopPropagation(); currentMonth++; if(currentMonth>11){currentMonth=0;currentYear++;} generateModalCalendar(currentMonth, currentYear); };
            }
        }

        const mTimeInput = document.getElementById('modalAppointmentTime');
        const mTimePicker = document.getElementById('modalTimepickerDropdown');
        if (mTimeInput && mTimePicker) {
            mTimeInput.addEventListener('click', () => {
                mTimePicker.classList.toggle('show');
                if (mTimePicker.classList.contains('show')) {
                    const slots = ["09:00 AM (UTC+6)", "10:00 AM (UTC+6)", "11:00 AM (UTC+6)", "12:00 PM (UTC+6)", "01:00 PM (UTC+6)", "02:00 PM (UTC+6)", "03:00 PM (UTC+6)", "04:00 PM (UTC+6)", "05:00 PM (UTC+6)"];
                    mTimePicker.innerHTML = '<div class="timepicker-list"></div>';
                    const list = mTimePicker.querySelector('.timepicker-list');
                    slots.forEach(slot => {
                        const el = document.createElement('div');
                        el.className = 'time-slot';
                        el.textContent = slot;
                        if (mTimeInput.value === slot) el.classList.add('active');
                        el.addEventListener('click', () => { mTimeInput.value = slot; mTimePicker.classList.remove('show'); });
                        list.appendChild(el);
                    });
                }
            });
        }

        // --- Modal Form Submission (Updated for Extra Fields) ---
        const modalForm = document.getElementById('modalForm');
        if (modalForm) {
            modalForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = modalForm.querySelector('button[type="submit"]');
                const originalText = btn.textContent;
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> &nbsp;Booking...';

                const formData = new FormData(modalForm);
                const formDataObj = {
                    full_name: formData.get('name'),
                    phone: formData.get('phone'),
                    whatsapp: formData.get('whatsapp'), // Added
                    email: formData.get('email'),
                    service: formData.get('services'),
                    appointment_date: formData.get('Appointment Date'),
                    appointment_time: formData.get('Appointment Time'),
                    message: formData.get('message')
                };

                try {
                    if (window.db) {
                        const { error } = await window.db.from('consultations').insert([formDataObj]);
                        if (error) throw error;
                    }
                    await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });
                    showToast('Appointment booked successfully!', 'success');
                    modalForm.reset();
                    closeModal(); 
                } catch (err) {
                    showToast('Failed to book appointment', 'error');
                } finally {
                    btn.disabled = false;
                    btn.textContent = originalText;
                }
            });
        }
    }

    // --- Sidebar Form Logic ---
    const sidebarServiceTrigger = document.getElementById('sidebarServiceTrigger');
    const sidebarServiceOptions = document.getElementById('sidebarServiceOptions');
    const sidebarSelectedServicesInput = document.getElementById('sidebarSelectedServices');
    const sidebarSelectedItemsContainer = sidebarServiceTrigger?.querySelector('.selected-items');

    if (sidebarServiceTrigger && sidebarServiceOptions) {
        sidebarServiceTrigger.addEventListener('click', () => {
            const isHidden = sidebarServiceOptions.style.display === 'none';
            sidebarServiceOptions.style.display = isHidden ? 'block' : 'none';
            sidebarServiceTrigger.classList.toggle('active');
        });

        sidebarServiceOptions.querySelectorAll('.select-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                option.classList.toggle('selected');
                updateSidebarSelectedServices();
            });
        });

        function updateSidebarSelectedServices() {
            const selected = Array.from(sidebarServiceOptions.querySelectorAll('.select-option.selected'));
            const values = selected.map(opt => opt.getAttribute('data-value'));
            const texts = selected.map(opt => opt.textContent);
            sidebarSelectedServicesInput.value = values.join(',');

            sidebarSelectedItemsContainer.innerHTML = '';
            const label = sidebarServiceTrigger.querySelector('.trigger-label');

            if (values.length > 0) {
                label.style.display = 'none';
                if (values.length <= 1) {
                    texts.forEach(text => {
                        const tag = document.createElement('span');
                        tag.className = 'selected-tag';
                        tag.textContent = text;
                        sidebarSelectedItemsContainer.appendChild(tag);
                    });
                } else {
                    const tag = document.createElement('span');
                    tag.className = 'selected-tag';
                    tag.textContent = `${values.length} Selected`;
                    sidebarSelectedItemsContainer.appendChild(tag);
                }
            } else {
                label.style.display = 'block';
            }
        }
    }

    // Sidebar Calendar
    const sDateInput = document.getElementById('sidebarAppointmentDate');
    const sCalendar = document.getElementById('sidebarCalendarDropdown');
    const today = new Date();
    let sMonth = today.getMonth();
    let sYear = today.getFullYear();

    if (sDateInput && sCalendar) {
        sDateInput.addEventListener('click', () => {
            const isHidden = sCalendar.style.display === 'none';
            sCalendar.style.display = isHidden ? 'block' : 'none';
            if (isHidden) generateSidebarCalendar(sMonth, sYear);
        });

        function generateSidebarCalendar(month, year) {
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            
            sCalendar.innerHTML = `
                <div class="calendar-header">
                    <span class="calendar-month-year">${monthNames[month]} ${year}</span>
                    <div class="calendar-nav">
                        <button id="sPrevMonth" type="button"><i class="fas fa-chevron-left"></i></button>
                        <button id="sNextMonth" type="button"><i class="fas fa-chevron-right"></i></button>
                    </div>
                </div>
                <div class="calendar-weekdays">
                    <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                </div>
                <div class="calendar-days" id="sCalendarDays"></div>`;
            
            const daysContainer = document.getElementById('sCalendarDays');
            for (let i = 0; i < firstDay; i++) daysContainer.appendChild(Object.assign(document.createElement('div'), {className:'calendar-day empty'}));
            for (let i = 1; i <= daysInMonth; i++) {
                const day = document.createElement('div');
                day.className = 'calendar-day';
                day.textContent = i;
                const ds = `${i} ${monthNames[month]} ${year}`;
                if (sDateInput.value === ds) day.classList.add('active');
                day.addEventListener('click', () => { 
                    sDateInput.value = ds; 
                    sCalendar.style.display = 'none'; 
                });
                daysContainer.appendChild(day);
            }

            document.getElementById('sPrevMonth').onclick = (e) => { 
                e.stopPropagation(); 
                sMonth--; 
                if(sMonth < 0){ sMonth = 11; sYear--; } 
                generateSidebarCalendar(sMonth, sYear); 
            };
            document.getElementById('sNextMonth').onclick = (e) => { 
                e.stopPropagation(); 
                sMonth++; 
                if(sMonth > 11){ sMonth = 0; sYear++; } 
                generateSidebarCalendar(sMonth, sYear); 
            };
        }
    }

    // Sidebar Time Picker
    const sTimeInput = document.getElementById('sidebarAppointmentTime');
    const sTimePicker = document.getElementById('sidebarTimepickerDropdown');
    if (sTimeInput && sTimePicker) {
        sTimeInput.addEventListener('click', () => {
            const isHidden = sTimePicker.style.display === 'none';
            sTimePicker.style.display = isHidden ? 'block' : 'none';
            if (isHidden) {
                const slots = ["09:00 AM (UTC+6)", "10:00 AM (UTC+6)", "11:00 AM (UTC+6)", "12:00 PM (UTC+6)", "01:00 PM (UTC+6)", "02:00 PM (UTC+6)", "03:00 PM (UTC+6)", "04:00 PM (UTC+6)", "05:00 PM (UTC+6)"];
                sTimePicker.innerHTML = '<div class="timepicker-list"></div>';
                const list = sTimePicker.querySelector('.timepicker-list');
                slots.forEach(slot => {
                    const el = document.createElement('div');
                    el.className = 'time-slot';
                    el.textContent = slot;
                    if (sTimeInput.value === slot) el.classList.add('active');
                    el.addEventListener('click', () => { 
                        sTimeInput.value = slot; 
                        sTimePicker.style.display = 'none'; 
                    });
                    list.appendChild(el);
                });
            }
        });
    }

    // Sidebar Form Submission
    const sidebarForm = document.getElementById('sidebarForm');
    if (sidebarForm) {
        sidebarForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = sidebarForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> &nbsp;Booking...';

            const formData = new FormData(sidebarForm);
            const formDataObj = {
                full_name: formData.get('name'),
                phone: formData.get('phone'),
                whatsapp: formData.get('whatsapp'),
                email: formData.get('email'),
                service: formData.get('services'),
                appointment_date: formData.get('Appointment Date'),
                appointment_time: formData.get('Appointment Time'),
                message: formData.get('message')
            };

            try {
                if (window.db) {
                    const { error } = await window.db.from('consultations').insert([formDataObj]);
                    if (error) throw error;
                }
                await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });
                showToast('Appointment booked successfully!', 'success');
                sidebarForm.reset();
                if (sidebarSelectedItemsContainer) sidebarSelectedItemsContainer.innerHTML = '';
                const triggerLabel = sidebarServiceTrigger?.querySelector('.trigger-label');
                if (triggerLabel) triggerLabel.style.display = 'block';
                sidebarServiceOptions?.querySelectorAll('.select-option.selected').forEach(opt => opt.classList.remove('selected'));
            } catch (err) {
                showToast('Failed to book appointment', 'error');
            } finally {
                btn.disabled = false;
                btn.textContent = originalText;
            }
        });
    }

    // Update global click listener for sidebar dropdowns
    document.addEventListener('click', (e) => {
        if (sidebarServiceTrigger && !sidebarServiceTrigger.contains(e.target) && !sidebarServiceOptions.contains(e.target)) {
            sidebarServiceOptions.style.display = 'none';
        }
        if (sDateInput && !sDateInput.contains(e.target) && !sCalendar.contains(e.target)) {
            sCalendar.style.display = 'none';
        }
        if (sTimeInput && !sTimeInput.contains(e.target) && !sTimePicker.contains(e.target)) {
            sTimePicker.style.display = 'none';
        }
    });

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



