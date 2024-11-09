// JavaScript for Hoops Game pagination for Announcements

let announcements = []; // Array to hold announcements
let currentPage = 0;
const pageSize = 5;

// Function to update the displayed announcements
function updateAnnouncements() {
    const start = currentPage * pageSize;
    const end = start + pageSize;
    const visibleAnnouncements = announcements.slice(start, end);

    const announcerDiv = document.getElementById('Announcer');
    announcerDiv.innerHTML = ''; // Clear current announcements

    visibleAnnouncements.forEach(announcement => {
        const p = document.createElement('p');
        p.innerHTML = announcement;
        announcerDiv.appendChild(p);
    });

    // Enable or disable pagination buttons based on current page
    document.getElementById('prevPage').disabled = currentPage === 0;
    document.getElementById('nextPage').disabled = (currentPage + 1) * pageSize >= announcements.length;
}

// Function to add a new announcement
function addAnnouncement(text) {
    announcements.unshift(text); // Add the new announcement at the beginning
    updateAnnouncements();
}

// Event listeners for pagination buttons
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        updateAnnouncements();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    if ((currentPage + 1) * pageSize < announcements.length) {
        currentPage++;
        updateAnnouncements();
    }
});

// Example usage: Add an announcement to test the pagination
addAnnouncement('Welcome to the Hoops Game!');
addAnnouncement('Player 1 scores a 3-pointer!');
addAnnouncement('Player 2 makes a great pass!');
addAnnouncement('Player 3 blocks the shot!');
addAnnouncement('Player 4 steals the ball!');
addAnnouncement('Player 5 scores a layup!');
