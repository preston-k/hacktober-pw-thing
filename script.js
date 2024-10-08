const firebaseConfig = {
    apiKey: "AIzaSyDN4kyU0EmXc8-yJNfojZ6zdHukk7u1Quw",
    authDomain: "collegeprephacktober.firebaseapp.com",
    projectId: "collegeprephacktober",
    storageBucket: "collegeprephacktober.appspot.com",
    messagingSenderId: "139266798506",
    appId: "1:139266798506:web:34bc54d324fd35580831d3"
}
firebase.initializeApp(firebaseConfig)

let database = firebase.database()
let emailcontent = `<p>Hi there!</p><p>Thank you for participating in Hacktober and testing your password strength! Here is a recap of your results!<br><br>We gave your password a score of: `
let onlyNumbers = 0
let onlyUpper = 0
let onlyLower = 0 
let noSpecial = 0
let noNumbers = 0
let noUpper = 0
let noLower = 0
let repeating = 0
let common = 0
let current

let score = 0
await database.ref('data/').once('value').then((snapshot) => {
    console.log(snapshot.val())
    current = snapshot.val()
})
let goodList = ''
let badList = ''
function evaluate(pw) {
    let specialChars = /[!@#$%^&*(),.?":{}|<>]/
    let hasUppercase = /[A-Z]/
    let hasLowercase = /[a-z]/
    let hasNumbers = /[0-9]/
    
    let specialCount = (pw.match(specialChars) || []).length
    let uppercaseCount = (pw.match(hasUppercase) || []).length
    let lowercaseCount = (pw.match(hasLowercase) || []).length
    let numberCount = (pw.match(hasNumbers) || []).length
    
    if (pw.length >= 8) score += 2
    else if (pw.length >= 5) score += 1
    if (uppercaseCount > 0) score += 2
    if (lowercaseCount > 0) score += 2
    if (numberCount > 0) score += 2
    if (specialCount > 0) score += 3
    // add to variables
    if (specialCount == 0) noSpecial=1
    if (numberCount == 0) noNumbers=1
    if (numberCount != 0 && uppercaseCount == 0 && lowercaseCount == 0) onlyNumbers = 1
    if (numberCount == 0 && uppercaseCount != 0 && lowercaseCount == 0) onlyUpper = 1
    if (numberCount == 0 && uppercaseCount == 0 && lowercaseCount != 0) onlyLower = 1
    if (uppercaseCount == 0) noUpper=1
    if (lowercaseCount == 0) noLower=1
    const badPasswords = ['password', '123456', 'qwerty', 'letmein', 'admin', '123456789', '12345']
    if (badPasswords.includes(pw.toLowerCase())) {
        score -= 2
        badList += "<p class='detailed-lineitem'>Your password is a very common password.</p>"
        common =1
    }
    if (pw.match(/^(.)\1+$/)) { 
        score -= 5
        badList += "<p class='detailed-lineitem'>Your password uses only repeating characters.</p>"
        repeating =1
    }
    // 
    if (specialCount === 0) badList += "<p class='detailed-lineitem'>Your password doesn't contain any special characters.</p>"
    else goodList += "<p class='detailed-lineitem'>Your password contains one or more special characters.</p>"
    
    if (numberCount === 0) badList += "<p class='detailed-lineitem'>Your password doesn't contain any numbers.</p>"
    else goodList += "<p class='detailed-lineitem'>Your password contains one or more numbers.</p>"
    
    if (uppercaseCount === 0) badList += "<p class='detailed-lineitem'>Your password doesn't contain any uppercase letters.</p>"
    else goodList += "<p class='detailed-lineitem'>Your password contains one or more uppercase letters.</p>"
    
    if (lowercaseCount === 0) badList += "<p class='detailed-lineitem'>Your password doesn't contain any lowercase letters.</p>"
    else goodList += "<p class='detailed-lineitem'>Your password contains one or more lowercase letters.</p>"
    
    let guessTime
    if (score >= 10) score = 10
    if (score <= 0) score = 0

    if (score <= 3) guessTime = 'Instantly'
    else if (score <= 5) guessTime = 'Within seconds'
    else if (score <= 7) guessTime = 'Minutes'
    else if (score <= 9) guessTime = 'Hours'
    else guessTime = 'Several days or more'

    let color = ''
    if (score >= 7 && score <= 10) color = '#45a049'
    else if (score > 3 && score < 7) color = '#FFC300'
    else color = '#E63946'

    for (let i = 1; i <= score; i++) {
        document.querySelector(`#result-${i}`).style.backgroundColor = color
    }

    document.querySelector('#result-score').innerHTML = `${score}/10`
    emailcontent += `<strong>${score}/10</strong>.</p>`
    if (goodList != null) {
        document.querySelector('#good-append').innerHTML = goodList.replace(undefined, '')
    }
    if (badList != null) {
        document.querySelector('#bad-append').innerHTML = badList.replace(undefined, '')
    }
    emailcontent += `<p>Here is a detailed list about the good and bad things about your password.</p><br><p style='color:green; font-size: 18px;'><strong><u>Good Things!</u></strong></p>${goodList.replace(undefined, '').replace("class='detailed-lineitem'", '')}<br><p style='color:red; font-size: 18px;'><strong><u>Things That Need Some Work...</u></strong></p>${badList.replace(undefined, '').replace("class='detailed-lineitem'", '')}`
}

document.querySelector('#clear').addEventListener('click', () => {
    console.log('clear')
    document.querySelector('#password').value = ''
})
let facts = ['Hackers can crack passwords under 8 characters in seconds.','The password "P@$$wOrd!" is weaker than "CorrectHorseBatteryStaple"', '"123456" and "password" are some of the most common passwords.','Over 80% of data breaches are caused by weak or stolen passwords.','Some websites intentionally limit password complexity to avoid frustrating users.','The websites you use might have a password length limit.','People are more likely to forget a password they created themselves than one generated by a password manager.','Many people don\'t update their passwords after a data breach, even if they were notified that their account was affected.','Breached password lists are sold on the dark web, increasing risk for reused passwords.']
let chosenfact = facts[Math.floor(Math.random() * facts.length)]
console.log(chosenfact)

let id = self.crypto.randomUUID()
document.querySelector('#loading-fact').innerHTML = chosenfact
document.querySelector('#submit').addEventListener('click', async () => {
    console.log('submit')
    // console.log(document.querySelector('#password').value)
    document.querySelector('#result').style.display = 'flex'

    evaluate(document.querySelector('#password').value)
    await database.ref(`submissions/${id}/`).update({
        score: score,
        ts: new Date(),
        length: document.querySelector('#password').value.length
    })
    await database.ref(`submissions/${id}/details`).update({
        onlyNumbers: onlyNumbers,
        onlyUpper: onlyUpper,
        onlyLower: onlyLower,
        noSpecial: noSpecial,
        noNumbers: noNumbers,
        noUpper: noUpper,
        noLower: noLower,
        repeating: repeating,
        common: common,
    })
    await database.ref(`data/`).update({
        total: current['total']+1,
        onlyNumbers: current['onlyNumbers']+onlyNumbers,
        onlyUpper: current['onlyUpper']+onlyUpper,
        onlyLower: current['onlyLower']+onlyLower,
        noSpecial: current['noSpecial']+noSpecial,
        noNumbers: current['noNumbers']+noNumbers,
        noUpper: current['noUpper']+noUpper,
        noLower: current['noLower']+noLower,
        repeating: current['repeating']+repeating,
        common: current['common']+common,
    })
    setTimeout(() => {
        console.log('display-result')
        document.querySelector('#loading-bounce').style.display = 'none'
        document.querySelector('#result-final').style.display = 'block'
        document.querySelector('#emailwrap').style.display = 'flex'
    }, 3000) // 3 second bounce to allow time to read
}) 
let email

document.querySelector('#emailwrap').addEventListener('click', () => {
    emailcontent += `<br><p><strong><u>Remember:</u></strong> Hackers use sophisticated tools to crack weak passwords in seconds. A strong, unique password for each of your accounts is your first line of defense.</p><br><p style='color:orange;'>Spookily Yours! 🐈‍⬛</p><p>- The 2024 Hacktober Team</p>`
    console.log('emailprompt')
    email = prompt('What is your email?')
    let send = confirm(`Ok, we will send an email to ${email}. If this is INCORRECT, please click cancel. Otherwise, click OK.`)
    if (send) {
        
        console.log('sendemail')
        const data = new FormData()
        data.set('from', 'pkwei@college-prep.org')
        data.set('sendto', email)
        data.set('subject', 'Your Password Strength Results!')
        data.set('content', `Sorry, this email didn't send correctly. You can delete this email, or keep it. We won't mind either way!`)
        data.set('html', emailcontent)
        fetch('https://emailserver.prestonkwei.com/email', {
            method: 'post',
            body: data,
        }).catch(() => {})
    }
})
const urlParams = new URLSearchParams(window.location.search)
if (urlParams.get('r') == '1') {
    await database.ref(`data/`).update({
        onlyNumbers: 0,
        onlyUpper: 0,
        onlyLower: 0,
        noSpecial: 0,
        noNumbers: 0,
        noUpper: 0,
        noLower: 0,
        total: 0,
        repeating: 0,
        common: 0,
    })
    window.location = '/'
}
