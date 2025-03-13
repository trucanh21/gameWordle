import ENDPOINTS from './config.js';

document.addEventListener("DOMContentLoaded", async function () {
    // ... existing code ...

    // Lấy từ bí mật từ backend
    async function fetchSecretWord() {
        try {
            const response = await fetch(ENDPOINTS.WORD_OF_DAY);
            const data = await response.json();
            secretWord = data.word;
        } catch (error) {
            console.error("Error fetching word:", error);
            alert("Error connecting to server. Please try again later.");
        }
    }

    // Kiểm tra từ
    async function checkWord(word) {
        try {
            const response = await fetch(ENDPOINTS.CHECK_WORD(word));
            const data = await response.json();
            return data.valid;
        } catch (error) {
            console.error("Error checking word:", error);
            return false;
        }
    }

    // Lưu kết quả
    async function saveResult(guesses) {
        try {
            const response = await fetch(ENDPOINTS.SAVE_RESULT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nickname: playerNickname,
                    guesses: guesses
                })
            });
            return await response.json();
        } catch (error) {
            console.error("Error saving result:", error);
            return { success: false };
        }
    }

    // ... rest of the code ...
}); 