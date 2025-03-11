document.addEventListener("DOMContentLoaded", async function () {
    let currentRow = 0;
    let currentCol = 0;
    const maxCols = 5;
    const rows = document.querySelectorAll('.row');
    const keys = document.querySelectorAll('.key');
    let secretWord = "";

    // Lấy từ bí mật từ backend
    async function fetchSecretWord() {
        const response = await fetch("http://localhost:3000/word-of-the-day");
        const data = await response.json();
        secretWord = data.word; // Lưu từ bí mật
        console.log("Secret word:", secretWord); // Debug
    }
    await fetchSecretWord(); // Gọi API khi tải trang

    keys.forEach((key) => {
        key.addEventListener("click", () => {
            const letter = key.innerText;
            if(letter === 'ENTER'){
                checkLetter();
            }else if(letter === "DELETE"){
                deleteLetter();
            }else {
                addLetter(letter);
            }
        });
    });

    document.addEventListener("keydown", (event) => {
        const key = event.key.toUpperCase();
        const button = Array.from(document.querySelectorAll('.key')).find(btn => btn.innerText === key);
        if (button) {
            button.classList.add("active");
            button.click();
        }
    });

    document.addEventListener("keyup", (event) => {
        const key = event.key.toUpperCase();
        const button = Array.from(document.querySelectorAll('.key')).find(btn => btn.innerText === key);
        if (button) {
            button.classList.remove("active");
        }
    });

    function addLetter(letter) {
        if (currentCol < maxCols) {
            const currentBoxes = rows[currentRow].querySelectorAll(".Rectangle");
            currentBoxes[currentCol].innerText = letter;
            currentCol++;
        }
    }

    function deleteLetter() {
        if (currentCol > 0) {
            const currentBoxes = rows[currentRow].querySelectorAll(".Rectangle");
            currentCol--;
            currentBoxes[currentCol].innerText = "";
        }
    }

    async function checkLetter() {
        if (currentCol < maxCols) return;
        const currentBoxes = rows[currentRow].querySelectorAll(".Rectangle");
        
        let word = "";

        currentBoxes.forEach((box) => {
            word += box.innerText;
        });

        // Kiểm tra từ hợp lệ
        const apiUrl = `http://localhost:3000/check/${word}`;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (!data.valid) {
                alert("Từ không hợp lệ, thử lại! ❌");
                console.log(response);
                return;
            }

            // So sánh với từ bí mật
            let correctCount = 0;
            let secretWordArr = secretWord.split(""); // Chuyển thành mảng để đánh dấu

            for (let i = 0; i < maxCols; i++) {
                let letter = word[i];
                let box = currentBoxes[i].parentElement;

                if (letter === secretWord[i]) {
                    box.style.backgroundColor = "lightgreen"; 
                    correctCount++;
                    secretWordArr[i] = null; 
                }
            }

            for (let i = 0; i < maxCols; i++) {
                let letter = word[i];
                let box = currentBoxes[i].parentElement;

                if (box.style.backgroundColor === "lightgreen") continue; // Bỏ qua các ô đã đúng

                if (secretWordArr.includes(letter)) {
                    box.style.backgroundColor = "#FF9B9B"; // 🟨 Đúng chữ, sai vị trí
                    secretWordArr[secretWordArr.indexOf(letter)] = null; // Đánh dấu là đã kiểm tra
                } else {
                    box.style.backgroundColor = "#FFD6A5"; // ⬜ Không có trong từ bí mật
                }
            }

            // Kiểm tra chiến thắng
            if (correctCount === maxCols) {
                localStorage.setItem('gameWon', 'true');
                window.location.href = "index.html"
                console.log("🎉 Win! Bạn đã đoán đúng từ bí mật!");
                alert("🎉 Win! Bạn đã đoán đúng từ bí mật!");
            } else {
                currentRow++;
                currentCol = 0;

                if (currentRow >= rows.length) {
                    alert(`Bạn đã thua! Từ đúng là: ${secretWord}`);
                }
            }

        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    }
});
