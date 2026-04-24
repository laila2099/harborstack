const crews = [
    { id: 1, name: "Amina Rahal", role: "Dock Supervisor", active: true },
    { id: 2, name: "Jonas Vik", role: "Crane Operator", active: true },
    { id: 3, name: "Mei Chen", role: "Safety Officer", active: false }
];

const shifts = [
    { id: 1, crewId: 2, berth: "B-12", startsAt: "2026-06-05T06:00:00.000Z", endsAt: "2026-06-05T14:00:00.000Z" },
    { id: 2, crewId: 1, berth: "A-04", startsAt: "2026-06-05T14:00:00.000Z", endsAt: "2026-06-05T22:00:00.000Z" },
    { id: 3, crewId: 3, berth: "C-01", startsAt: "2026-06-06T06:00:00.000Z", endsAt: "2026-06-06T14:00:00.000Z" }
];

module.exports = { crews, shifts };