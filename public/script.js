// PIN Management System
const temporaryPINs = {};

// Send PIN to user's email
function sendPIN() {
    const email = document.getElementById('email-input').value.trim();
    
    // Validate company email
    if (!email.endsWith('@itkaofela.co.za')) {
        alert('Please use your company email address (@itkaofela.co.za)');
        return;
    }

    // Check if already verified
    if (localStorage.getItem(`verified_${email}`)) {
        showDashboard(email);
        return;
    }

    // Generate 6-digit PIN
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store PIN temporarily (15-minute expiry)
    temporaryPINs[email] = {
        pin: pin,
        expires: Date.now() + 15 * 60 * 1000
    };

    // Show PIN section
    document.getElementById('user-email').textContent = email;
    document.getElementById('email-section').classList.add('hidden');
    document.getElementById('pin-section').classList.remove('hidden');

    // In production: Send email with PIN
    console.log(`PIN for ${email}: ${pin}`);
    alert(`DEMO: PIN sent to ${email}: ${pin}\n\nIn production, this would be automatically emailed.`);
}

// Verify entered PIN
function verifyPIN() {
    const email = document.getElementById('user-email').textContent;
    const enteredPIN = document.getElementById('pin-input').value.trim();
    const storedPIN = temporaryPINs[email];

    // Check PIN validity
    if (!storedPIN) {
        alert('PIN expired or invalid. Please request a new one.');
        backToEmail();
        return;
    }

    if (Date.now() > storedPIN.expires) {
        alert('PIN has expired. Please request a new one.');
        backToEmail();
        return;
    }

    if (enteredPIN === storedPIN.pin) {
        // Successful verification
        showSuccess(email);
    } else {
        alert('Invalid PIN. Please try again.');
    }
}

// Show success message and proceed
function showSuccess(email) {
    // Mark email as permanently verified
    localStorage.setItem(`verified_${email}`, 'true');
    
    // Clean up temporary PIN
    delete temporaryPINs[email];
    
    // Show success message
    document.getElementById('pin-section').classList.add('hidden');
    document.getElementById('success-section').classList.remove('hidden');

    // In production: Send confirmation email
    console.log(`Confirmation email sent to ${email}`);
    
    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
        showDashboard(email);
    }, 2000);
}

// Show dashboard
function showDashboard(email) {
    document.getElementById('display-email').textContent = email;
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('dashboard-container').classList.remove('hidden');
}

// Navigation functions
function backToEmail() {
    document.getElementById('pin-section').classList.add('hidden');
    document.getElementById('success-section').classList.add('hidden');
    document.getElementById('email-section').classList.remove('hidden');
    document.getElementById('pin-input').value = '';
}

// Check for existing verification on page load
window.onload = function() {
    // Check localStorage for any verified email
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('verified_')) {
            const email = key.replace('verified_', '');
            showDashboard(email);
            break;
        }
    }
}; 