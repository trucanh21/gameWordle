const express = require("express");
const cors = require("cors");
const app = express();
const words = require("./words.json");

app.use(cors());

let secretWord = getRandomWord(); // Chọn từ bí mật ngay khi khởi động server

function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.words.length);
    return words.words[randomIndex].toUpperCase(); // Viết hoa để dễ so sánh
}

// Gửi từ bí mật mỗi ngày
app.get("/word-of-the-day", (req, res) => {
    res.json({ word: secretWord });
});

// Kiểm tra từ nhập vào có hợp lệ không
app.get("/check/:word", (req, res) => {
    const word = req.params.word.toLowerCase();
    if (words.words.includes(word)) {
        res.json({ valid: true });
    } else {
        res.json({ valid: false });
    }
});

app.listen(3000, () => console.log("✅ Server chạy tại http://localhost:3000"));