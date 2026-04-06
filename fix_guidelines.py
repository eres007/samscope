with open('guidelines.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add brand name field after full name field
old_text = '''                <div class="modal-input-group">
                    <input type="text" name="name" class="modal-input-field" placeholder="Full Name" required>
                </div>

                <div class="modal-input-group">
                    <input type="tel" name="phone" class="modal-input-field" placeholder="Phone Number" required>
                </div>'''

new_text = '''                <div class="modal-input-group">
                    <input type="text" name="name" class="modal-input-field" placeholder="Full Name" required>
                </div>

                <div class="modal-input-group">
                    <input type="text" name="brand_name" class="modal-input-field" placeholder="Brand Name" required>
                </div>

                <div class="modal-input-group">
                    <input type="tel" name="phone" class="modal-input-field" placeholder="Phone Number" required>
                </div>'''

content = content.replace(old_text, new_text)

with open('guidelines.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed guidelines.html - added brand name field to all forms")
