// Function to calculate Julian Date
function getJulianDate(date) {
    return date / 86400000 + 2440587.5;
}

// Function to calculate Julian Centuries since J2000.0
function getJulianCenturies(jd) {
    return (jd - 2451545.0) / 36525.0;
}

// Kepler's Equation Solver
function solveKepler(M, e) {
    let E = M;
    for (let i = 0; i < 10; i++) {
        E = M + e * Math.sin(E);
    }
    return E;
}

// Degrees to Radians
function deg2rad(degrees) {
    return degrees * (Math.PI / 180);
}

// Radians to Degrees
function rad2deg(radians) {
    return radians * (180 / Math.PI);
}

// Planetary Data
const planets = [
    {
        name: 'Mercury',
        a: [0.38709927, 0.00000037],
        e: [0.20563593, 0.00001906],
        I: [7.00497902, -0.00594749],
        L: [252.25032350, 149472.67411175],
        longPeri: [77.45779628, 0.16047689],
        longNode: [48.33076593, -0.12534081],
        color: 0xaaaaaa
    },
    {
        name: 'Venus',
        a: [0.72333566, 0.00000390],
        e: [0.00677672, -0.00004107],
        I: [3.39467605, -0.00078890],
        L: [ 181.97909950, 58517.81538729],
        longPeri: [131.60246718, 0.00268329],
        longNode: [76.67984255, -0.27769418],
        color: 0xaaaaaa
    },
    {
        name: 'Mercury',
        a: [0.38709927, 0.00000037],
        e: [0.20563593, 0.00001906],
        I: [7.00497902, -0.00594749],
        L: [252.25032350, 149472.67411175],
        longPeri: [77.45779628, 0.16047689],
        longNode: [48.33076593, -0.12534081],
        color: 0xaaaaaa
    },
    {
        name: 'Mercury',
        a: [0.38709927, 0.00000037],
        e: [0.20563593, 0.00001906],
        I: [7.00497902, -0.00594749],
        L: [252.25032350, 149472.67411175],
        longPeri: [77.45779628, 0.16047689],
        longNode: [48.33076593, -0.12534081],
        color: 0xaaaaaa
    },
    {
        name: 'Mercury',
        a: [0.38709927, 0.00000037],
        e: [0.20563593, 0.00001906],
        I: [7.00497902, -0.00594749],
        L: [252.25032350, 149472.67411175],
        longPeri: [77.45779628, 0.16047689],
        longNode: [48.33076593, -0.12534081],
        color: 0xaaaaaa
    },

    // 
];