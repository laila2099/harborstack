// setup
require('dotenv').config();
const express = require('express');
const { crews, shifts } = require('./data.js');

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());

// custom logger
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
    next();
});


// =======================
// UTIL: response handler
// =======================
function isHTML(req) {
    const accept = req.headers.accept;
    return accept && accept.includes('text/html');
}
app.get('/', (req, res) => {
    res.send(`
        <h1>HarborStack API ⚓ </h1>
        <p>Server is running successfully 🚀</p>
        <ul>
            <li><a href="/api/v1/crews">Crews</a></li>
            <li><a href="/api/v1/shifts">Shifts</a></li>
        </ul>
    `);
});

// =======================
// CREWS CRUD
// =======================
// i added simple html just for having a nice ui not a raw data if i open it in the localhost
// GET ALL
app.get('/api/v1/crews', (req, res) => {
    if (isHTML(req)) {
        let html = "<h1>Crews List ⚓ </h1>";

        crews.forEach(c => {
            html += `
                <div style="padding:10px;margin:10px;border:1px solid #ccc;border-radius:8px">
                    <h3>${c.name}</h3>
                    <p><b>Role:</b> ${c.role}</p>
                    <p><b>Active:</b> ${c.active}</p>
                </div>
            `;
        });

        return res.send(html);
    }

    res.json({
        success: true,
        count: crews.length,
        data: crews
    });
});


// GET ONE
app.get('/api/v1/crews/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const crew = crews.find(c => c.id === id);

    if (!crew) return res.status(404).json({ error: "Crew not found" });

    if (isHTML(req)) {
        return res.send(`
            <h1>${crew.name}</h1>
            <p>Role: ${crew.role}</p>
            <p>Active: ${crew.active}</p>
        `);
    }

    res.json(crew);
});


// POST
app.post('/api/v1/crews', (req, res) => {
    const { name, role, active } = req.body;

    if (!name || !role) {
        return res.status(400).json({ error: "name and role are required" });
    }

    const newId = crews.length ? Math.max(...crews.map(c => c.id)) + 1 : 1;

    const newCrew = {
        id: newId,
        name,
        role,
        active: active !== undefined ? active : true
    };

    crews.push(newCrew);

    if (isHTML(req)) {
        return res.send(`<h2>Created: ${newCrew.name}</h2>`);
    }

    res.status(201).json(newCrew);
});


// PUT
app.put('/api/v1/crews/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = crews.findIndex(c => c.id === id);

    if (index === -1) return res.status(404).json({ error: "Crew not found" });

    crews[index] = { ...crews[index], ...req.body };

    if (isHTML(req)) {
        return res.send(`<h2>Updated Crew: ${crews[index].name}</h2>`);
    }

    res.json(crews[index]);
});


// DELETE
app.delete('/api/v1/crews/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = crews.findIndex(c => c.id === id);

    if (index === -1) return res.status(404).json({ error: "Crew not found" });

    const deleted = crews.splice(index, 1);

    if (isHTML(req)) {
        return res.send(`<h2>Deleted: ${deleted[0].name}</h2>`);
    }

    res.json({ message: "Deleted successfully" });
});


// =======================
// SHIFTS CRUD
// =======================

// GET ALL
app.get('/api/v1/shifts', (req, res) => {

    if (isHTML(req)) {
        let html = "<h1>Shifts List 🚢 </h1>";

        shifts.forEach(s => {
            html += `
                <div style="padding:10px;margin:10px;border:1px solid #ccc;border-radius:8px">
                    <p><b>Crew ID:</b> ${s.crewId}</p>
                    <p><b>Berth:</b> ${s.berth}</p>
                    <p><b>Start:</b> ${s.startsAt}</p>
                    <p><b>End:</b> ${s.endsAt}</p>
                </div>
            `;
        });

        return res.send(html);
    }

    res.json({
        success: true,
        count: shifts.length,
        data: shifts
    });
});


// GET ONE
app.get('/api/v1/shifts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const shift = shifts.find(s => s.id === id);

    if (!shift) return res.status(404).json({ error: "Shift not found" });

    if (isHTML(req)) {
        return res.send(`
            <h1>Shift ${shift.id}</h1>
            <p>Crew: ${shift.crewId}</p>
            <p>Berth: ${shift.berth}</p>
        `);
    }

    res.json(shift);
});


// POST
app.post('/api/v1/shifts', (req, res) => {
    const { crewId, berth, startsAt, endsAt } = req.body;

    if (!crewId || !berth || !startsAt || !endsAt) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const crewExists = crews.some(c => c.id === crewId);
    if (!crewExists) {
        return res.status(400).json({ error: "Invalid crewId" });
    }

    const newId = shifts.length ? Math.max(...shifts.map(s => s.id)) + 1 : 1;

    const newShift = {
        id: newId,
        crewId,
        berth,
        startsAt,
        endsAt
    };

    shifts.push(newShift);

    if (isHTML(req)) {
        return res.send(`<h2>Shift Created for crew ${crewId}</h2>`);
    }

    res.status(201).json(newShift);
});


// PUT
app.put('/api/v1/shifts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = shifts.findIndex(s => s.id === id);

    if (index === -1) return res.status(404).json({ error: "Shift not found" });

    shifts[index] = { ...shifts[index], ...req.body };

    if (isHTML(req)) {
        return res.send(`<h2>Shift Updated</h2>`);
    }

    res.json(shifts[index]);
});


// DELETE
app.delete('/api/v1/shifts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = shifts.findIndex(s => s.id === id);

    if (index === -1) return res.status(404).json({ error: "Shift not found" });

    shifts.splice(index, 1);

    if (isHTML(req)) {
        return res.send(`<h2>Shift Deleted</h2>`);
    }

    res.json({ message: "Deleted successfully" });
});


// run server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});