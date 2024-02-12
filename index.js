const express = require("express");
const axios = require("axios");
const app = express();
app.set("view engine", "pug");
const dotenv = require('dotenv'); // Needed to access .env files  
dotenv.config();

//console.log(`Your port is ${process.env.PORT}`);

const csvFilePath='per_game_stats-2020-23.csv'
const csv=require('csvtojson')
/* csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
  console.log('asdf');
  console.log(jsonObj);
  
}) */

// Home page (just for testing)
app.get("/", async (req, res) => {
  const query = await axios.get("https://randomuser.me/api/?results=9");
  //console.log(query.data);
  res.render("index", { users: query.data.results });
});

// 'sports' page driven by pug template -> sports.pug -> _thumbCard.pug
app.get("/sports", async (req, res) => {

  await csv()
  .fromFile(csvFilePath)
  .then((jsonObj)=>{
    //console.log(jsonObj);     
    res.render("sports", { sportData: jsonObj}); 
  })
  //const data = await getSportsData();  
  
});

// Working API with .env key
const apiKey = process.env.API_KEY;
const options = {
  method: 'GET',
  url: 'https://api-nba-v1.p.rapidapi.com/games',
  params: {season: '2023'},
  headers: {
    'X-RapidAPI-Key': apiKey,
    'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
  }
};

// API that drives 'sports' page
async function getSportsData() {

        try {
          const response = await axios.request(options);          
          return response.data;

        } catch (error) {
          console.error(error);
        }   
  }
  

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});