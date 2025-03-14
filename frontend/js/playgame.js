document.addEventListener("DOMContentLoaded", async function () {
    // Kiểm tra xem có nickname không
    const playerNickname = localStorage.getItem('playerNickname');
    if (!playerNickname) {
        alert('Please enter your nickname first!');
        window.location.href = 'index.html';
        return;
    }

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
        secretWord = data.word;
        console.log("Secret word:", secretWord);
    }
    await fetchSecretWord();

    // Hàm lưu kết quả với nickname đã lưu
    async function saveResult(guesses) {
        try {
            const response = await fetch("http://localhost:3000/save-result", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nickname: playerNickname,
                    guesses: currentRow + 1,
                    word: secretWord
                }),
            });

            const data = await response.json();
            if (data.success) {
                // Lưu từ đã đoán và đánh dấu thắng
                localStorage.setItem('winningWord', secretWord);
                localStorage.setItem('gameWon', 'true');
                // Xóa nickname sau khi lưu kết quả
                localStorage.removeItem('playerNickname');
                window.location.href = "index.html";
            } else {
                alert("Error saving your score. Please try again.");
            }
        } catch (error) {
            console.error("Error saving result:", error);
            alert("Error saving your score. Please try again.");
        }
    }

    keys.forEach((key) => {
        key.addEventListener("click", () => {
            const letter = key.innerText;
            if (letter === 'ENTER') {
                checkLetter();
            } else if (letter === "DELETE") {
                deleteLetter();
            } else {
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

        const apiUrl = `http://localhost:3000/check/${word}`;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (!data.valid) {
                alert("Từ không hợp lệ, thử lại! ❌");
                return;
            }

            let correctCount = 0;
            let secretWordArr = secretWord.split("");

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

                if (box.style.backgroundColor === "lightgreen") continue;

                if (secretWordArr.includes(letter)) {
                    box.style.backgroundColor = "#FF9B9B";
                    secretWordArr[secretWordArr.indexOf(letter)] = null;
                } else {
                    box.style.backgroundColor = "#FFD6A5";
                }
            }

            if (correctCount === maxCols) {
                await saveResult(currentRow + 1);
            } else {
                currentRow++;
                currentCol = 0;

                if (currentRow >= rows.length) {
                    alert(`Bạn đã thua! Từ đúng là: ${secretWord}`);
                    localStorage.removeItem('playerNickname');
                    window.location.href = "index.html";
                }
            }

        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    }
});
