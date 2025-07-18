const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors());

// Токен для Clash of Clans API / Clash of Clans API token
require('dotenv').config();
const TOKEN = process.env.TOKEN; // 🔑 заміни своїм токеном

// Отримати дані гравця / Get player data
app.get('/api/player/:tag', async (req, res) => {
    const tag = encodeURIComponent('#' + req.params.tag);
    try {
        // Запит до Clash of Clans API / Request to Clash of Clans API
        const response = await axios.get(`https://api.clashofclans.com/v1/players/${tag}`, {
            headers: {
                Authorization: `Bearer ${TOKEN}`
            }
        });
        res.json(response.data);
    } catch (error) {
        // Обробка помилки / Error handling
        console.error('Помилка гравця:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ error: 'Не вдалося отримати гравця' });
    }
});

// Отримати дані клану / Get clan data
app.get('/api/clan/:tag', async (req, res) => {
    const tag = encodeURIComponent('#' + req.params.tag);
    try {
        // Запит до Clash of Clans API / Request to Clash of Clans API
        const response = await axios.get(`https://api.clashofclans.com/v1/clans/${tag}`, {
            headers: {
                Authorization: `Bearer ${TOKEN}`
            }
        });
        res.json(response.data);
    } catch (error) {
        // Обробка помилки / Error handling
        console.error('Помилка клану:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ error: 'Не вдалося отримати клан' });
    }
});

// Отримати учасників клану / Get clan members
app.get('/api/clan/:tag/members', async (req, res) => {
    const tag = encodeURIComponent('#' + req.params.tag);
    try {
        // Запит до Clash of Clans API для учасників / Request to Clash of Clans API for members
        const response = await axios.get(`https://api.clashofclans.com/v1/clans/${tag}/members`, {
            headers: {
                Authorization: `Bearer ${TOKEN}`
            }
        });
        res.json(response.data.items); // тільки список / only the list
    } catch (err) {
        // Обробка помилки / Error handling
        res.status(500).json({ error: 'Не вдалося отримати учасників' });
    }
});

// Отримати поточну війну клану / Get current clan war
app.get('/api/clan/:tag/currentwar', async (req, res) => {
    const tag = encodeURIComponent('#' + req.params.tag);
    try {
        // Запит до Clash of Clans API / Request to Clash of Clans API
        const response = await axios.get(`https://api.clashofclans.com/v1/clans/${tag}/currentwar`, {
            headers: {
                Authorization: `Bearer ${TOKEN}`
            }
        });
        res.json(response.data);
    } catch (err) {
        // Обробка помилки / Error handling
        res.status(500).json({ error: 'Не вдалося отримати дані війни' });
    }
});

// Отримати інформацію про Лігу Війн Кланів / Get Clan War League info
app.get('/api/clan/:tag/currentwarleaguegroup', async (req, res) => {
    const tag = encodeURIComponent('#' + req.params.tag);
    try {
        // Запит до Clash of Clans API / Request to Clash of Clans API
        const response = await axios.get(`https://api.clashofclans.com/v1/clans/${tag}/currentwar/leaguegroup`, {
            headers: {
                Authorization: `Bearer ${TOKEN}`
            }
        });
        res.json(response.data);
    } catch (err) {
        // Обробка помилки / Error handling
        res.status(500).json({ error: 'Не вдалося отримати дані ЛВК' });
    }
});
// List of locations / Список локацій
app.get('/api/locations', async (req, res) => {
    const tag = encodeURIComponent('#' + req.params.tag);
    try {
        // Запит до Clash of Clans API / Request to Clash of Clans API
        const response = await axios.get(`https://api.clashofclans.com/v1/locations/${tag}`, {
            headers: {
                Authorization: `Bearer ${TOKEN}`
            }
        });
        res.json(response.data);
    } catch (err) {
        // Обробка помилки / Error handling
        res.status(500).json({ error: 'Не вдалося отримати дані about leagues' });
    }
});
// Top players / Топ гравців
app.get('/api/rankings/players/:locationId', async (req, res) => {
    const { locationId } = req.params;
    try {
        const response = await axios.get(`https://api.clashofclans.com/v1/locations/${locationId}/rankings/players`, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
        res.json(response.data.items);
    } catch (error) {
        res.status(500).json({ error: 'Не вдалося отримати рейтинг гравців' });
    }
});

// Top clans / Топ кланів
app.get('/api/rankings/clans/:locationId', async (req, res) => {
    const { locationId } = req.params;
    try {
        const response = await axios.get(`https://api.clashofclans.com/v1/locations/${locationId}/rankings/clans`, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
        res.json(response.data.items);
    } catch (error) {
        res.status(500).json({ error: 'Не вдалося отримати рейтинг кланів' });
    }
});
// Global top players / Глобальний топ гравців
app.get('/api/rankings/players/global', async (req, res) => {
    try {
        const response = await axios.get(`https://api.clashofclans.com/v1/locations/0/rankings/players`, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
        res.json(response.data.items);
    } catch (error) {
        res.status(500).json({ error: 'Не вдалося отримати глобальний рейтинг гравців' });
    }
});

// Global top clans / Глобальний топ кланів
app.get('/api/rankings/clans/global', async (req, res) => {
    try {
        const response = await axios.get(`https://api.clashofclans.com/v1/locations/0/rankings/clans`, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
        res.json(response.data.items);
    } catch (error) {
        res.status(500).json({ error: 'Не вдалося отримати глобальний рейтинг кланів' });
    }
});
app.get('/api/clanwarleagues/wars/:warTag', async (req, res) => {
    const warTag = encodeURIComponent('#' + req.params.warTag);
    try {
        const response = await axios.get(`https://api.clashofclans.com/v1/clanwarleagues/wars/${warTag}`, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
        res.json(response.data); // НЕ .items
    } catch (error) {
        console.error('❌ Помилка CWL війни:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ error: 'Не вдалося отримати CWL війну' });
    }
});


// Запуск сервера / Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server works at http://localhost:${PORT}`);
});
