const express = require("express");
const axios = require("axios");
const app = express();
app.set("view engine", "pug");

// Home page (just for testing)
app.get("/", async (req, res) => {
  const query = await axios.get("https://randomuser.me/api/?results=9");
  console.log(query.data);
  res.render("index", { users: query.data.results });
});

// 'sports' page driven by pug template -> sports.pug -> _thumbCard.pug
app.get("/sports", async (req, res) => {
  const data = await getSportsData();  
  res.render("sports", { sportData: data.response});
});

// API that drives 'sports' page
async function getSportsData() {
                       
        const options = {
          method: 'GET',
          url: 'https://api-nba-v1.p.rapidapi.com/games',
          params: {season: '2023'},
          headers: {
            'X-RapidAPI-Key': '15b24af7b6msh7e5d4f6d8745ad4p18db28jsn02ce7f984764',
            'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
          }
        };

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