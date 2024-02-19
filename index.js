const express = require('express')
const axios = require('axios')
const app = express()
app.set('view engine', 'pug')
const dotenv = require('dotenv') // Needed to access .env files
dotenv.config()

const csvFilePath = 'playerPrevDay.csv' 
const csv = require('csvtojson') // For parsing csv to json


// 'sports' page driven by pug template -> sports.pug -> _thumbCard.pug
// This page calls CVS data and parses it.
app.get('/sports', async (req, res) => {
  await csv()
    .fromFile(csvFilePath)
    .then(jsonObj => {
      const obj = calculateScores(jsonObj)
      res.render('sports', { sportData: obj })
    })
})


// Current using CSV data
function calculateScores (obj) {
  for (var key in obj) {
    if (typeof obj[key] == 'object') {
      var FTA = parseFloat(obj[key].FTA)
      var FGA = parseFloat(obj[key].FGA)
      var TOV = parseFloat(obj[key].TOV)

      //Effective field goal percentage
      obj[key].FGP = Math.round(obj[key].FG_PERCENT * 100) // (obj[key].FG + (0.5 * obj[key].threeP))/obj[key].FGA;
      obj[key].Usage = Math.round(FTA * 0.44 + FGA + TOV)

      //Fantasy Points Per Minute -  FP/Minute
      let mins = obj[key].MP
      const myArray = mins.split(':')
      let minsRounded = myArray[0]

      // Get FPM
      if (obj[key].FG > 0 && minsRounded > 0)
        obj[key].FPM = Math.round((obj[key].FG / minsRounded) * 100) / 100
      else obj[key].FPM = 0

      var THREE_PERCENT = parseFloat(obj[key].THREE_PERCENT)

      // Get Three percent
      if (THREE_PERCENT > 0) {
        obj[key].THREE_PERCENT = Math.round(THREE_PERCENT * 100);
      } else {
        obj[key].THREE_PERCENT = 0;
      }

    }
  }
  return obj
}


// Home page - displays API called data (from NBA API)
app.get('/', async (req, res) => {
  const query = await getSportsData();
  console.log(query.response);
  res.render('index', { spDataApi: query.response})
})

// Working API with .env key
const apiKey = process.env.API_KEY
const options = {
  method: 'GET',
  url: 'https://api-nba-v1.p.rapidapi.com/games',
  params: { season: '2023' },
  headers: {
    'X-RapidAPI-Key': apiKey, // Stored in .env file
    'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
  }
}


// API that drives 'sports' page through NBA API
async function getSportsData () {
  try {
    const response = await axios.request(options)
    return response.data
  } catch (error) {
    console.error(error)
  }
}


// Boilerplate 
const PORT = 3000
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`)
})
