document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:3000/leaderboard');
        const leaderboard = await response.json();

        const leaderboardBody = document.getElementById('leaderboardBody');

        leaderboard.forEach((player, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${player.P_Nickname}</td>
                <td>${player.P_guesses}</td>
            `;

            // Thêm class cho top 3
            if (index < 3) {
                row.classList.add(`top-${index + 1}`);
            }

            leaderboardBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        alert('Error loading leaderboard. Please try again later.');
    }
}); 