document.addEventListener("DOMContentLoaded", function () {
    const howToPlayBox = document.getElementById("Howtoplay");
    const btnHowToPlay = document.querySelector(".btn_howtoplay");
    const btnClose = document.querySelector(".close");

    // Khi nhấn nút "How to play", hiển thị hộp thoại
    btnHowToPlay.addEventListener("click", function () {
        document.getElementById('Howtoplay').classList.remove('hidden');
        document.getElementById('container').classList.add('hidden');
    });

    // Khi nhấn vào nút đóng, ẩn hộp thoại
    btnClose.addEventListener("click", function () {
        howToPlayBox.classList.add("hidden");
        document.getElementById('container').classList.remove('hidden');
    });

    // Khi nhấn ra ngoài hộp thoại, ẩn nó đi
    window.addEventListener("click", function (event) {
        if (event.target === howToPlayBox) {
            howToPlayBox.classList.add("hidden");
            document.getElementById('container').classList.remove('hidden');
        }
    });
});
