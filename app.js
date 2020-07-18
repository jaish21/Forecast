const express = require('express')
const app = express()
const bodyParser = require('body-parser');
var needle = require('needle');
const apiKey = '29f3c322a468a721b77c65891490a108'

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index');
});

app.set('view engine', 'ejs')

app.listen(3000, function () {
  console.log('Weather app listening on port 3000!')
})

app.post('/', function (req, res) {
  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
  needle.request('post', url, { city }, function (err, response) {
    console.log(response.body);
    if(err){
      res.render('index', {weather: null, error: 'Error, please try again'});
    } else {
      let weather = response.body;
      if(weather.main == undefined){
        res.render('index', {weather: null, error: 'Error, please try again'});
      } else {
        let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
        let weatherFluctuation = `The temperature is expected to fluctuate between ${weather.main.temp_min} degrees and ${weather.main.temp_max} degrees!`;
        res.render('index', {weather: weatherText, range: weatherFluctuation, error: null});
      }
    }
  });
});