// Load today's activities
async function loadTodaysActivities() {
    const today = new Date().toISOString().split('T')[0];
    
    const { data: activities, error } = await supabase
        .from('events')
        .select('*')
        .eq('date', today)
        .order('time', { ascending: true });
    
    const container = document.getElementById('today-activities');
    
    if (error) {
        container.innerHTML = '<div class="error">Error loading activities</div>';
        console.error('Error:', error);
        return;
    }
    
    if (activities.length === 0) {
        container.innerHTML = '<div class="no-events">No activities scheduled for today.</div>';
    } else {
        container.innerHTML = activities.map(activity => `
            <div class="activity-card">
                <h3>${activity.event}</h3>
                <p><strong>Time:</strong> ${activity.time}</p>
                <p><strong>Venue:</strong> ${activity.venue}</p>
                <p><strong>PAX:</strong> ${activity.pax}</p>
                ${activity.work_description ? `<p><strong>Description:</strong> ${activity.work_description}</p>` : ''}
            </div>
        `).join('');
    }
}

// Load all upcoming events
async function loadAllActivities() {
    const { data: activities, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });
    
    const container = document.getElementById('all-activities');
    
    if (error) {
        container.innerHTML = '<div class="error">Error loading activities</div>';
        console.error('Error:', error);
        return;
    }
    
    if (activities.length === 0) {
        container.innerHTML = '<div class="no-events">No activities found. <a href="events/add.html">Add your first activity!</a></div>';
    } else {
        container.innerHTML = activities.map(activity => `
            <div class="activity-card">
                <div class="activity-header">
                    <h3>${activity.event}</h3>
                    <span class="date-badge">${activity.date || activity.weekday}</span>
                </div>
                <p><strong>Time:</strong> ${activity.time} | <strong>Venue:</strong> ${activity.venue} | <strong>PAX:</strong> ${activity.pax}</p>
                ${activity.work_description ? `<p>${activity.work_description}</p>` : ''}
            </div>
        `).join('');
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadTodaysActivities();
    loadAllActivities();
});
