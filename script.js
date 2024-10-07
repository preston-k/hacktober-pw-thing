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
let onlyNumbers = 0
let onlyUpper = 0
let onlyLower = 0
let noSpecial = 0
let noNumbers = 0
let noUpper = 0
let noLower = 0
let goodList
let badList
function evaluate(pw) {
    let score = 0
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
    let characteristics = []
    if (specialCount === 0) {
        badList += "<p class='detailed-lineitem'>Your password doesn't contain any special characters.</p>"
    } else {
        goodList += "<p class='detailed-lineitem'>Your password contains one or more special characters.</p>"
    }
    if (numberCount === 0) {
        badList += "<p class='detailed-lineitem'>Your password doesn't contain any numbers.</p>"
    } else {
        goodList += "<p class='detailed-lineitem'>Your password contains one or more numbers.</p>"
    }
    if (uppercaseCount === 0) {
        badList += "<p class='detailed-lineitem'>Your password doesn't contain any uppercase letters.</p>"
    } else {
        goodList += "<p class='detailed-lineitem'>Your password contains one or more uppercase letters.</p>"
    }
    if (lowercaseCount === 0) {
        badList += "<p class='detailed-lineitem'>Your password doesn't contain any lowercase letters.</p>"
    } else {
        goodList += "<p class='detailed-lineitem'>Your password contains one or more lowercase letters.</p>"
    }
    let guessTime
    if (score >= 10) {
        score=10
    }

    if (score <= 3) guessTime = 'Instantly'
        else if (score <= 5) guessTime = 'Within seconds'
        else if (score <= 7) guessTime = 'Minutes'
        else if (score <= 9) guessTime = 'Hours'
        else guessTime = 'Several days or more'
        console.log(`Password Strength Score: ${score}/10`)
        let color = ''
        if (score >= 7 && score <= 10) {
            color = '#45a049'
        } else if (score > 3 && score < 7) {
            color = '#FFC300'
        } else {
            color = '#E63946'
        }
        for (let i = 1; i <= score; i++) {
            document.querySelector(`#result-${i}`).style.backgroundColor = color
        }
        document.querySelector('#result-score').innerHTML = `${score}/10`
        console.log(`Estimated Time to Crack: ${guessTime}`)
        console.log(`Special Characteristics: ${characteristics.length > 0 ? characteristics.join(', ') : 'None'}`)
        if (goodList != null) {
            document.querySelector('#good-append').innerHTML = goodList.replace(undefined, '')
        }
        if (badList != null) {
            document.querySelector('#bad-append').innerHTML = badList.replace(undefined, '')
        }
}


document.querySelector('#clear').addEventListener('click', () => {
    console.log('clear')
    document.querySelector('#password').value = ''
})
let facts = ['Hackers can crack passwords under 8 characters in seconds.','The password "P@$$wOrd!" is weaker than "CorrectHorseBatteryStaple"', '"123456" and "password" are some of the most common passwords.']
let chosenfact = facts[Math.floor(Math.random() * facts.length)]
console.log(chosenfact)

let id = self.crypto.randomUUID()
document.querySelector('#loading-fact').innerHTML = chosenfact
document.querySelector('#submit').addEventListener('click', async () => {
    console.log('submit')
    console.log(document.querySelector('#password').value)
    document.querySelector('#result').style.display = 'flex'

    evaluate(document.querySelector('#password').value)
    await database.ref(`submissions/${id}/`).update({
        onlyNumbers: onlyNumbers,
        onlyUpper: onlyUpper,
        onlyLower: onlyLower,
        noSpecial: noSpecial,
        noNumbers: noNumbers,
        noUpper: noUpper,
        noLower: noLower
    })
    setTimeout(() => {
        console.log('display-result')
        document.querySelector('#loading-bounce').style.display = 'none'
        document.querySelector('#result-final').style.display = 'block'
    }, 1)
})
