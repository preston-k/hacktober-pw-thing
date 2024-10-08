
const firebaseConfig = {
  apiKey: 'AIzaSyDN4kyU0EmXc8-yJNfojZ6zdHukk7u1Quw',
  authDomain: 'collegeprephacktober.firebaseapp.com',
  projectId: 'collegeprephacktober',
  storageBucket: 'collegeprephacktober.appspot.com',
  messagingSenderId: '139266798506',
  appId: '1:139266798506:web:34bc54d324fd35580831d3'
}
firebase.initializeApp(firebaseConfig)

let database = firebase.database()

let ctx = document.getElementById('chart').getContext('2d')
let myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['total', 'noLower', 'noSpecial', 'onlyNumbers', 'onlyLower', 'noNumbers', 'common', 'noUpper', 'onlyUpper', 'repeating'],
    datasets: [{
      label: 'Data',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
      backgroundColor: '#FFb10c'
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  }
})

database.ref('data/').on('value', async snapshot => {
  let data = snapshot.val()
  document.querySelector('#data-total').innerHTML = data['total']
  document.querySelector('#data-nolower').innerHTML = data['noLower']
  document.querySelector('#data-nospecial').innerHTML = data['noSpecial']
  document.querySelector('#data-onlynumbers').innerHTML = data['onlyNumbers']
  document.querySelector('#data-onlylower').innerHTML = data['onlyLower']
  document.querySelector('#data-nonumbers').innerHTML = data['noNumbers']
  document.querySelector('#data-common').innerHTML = data['common']
  document.querySelector('#data-noupper').innerHTML = data['noUpper']
  document.querySelector('#data-onlyupper').innerHTML = data['onlyUpper']
  document.querySelector('#data-repeating').innerHTML = data['repeating']

  myChart.data.datasets[0].data = [
    data['total'], 
    data['noLower'], 
    data['noSpecial'], 
    data['onlyNumbers'], 
    data['onlyLower'], 
    data['noNumbers'], 
    data['common'], 
    data['noUpper'], 
    data['onlyUpper'], 
    data['repeating']
  ]

  myChart.update()
  let totalScore = 0
  let scorecount = 0
  let scoreSnapshot = await database.ref('/submissions/').once('value')
  scoreSnapshot.forEach(uuidSnapshot => {
    let scoreValue = uuidSnapshot.child('score/').val()
    if (scoreValue !== null) {
      totalScore += scoreValue
      scorecount += 1
    }
  })
  let avgScore = totalScore / scorecount
  console.log(avgScore)
  let totalLength = 0
  let lengthcount = 0
  let lenSnapshot = await database.ref('/submissions/').once('value')
  lenSnapshot.forEach(uuidSnapshot => {
    let lengthValue = uuidSnapshot.child('length/').val()
    if (lengthValue !== null) {
      totalLength += lengthValue
      lengthcount += 1
    }
  })
  let avgLen = totalLength / lengthcount
  console.log(avgLen)
  document.querySelector('#avglen').innerHTML = avgLen
  document.querySelector('#avgscore').innerHTML = avgScore
  document.querySelector('#sessions').innerHTML = data['sessions']
  document.querySelector('#emails-sent').innerHTML = data['emailed']
  document.querySelector('#update-ts').innerHTML = new Date()
})
document.querySelector('#reset-datapage').addEventListener('click', async () => {
  if (confirm('Are you sure? Doing so will delete ALL data values from the database.')) {
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
      emailed: 0,
      sessions: 0
  })
  await database.ref(`submissions/`).remove()
  }
})