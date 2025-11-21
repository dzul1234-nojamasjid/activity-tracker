// Handle date/weekday toggle
document.addEventListener('DOMContentLoaded', function() {
    // Populate misc items checkboxes
    const miscContainer = document.getElementById('misc-items-container');
    miscContainer.innerHTML = MISC_ITEMS_OPTIONS.map(item => `
        <div class="checkbox-item">
            <input type="checkbox" id="misc_${item.replace(/\s+/g, '_')}" name="misc_items" value="${item}">
            <label for="misc_${item.replace(/\s+/g, '_')}">${item}</label>
        </div>
    `).join('');

    // Handle schedule type toggle
    const scheduleTypeRadios = document.querySelectorAll('input[name="schedule_type"]');
    const dateField = document.getElementById('date-field');
    const weekdayField = document.getElementById('weekday-field');
    const dateInput = document.getElementById('date');
    const weekdaySelect = document.getElementById('weekday');

    scheduleTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'date') {
                dateField.classList.remove('hidden');
                weekdayField.classList.add('hidden');
                dateInput.required = true;
                weekdaySelect.required = false;
                weekdaySelect.value = '';
            } else {
                dateField.classList.add('hidden');
                weekdayField.classList.remove('hidden');
                dateInput.required = false;
                weekdaySelect.required = true;
                dateInput.value = '';
            }
        });
    });

    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
});

// Handle form submission
document.getElementById('add-activity-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitButton = this.querySelector('button[type="submit"]');
    const messageDiv = document.getElementById('message');
    
    // Show loading state
    submitButton.textContent = 'Adding...';
    submitButton.disabled = true;
    messageDiv.innerHTML = '';
    
    try {
        // Get form data
        const formData = new FormData(this);
        const scheduleType = document.querySelector('input[name="schedule_type"]:checked').value;
        
        // Get selected misc items
        const selectedMiscItems = Array.from(document.querySelectorAll('input[name="misc_items"]:checked'))
            .map(checkbox => checkbox.value);
        
        // Prepare activity data
        const activityData = {
            date: scheduleType === 'date' ? formData.get('date') : null,
            weekday: scheduleType === 'weekday' ? formData.get('weekday') : null,
            time: formData.get('time'),
            event: formData.get('event'),
            pax: parseInt(formData.get('pax')),
            work_description: formData.get('work_description'),
            venue: formData.get('venue'),
            misc_items: selectedMiscItems
        };
        
        // Validate PAX
        if (isNaN(activityData.pax) || activityData.pax < 1) {
            throw new Error('PAX must be a valid number greater than 0');
        }
        
        // Insert into Supabase
        const { data, error } = await supabase
            .from('events')
            .insert([activityData])
            .select();
        
        if (error) {
            throw error;
        }
        
        // Success message
        messageDiv.innerHTML = `
            <div style="background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; border: 1px solid #c3e6cb;">
                ✅ Activity added successfully! 
                <a href="../index.html" style="color: #155724; text-decoration: underline;">View Dashboard</a> 
                or 
                <a href="add.html" style="color: #155724; text-decoration: underline;">Add Another</a>
            </div>
        `;
        
        // Reset form
        this.reset();
        
        // Reset to today's date
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
        
    } catch (error) {
        console.error('Error adding activity:', error);
        messageDiv.innerHTML = `
            <div style="background: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; border: 1px solid #f5c6cb;">
                ❌ Error adding activity: ${error.message}
            </div>
        `;
    } finally {
        // Reset button state
        submitButton.textContent = 'Add Activity';
        submitButton.disabled = false;
    }
});
