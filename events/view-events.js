// Load and display all events
async function loadAllEvents() {
    const container = document.getElementById('events-container');
    
    const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });
    
    if (error) {
        container.innerHTML = '<div class="error">Error loading events: ' + error.message + '</div>';
        return;
    }
    
    if (!events || events.length === 0) {
        container.innerHTML = `
            <div class="no-events">
                No events found. 
                <a href="add.html">Add your first event!</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = events.map(event => `
        <div class="activity-card">
            <div class="activity-header">
                <h3>${event.event}</h3>
                <span class="date-badge">${event.date || event.weekday}</span>
            </div>
            <p><strong>Time:</strong> ${event.time} | <strong>Venue:</strong> ${event.venue}</p>
            <p><strong>PAX:</strong> ${event.pax}</p>
            ${event.work_description ? `<p><strong>Description:</strong> ${event.work_description}</p>` : ''}
            ${event.misc_items && event.misc_items.length > 0 ? `
                <p><strong>Items Needed:</strong> ${event.misc_items.join(', ')}</p>
            ` : ''}
        </div>
    `).join('');
}

// Load events when page loads
document.addEventListener('DOMContentLoaded', loadAllEvents);
