document.addEventListener("DOMContentLoaded", function () {
    const howToPlayBox = document.getElementById("Howtoplay");
    const btnHowToPlay = document.querySelector(".btn_howtoplay");
    const btnClose = document.querySelector(".close");
    const showResult = document.getElementById("showResult");
    const btnPlayGame = document.querySelector(".btn_playgame"); // Nút Play trong #container
    const btnRankings = document.querySelector(".btn_rankings");
    const btnHome = document.querySelector(".btn_home");
    const container = document.getElementById("container");
    const nicknameModal = document.getElementById('nicknameModal');
    const startGameBtn = document.querySelector('.start-game');
    const nicknameInput = document.getElementById('nicknameInput');
    const winningWordElement = document.getElementById('winningWord');

    // Kiểm tra nếu game đã thắng
    if (localStorage.getItem("gameWon") === "true") {
        container.classList.add("hidden");
        showResult.classList.remove("hidden");
        showResult.style.display = "flex";
        
        // Hiển thị từ đã đoán
        const winningWord = localStorage.getItem('winningWord');
        if (winningWord) {
            winningWordElement.textContent = winningWord;
        }
        
        // Xóa dữ liệu khỏi localStorage
        localStorage.removeItem("gameWon");
        localStorage.removeItem("winningWord");
    }

    // Xử lý nút "Main menu"
    btnHome.addEventListener("click", function () {
        window.location.href = "index.html";
    });

    // Khi nhấn nút "How to play", hiển thị hộp thoại
    btnHowToPlay.addEventListener("click", function () {
        howToPlayBox.classList.remove("hidden");
        container.classList.add("hidden");
    });

    // Khi nhấn vào nút đóng, ẩn hộp thoại
    btnClose.addEventListener("click", function () {
        howToPlayBox.classList.add("hidden");
        container.classList.remove("hidden");
    });

    // Khi nhấn vào "Play Game" ở #container, chuyển đến playgame.html
    btnPlayGame.addEventListener("click", function () {
        nicknameModal.classList.remove('hidden');
    });

    // Xử lý nút View Rankings
    btnRankings.addEventListener("click", function () {
        window.location.href = "result.html";
    });

    // Khi nhấn ra ngoài hộp thoại, ẩn nó đi
    window.addEventListener("click", function (event) {
        if (event.target === howToPlayBox) {
            howToPlayBox.classList.add("hidden");
            container.classList.remove("hidden");
        }
    });

    // Kiểm tra nickname và xử lý bắt đầu game
    async function handleStartGame(nickname) {
        try {
            const response = await fetch("http://localhost:3000/check-nickname", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nickname }),
            });

            const data = await response.json();

            if (!data.canPlay) {
                alert("You have already played today. Come back tomorrow!");
                return;
            }

            if (data.exists) {
                alert(data.message);
            }

            localStorage.setItem('playerNickname', nickname);
            window.location.href = 'playgame.html';
        } catch (error) {
            console.error("Error checking nickname:", error);
            alert("Error checking nickname. Please try again.");
        }
    }

    startGameBtn.addEventListener('click', () => {
        const nickname = nicknameInput.value.trim();
        if (nickname) {
            handleStartGame(nickname);
        } else {
            alert('Please enter your nickname!');
        }
    });

    nicknameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            startGameBtn.click();
        }
    });

    nicknameModal.addEventListener('click', (e) => {
        if (e.target === nicknameModal) {
            nicknameModal.classList.add('hidden');
        }
    });
});
