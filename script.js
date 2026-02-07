// Full recipient address for copying
const RECIPIENT_ADDRESS = '0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97';

// Timer: read from paymentSession (set in index.html on code submit). Key by URL dealId.
function getPaymentSessionKey() {
    var path = typeof location !== 'undefined' && (location.pathname || '');
    var hash = (typeof location !== 'undefined' && (location.hash || '')) ? (location.hash || '').replace(/^#/, '') : '';
    var raw = path && path.indexOf('/dealid/') !== -1 ? path : hash;
    var match = raw && raw.match(/\/dealid\/([A-Za-z0-9]{15})\/?$/);
    return match ? 'maxelpay_paymentSession_' + match[1].toUpperCase() : 'maxelpay_paymentSession';
}

function getPaymentSession() {
    try {
        var key = getPaymentSessionKey();
        var s = localStorage.getItem(key);
        return s ? JSON.parse(s) : {};
    } catch (e) { return {}; }
}

function runCountdown(timerElement, endTime) {
    var interval;
    function updateDisplay() {
        var remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
        if (remaining === 0) {
            if (interval) clearInterval(interval);
            timerElement.textContent = '00:00';
            return;
        }
        var minutes = Math.floor(remaining / 60);
        var seconds = remaining % 60;
        timerElement.textContent =
            String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
    }
    updateDisplay();
    interval = setInterval(updateDisplay, 1000);
    return interval;
}

function startTimer() {
    const timerElement = document.getElementById('timer');
    if (!timerElement) return;

    var session = getPaymentSession();
    var endTime = session && session.timerEnd;
    if (typeof endTime === 'number' && endTime > Date.now()) {
        runCountdown(timerElement, endTime);
        return;
    }
    if (typeof endTime === 'number' && endTime > 0) {
        timerElement.textContent = '00:00';
        return;
    }

    // No timer yet (code not entered): show 30:00 and wait for unlock
    timerElement.textContent = '30:00';
    document.addEventListener('paymentTimerStarted', function onStarted() {
        document.removeEventListener('paymentTimerStarted', onStarted);
        const s = getPaymentSession();
        if (typeof s.timerEnd === 'number' && s.timerEnd > 0) runCountdown(timerElement, s.timerEnd);
    });
}

// Copy address to clipboard
function setupAddressCopy() {
    const addressElement = document.getElementById('recipientAddress');
    
    addressElement.addEventListener('click', () => {
        navigator.clipboard.writeText(RECIPIENT_ADDRESS).then(() => {
            const originalText = addressElement.textContent;
            addressElement.textContent = 'Copied!';
            addressElement.style.color = '#a78bfa';
            
            setTimeout(() => {
                addressElement.textContent = originalText;
                addressElement.style.color = '#886CFD';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    });
}

// Receive payment button handler
function setupReceiveButton() {
    // Button functionality is now handled by after.js
    // No automatic status change - status will be updated by the payment processing system
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    startTimer();
    setupAddressCopy();
    setupReceiveButton();
});
