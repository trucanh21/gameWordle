document.addEventListener("DOMContentLoaded", function () {
    const howToPlayBox = document.getElementById("Howtoplay");
    const btnHowToPlay = document.querySelector(".btn_howtoplay");
    const btnClose = document.querySelector(".close");
    const showResult = document.getElementById("showResult");
    const btnPlayGame = document.querySelector(".btn_playgame"); // Nút Play trong #container
    const btnPlayGameResult = document.querySelector("#showResult .btn_playgame"); // Nút Play trong #showResult
    const btnHome = document.querySelector(".btn_home");
    const container = document.getElementById("container");

    // Kiểm tra nếu game đã thắng
    if (localStorage.getItem("gameWon") === "true") {
        container.classList.add("hidden");
        showResult.classList.remove("hidden");
        showResult.style.display = "flex";
        localStorage.removeItem("gameWon");
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
        window.location.href = "playgame.html";
    });

    // Khi nhấn vào "Play Game" trong #showResult, chuyển đến playgame.html
    btnPlayGameResult.addEventListener("click", function () {
        window.location.href = "playgame.html";
    });

    // Khi nhấn ra ngoài hộp thoại, ẩn nó đi
    window.addEventListener("click", function (event) {
        if (event.target === howToPlayBox) {
            howToPlayBox.classList.add("hidden");
            container.classList.remove("hidden");
        }
    });
});
