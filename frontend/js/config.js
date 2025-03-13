const API_URL = 'https://your-render-app.onrender.com/api';

const ENDPOINTS = {
    WORD_OF_DAY: `${API_URL}/word-of-the-day`,
    CHECK_WORD: (word) => `${API_URL}/check/${word}`,
    CHECK_NICKNAME: `${API_URL}/check-nickname`,
    SAVE_RESULT: `${API_URL}/save-result`,
    LEADERBOARD: `${API_URL}/leaderboard`
};

export default ENDPOINTS; 