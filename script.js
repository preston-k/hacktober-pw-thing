const passwordInput = document.getElementById('password');
const resultDiv = document.getElementById('result');
const clearBtn = document.getElementById('clearBtn');

passwordInput.addEventListener('input', function() {
    const password = passwordInput.value;
    const strength = calculatePasswordStrength(password);
    displayResult(strength);
});

clearBtn.addEventListener('click', function() {
    passwordInput.value = '';
    resultDiv.innerHTML = '';
    resultDiv.classList.remove('show'); 
});

function calculatePasswordStrength(password) {
    let score = 0;
    score += password.length * 4;
    score += (password.match(/[a-z]/g) || []).length * 2;
    score += (password.match(/[A-Z]/g) || []).length * 2;
    score += (password.match(/[0-9]/g) || []).length * 3;
    score += (password.match(/[^a-zA-Z0-9]/g) || []).length * 5;
    if (password.match(/^[a-zA-Z]+$/)) {
        score -= password.length;
    }
    if (password.match(/^[0-9]+$/)) {
        score -= password.length;
    }

    let crackingTime = 'Instant';
    let metric = '';
    if (score < 30) {
        crackingTime = 'Instant';
        metric = ' (less than a second)';
    } else if (score < 50) {
        crackingTime = 'Seconds';
        metric = ' (e.g., 10 seconds)';
    } else if (score < 60) {
        crackingTime = 'Minutes';
        metric = ' (e.g., 10,000 seconds is about 3 hours)';
    } else if (score < 70) {
        crackingTime = 'Hours';
        metric = ' (e.g., 80,000 seconds is about 22 hours)';
    } else if (score < 80) {
        crackingTime = 'Days';
        metric = ' (e.g., 700,000 seconds is about 8 days)';
    } else if (score < 90) {
        crackingTime = 'Weeks';
        metric = ' (e.g., 3,000,000 seconds is about 5 weeks)';
    } else if (score < 100) {
        crackingTime = 'Months';
        metric = ' (e.g., 10,000,000 seconds is about 4 months)';
    } else {
        crackingTime = 'Years';
        metric = ' (e.g., 300,000,000 seconds is about 10 years)';
    }

    return {
        score: score,
        strength: getStrengthLevel(score),
        crackingTime: crackingTime,
        metric: metric
    };
}

function getStrengthLevel(score) {
    if (score < 50) {
        return 'Weak';
    } else if (score < 80) {
        return 'Medium';
    } else {
        return 'Strong';
    }
}

function displayResult(strength) {
    resultDiv.innerHTML = `
        <p>Strength: <span class='${strength.strength.toLowerCase()}'>${strength.strength}</span></p>
        <p>Cracking Time: ${strength.crackingTime}${strength.metric}</p>
        <div class='strength-meter'>
            <div class='strength-meter-fill ${strength.strength.toLowerCase()}' style='width: ${strength.score}%'></div>
        </div>
    `;
    resultDiv.classList.add('show'); 
}