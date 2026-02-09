// Default recipient (used when dealId has no config)
const DEFAULT_RECIPIENT = '0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97';

// Per-dealId: recipient wallet and amounts (edit manually for each ID)
var DEAL_CONFIG = {
    'A7F3K9R2P5Q8Z1M': { recipientAddress: DEFAULT_RECIPIENT, subtotal: '1000.00 USDT', fee: '$0.00', total: '1000.00 USDT' },
    'M4T9B6N2D7X3L8G': { recipientAddress: DEFAULT_RECIPIENT, subtotal: '1000.00 USDT', fee: '$0.00', total: '1000.00 USDT' },
    'G5H0C4J9W2E6V7R': { recipientAddress: DEFAULT_RECIPIENT, subtotal: '1000.00 USDT', fee: '$0.00', total: '1000.00 USDT' },
    'R1Y8S5K2M4F6A9U': { recipientAddress: DEFAULT_RECIPIENT, subtotal: '1000.00 USDT', fee: '$0.00', total: '1000.00 USDT' },
    'U8P3D0Z1E5H7N3Q': { recipientAddress: DEFAULT_RECIPIENT, subtotal: '1000.00 USDT', fee: '$0.00', total: '1000.00 USDT' },
    'Q8W6T4B9J2R4S6T': { recipientAddress: DEFAULT_RECIPIENT, subtotal: '1000.00 USDT', fee: '$0.00', total: '1000.00 USDT' },
    'T8U0V2W4X6Y8Z0A': { recipientAddress: DEFAULT_RECIPIENT, subtotal: '1000.00 USDT', fee: '$0.00', total: '1000.00 USDT' },
    'A2B4C6D8E0F2G4H': { recipientAddress: DEFAULT_RECIPIENT, subtotal: '1000.00 USDT', fee: '$0.00', total: '1000.00 USDT' },
    'H6I8J0K2L4M6N8O': { recipientAddress: DEFAULT_RECIPIENT, subtotal: '1000.00 USDT', fee: '$0.00', total: '1000.00 USDT' },
    'O0P2Q4R6S8T0U2V': { recipientAddress: DEFAULT_RECIPIENT, subtotal: '1000.00 USDT', fee: '$0.00', total: '1000.00 USDT' },
    'V4W6X8Y0Z2A4B6C': { recipientAddress: DEFAULT_RECIPIENT, subtotal: '1000.00 USDT', fee: '$0.00', total: '1000.00 USDT' },
    'C8D0E2F4G6H8I0J': { recipientAddress: DEFAULT_RECIPIENT, subtotal: '1000.00 USDT', fee: '$0.00', total: '1000.00 USDT' },
    'J2K4L6M8N0P2Q4R': { recipientAddress: DEFAULT_RECIPIENT, subtotal: '1000.00 USDT', fee: '$0.00', total: '1000.00 USDT' },
    'R6S8T0U2V4W6X8Y': { recipientAddress: DEFAULT_RECIPIENT, subtotal: '1000.00 USDT', fee: '$0.00', total: '1000.00 USDT' },
    'Y0Z2A4B6C8D0E2F': { recipientAddress: DEFAULT_RECIPIENT, subtotal: '1000.00 USDT', fee: '$0.00', total: '1000.00 USDT' },
    'F4G6H8I0J2K4L6M': { recipientAddress: DEFAULT_RECIPIENT, subtotal: '1000.00 USDT', fee: '$0.00', total: '1000.00 USDT' },
    'M8N0P2Q4R6S8T0U': { recipientAddress: DEFAULT_RECIPIENT, subtotal: '1000.00 USDT', fee: '$0.00', total: '1000.00 USDT' },
    'U2V4W6X8Y0Z2A4B': { recipientAddress: DEFAULT_RECIPIENT, subtotal: '1000.00 USDT', fee: '$0.00', total: '1000.00 USDT' },
    'B6C8D0E2F4G6H8I': { recipientAddress: DEFAULT_RECIPIENT, subtotal: '1000.00 USDT', fee: '$0.00', total: '1000.00 USDT' },
    'I0J2K4L6M8N0P2Q': { recipientAddress: DEFAULT_RECIPIENT, subtotal: '1000.00 USDT', fee: '$0.00', total: '1000.00 USDT' }
};

function getDealIdFromUrl() {
    var path = typeof location !== 'undefined' && (location.pathname || '');
    var hash = (typeof location !== 'undefined' && (location.hash || '')) ? (location.hash || '').replace(/^#/, '') : '';
    var raw = path && path.indexOf('/payment/') !== -1 ? path : hash;
    var match = raw && raw.match(/\/payment\/([A-Za-z0-9]{15})\/?$/);
    return match ? match[1].toUpperCase() : null;
}

function getCurrentDealId() {
    var fromUrl = getDealIdFromUrl();
    if (fromUrl) return fromUrl;
    var session = getPaymentSession();
    return (session && session.dealId) || null;
}

function formatCurrentDate() {
    var d = new Date();
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
}

function applyDealConfig() {
    var dealId = getCurrentDealId();
    var cfg = (dealId && DEAL_CONFIG[dealId]) ? DEAL_CONFIG[dealId] : {
        recipientAddress: DEFAULT_RECIPIENT,
        subtotal: '1000.00 USDT',
        fee: '$0.00',
        total: '1000.00 USDT'
    };
    var addr = cfg.recipientAddress || DEFAULT_RECIPIENT;
    var short = addr.length > 16 ? addr.slice(0, 10) + '...' + addr.slice(-4) : addr;
    var elAddr = document.getElementById('recipientAddress');
    var elSub = document.getElementById('invoiceSubtotal');
    var elFee = document.getElementById('invoiceFee');
    var elTotal = document.getElementById('invoiceTotal');
    var elDate = document.getElementById('invoiceDate');
    if (elAddr) {
        elAddr.textContent = short;
        elAddr.setAttribute('data-full-address', addr);
    }
    if (elSub) elSub.textContent = cfg.subtotal;
    if (elFee) elFee.textContent = cfg.fee;
    if (elTotal) elTotal.textContent = cfg.total;
    if (elDate) elDate.textContent = formatCurrentDate();
}

// Timer: read from paymentSession (set in index.html on code submit). Key by URL dealId.
function getPaymentSessionKey() {
    var path = typeof location !== 'undefined' && (location.pathname || '');
    var hash = (typeof location !== 'undefined' && (location.hash || '')) ? (location.hash || '').replace(/^#/, '') : '';
    var raw = path && path.indexOf('/payment/') !== -1 ? path : hash;
    var match = raw && raw.match(/\/payment\/([A-Za-z0-9]{15})\/?$/);
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
        applyDealConfig();
        var s = getPaymentSession();
        if (typeof s.timerEnd === 'number' && s.timerEnd > 0) runCountdown(timerElement, s.timerEnd);
    });
}

// Copy address to clipboard (uses data-full-address set by applyDealConfig)
function setupAddressCopy() {
    var addressElement = document.getElementById('recipientAddress');
    if (!addressElement) return;
    addressElement.addEventListener('click', function() {
        var full = addressElement.getAttribute('data-full-address') || addressElement.textContent;
        navigator.clipboard.writeText(full).then(function() {
            var originalText = addressElement.textContent;
            addressElement.textContent = 'Copied!';
            addressElement.style.color = '#a78bfa';
            setTimeout(function() {
                addressElement.textContent = originalText;
                addressElement.style.color = '#886CFD';
            }, 2000);
        }).catch(function(err) {
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
document.addEventListener('DOMContentLoaded', function() {
    applyDealConfig();
    startTimer();
    setupAddressCopy();
    setupReceiveButton();
});
