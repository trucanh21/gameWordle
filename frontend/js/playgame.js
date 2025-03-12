import { ENDPOINTS } from './config.js';

document.addEventListener("DOMContentLoaded", async function () {
    // ... existing code ...

    // Lấy từ bí mật từ backend
    async function fetchSecretWord() {
        const response = await fetch(ENDPOINTS.WORD_OF_DAY);
        const data = await response.json();
        secretWord = data.word;
    }

    // Kiểm tra nickname
    async function checkNickname(nickname) {
        const response = await fetch(ENDPOINTS.CHECK_NICKNAME, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nickname })
        });
        return response.json();
    }

    // Lưu kết quả
    async function saveResult(nickname, guesses) {
        const response = await fetch(ENDPOINTS.SAVE_RESULT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nickname, guesses })
        });
        return response.json();
    }

    // ... rest of the code stays the same ...
}); 