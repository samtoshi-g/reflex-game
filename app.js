// Reflex - Reaction Time Tester
// Built by Sam @ Clawdbot

const app = document.getElementById('app');
const startBtn = document.getElementById('startBtn');
const retryBtn = document.getElementById('retryBtn');
const retryEarlyBtn = document.getElementById('retryEarlyBtn');
const shareBtn = document.getElementById('shareBtn');

let state = 'ready';
let waitTimeout = null;
let startTime = null;
let attempts = [];
let bestEverMs = localStorage.getItem('reflex_best') ? parseInt(localStorage.getItem('reflex_best')) : null;

// Comparisons for different reaction times
const comparisons = [
    { maxMs: 150, rating: '🏆 Superhuman!', emoji: '⚡', desc: 'Faster than a hummingbird\'s wingbeat. Are you a robot?' },
    { maxMs: 200, rating: '🥇 Lightning Fast', emoji: '🐆', desc: 'Cheetah-level reflexes. You could be a fighter pilot.' },
    { maxMs: 250, rating: '🎯 Excellent', emoji: '🦅', desc: 'Eagle-eye reflexes. Sharper than most humans.' },
    { maxMs: 300, rating: '👍 Above Average', emoji: '🐕', desc: 'Better than the average human (273ms). Nice!' },
    { maxMs: 350, rating: '😊 Average', emoji: '🧑', desc: 'Right around human average. Perfectly normal reflexes.' },
    { maxMs: 450, rating: '🐢 Getting Sleepy?', emoji: '🐢', desc: 'A bit slow. Maybe need some coffee?' },
    { maxMs: 600, rating: '🦥 Sloth Mode', emoji: '🦥', desc: 'Taking it easy today? Try again after a nap.' },
    { maxMs: Infinity, rating: '💤 Did You Fall Asleep?', emoji: '😴', desc: 'We measured that in seconds, not milliseconds...' }
];

function setState(newState) {
    state = newState;
    app.className = `state-${state}`;
}

function getRandomDelay() {
    // Random delay between 2-5 seconds
    return 2000 + Math.random() * 3000;
}

function startTest() {
    setState('waiting');
    
    const delay = getRandomDelay();
    waitTimeout = setTimeout(() => {
        setState('go');
        startTime = performance.now();
    }, delay);
}

function handleWaitingClick() {
    if (state === 'waiting') {
        // Clicked too early!
        clearTimeout(waitTimeout);
        setState('early');
    }
}

function handleGoClick() {
    if (state === 'go') {
        const endTime = performance.now();
        const reactionTime = Math.round(endTime - startTime);
        showResult(reactionTime);
    }
}

function showResult(ms) {
    attempts.push(ms);
    
    // Update best ever
    if (!bestEverMs || ms < bestEverMs) {
        bestEverMs = ms;
        localStorage.setItem('reflex_best', ms);
        // Celebrate new record!
        setTimeout(() => createParticles(), 100);
    }
    
    // Find comparison
    const comparison = comparisons.find(c => ms <= c.maxMs);
    
    // Update UI
    document.getElementById('resultMs').textContent = ms;
    document.getElementById('resultRating').textContent = comparison.rating;
    document.getElementById('resultComparison').textContent = comparison.desc;
    
    // Update bar (scale: 100ms = 100%, 600ms+ = 0%)
    const percentage = Math.max(0, Math.min(100, ((600 - ms) / 500) * 100));
    document.getElementById('barFill').style.width = '100%';
    document.getElementById('barMarker').style.left = `${percentage}%`;
    
    // Update stats
    document.getElementById('attemptNum').textContent = attempts.length;
    document.getElementById('bestEver').textContent = `${bestEverMs}ms`;
    
    const avg = Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length);
    document.getElementById('avgTime').textContent = `${avg}ms`;
    
    setState('result');
}

function createParticles() {
    const emojis = ['⚡', '🎉', '✨', '🏆', '🌟'];
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.top = `${Math.random() * 50}vh`;
            document.body.appendChild(particle);
            
            setTimeout(() => particle.remove(), 1000);
        }, i * 50);
    }
}

function updateBestScoreDisplay() {
    const bestScoreEl = document.getElementById('bestScore');
    if (bestEverMs) {
        bestScoreEl.innerHTML = `Your best: <strong>${bestEverMs}ms</strong>`;
    }
}

function shareResult() {
    const ms = attempts[attempts.length - 1];
    const comparison = comparisons.find(c => ms <= c.maxMs);
    
    const text = `⚡ Reflex Test: ${ms}ms\n${comparison.rating}\n\nTest your reaction time!`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Reflex - Reaction Time Test',
            text: text,
            url: window.location.href
        }).catch(() => {
            // Fallback to clipboard
            copyToClipboard(text);
        });
    } else {
        copyToClipboard(text);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text + '\n' + window.location.href)
        .then(() => {
            const btn = document.getElementById('shareBtn');
            const original = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => btn.textContent = original, 2000);
        })
        .catch(() => {
            alert('Could not copy to clipboard');
        });
}

// Event Listeners
startBtn.addEventListener('click', startTest);
retryBtn.addEventListener('click', () => {
    updateBestScoreDisplay();
    setState('ready');
});
retryEarlyBtn.addEventListener('click', startTest);
shareBtn.addEventListener('click', shareResult);

// Handle clicks on waiting/go screens
document.querySelector('.waiting-screen').addEventListener('click', handleWaitingClick);
document.querySelector('.go-screen').addEventListener('click', handleGoClick);

// Also handle touch events for mobile
document.querySelector('.waiting-screen').addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleWaitingClick();
});
document.querySelector('.go-screen').addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleGoClick();
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (state === 'ready') {
            startTest();
        } else if (state === 'waiting') {
            handleWaitingClick();
        } else if (state === 'go') {
            handleGoClick();
        } else if (state === 'early' || state === 'result') {
            startTest();
        }
    }
});

// Initialize
updateBestScoreDisplay();
