document.addEventListener('DOMContentLoaded', () => {
    // JavaScript for Hoops Game pagination for Announcements and Team Table Population

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
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');

    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
            if (currentPage > 0) {
                currentPage--;
                updateAnnouncements();
            }
        });

        nextButton.addEventListener('click', () => {
            if ((currentPage + 1) * pageSize < announcements.length) {
                currentPage++;
                updateAnnouncements();
            }
        });
    } else {
        console.error("Pagination buttons not found in the DOM.");
    }

    // Function to update team tables
    function updateTeamTables(players, teamIdPrefix) {
        players.forEach((player, index) => {
            const playerIndex = index + 1;
            console.log(`Updating ${teamIdPrefix}${playerIndex} with player ${player.name}`); // Debug statement

            const nameElement = document.getElementById(`${teamIdPrefix}${playerIndex}Name`);
            if (!nameElement) {
                console.error(`Element with ID ${teamIdPrefix}${playerIndex}Name not found.`);
                return;
            }
            nameElement.innerText = player.name;
            document.getElementById(`${teamIdPrefix}${playerIndex}Nbr`).innerText = player.jerseyNumber;
            document.getElementById(`${teamIdPrefix}${playerIndex}Pos`).innerText = player.position;
            document.getElementById(`${teamIdPrefix}${playerIndex}Shot`).innerText = player.shotRate;
            document.getElementById(`${teamIdPrefix}${playerIndex}Def`).innerText = player.defenseRate;
            document.getElementById(`${teamIdPrefix}${playerIndex}Fg`).innerText = `${player.fgm}/${player.fga}`;
            document.getElementById(`${teamIdPrefix}${playerIndex}Tp`).innerText = `${player.tpm}/${player.tpa}`;
            document.getElementById(`${teamIdPrefix}${playerIndex}Ast`).innerText = player.assists;
            document.getElementById(`${teamIdPrefix}${playerIndex}Reb`).innerText = player.rebounds;
            document.getElementById(`${teamIdPrefix}${playerIndex}Blk`).innerText = player.blocks;
            document.getElementById(`${teamIdPrefix}${playerIndex}Steals`).innerText = player.steals;
            document.getElementById(`${teamIdPrefix}${playerIndex}Pts`).innerText = player.points;
        });
    }

    // Example players data for Home and Visitor teams
    const homePlayers = [
        { name: 'Bill', jerseyNumber: 1, position: 'G', shotRate: 80, defenseRate: 1, fgm: 0, fga: 0, tpm: 0, tpa: 0, assists: 0, rebounds: 0, blocks: 0, steals: 0, points: 0 },
        { name: 'Bob', jerseyNumber: 2, position: 'G/F', shotRate: 70, defenseRate: 2, fgm: 0, fga: 0, tpm: 0, tpa: 0, assists: 0, rebounds: 0, blocks: 0, steals: 0, points: 0 },
        { name: 'Ben', jerseyNumber: 3, position: 'F', shotRate: 65, defenseRate: 3, fgm: 0, fga: 0, tpm: 0, tpa: 0, assists: 0, rebounds: 0, blocks: 0, steals: 0, points: 0 },
        { name: 'Brad', jerseyNumber: 4, position: 'F/C', shotRate: 60, defenseRate: 4, fgm: 0, fga: 0, tpm: 0, tpa: 0, assists: 0, rebounds: 0, blocks: 0, steals: 0, points: 0 },
        { name: 'Bjorn', jerseyNumber: 5, position: 'C', shotRate: 75, defenseRate: 5, fgm: 0, fga: 0, tpm: 0, tpa: 0, assists: 0, rebounds: 0, blocks: 0, steals: 0, points: 0 }
    ];

    const visitorPlayers = [
        { name: 'Timmy', jerseyNumber: 6, position: 'G', shotRate: 75, defenseRate: 2, fgm: 0, fga: 0, tpm: 0, tpa: 0, assists: 0, rebounds: 0, blocks: 0, steals: 0, points: 0 },
        { name: 'Tommy', jerseyNumber: 7, position: 'G', shotRate: 75, defenseRate: 2, fgm: 0, fga: 0, tpm: 0, tpa: 0, assists: 0, rebounds: 0, blocks: 0, steals: 0, points: 0 },
        { name: 'Jimmy', jerseyNumber: 8, position: 'F', shotRate: 60, defenseRate: -4, fgm: 0, fga: 0, tpm: 0, tpa: 0, assists: 0, rebounds: 0, blocks: 0, steals: 0, points: 0 },
        { name: 'Johnny', jerseyNumber: 9, position: 'F/C', shotRate: 65, defenseRate: -4, fgm: 0, fga: 0, tpm: 0, tpa: 0, assists: 0, rebounds: 0, blocks: 0, steals: 0, points: 0 },
        { name: 'Hobie', jerseyNumber: 10, position: 'F/C', shotRate: 50, defenseRate: -8, fgm: 0, fga: 0, tpm: 0, tpa: 0, assists: 0, rebounds: 0, blocks: 0, steals: 0, points: 0 }
    ];

    // Initial population of team tables
    updateTeamTables(homePlayers, 'H');
    updateTeamTables(visitorPlayers, 'V');

    // Example usage: Add an announcement to test the pagination
    addAnnouncement('Welcome to the Hoops Game!');
    addAnnouncement('Player 1 scores a 3-pointer!');
    addAnnouncement('Player 2 makes a great pass!');
    addAnnouncement('Player 3 blocks the shot!');
    addAnnouncement('Player 4 steals the ball!');
    addAnnouncement('Player 5 scores a layup!');
});
