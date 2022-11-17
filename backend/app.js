const express = require('express'); //https://www.npmjs.com/package/express
const mongoose = require('mongoose'); //https://www.npmjs.com/package/mongoose
const bodyParser = require('body-parser'); //https://www.npmjs.com/package/body-parser
const path = require('path'); //https://nodejs.org/docs/latest/api/path.html
const helmet = require('helmet'); //https://www.npmjs.com/package/helmet
require('dotenv').config(); //https://www.npmjs.com/package/dotenv

const userRoute = require('./routes/user_route');
const sauceRoute = require('./routes/sauce_route');

mongoose.connect(process.env.DB_URL,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
  
const app = express();

app.use(helmet());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

app.use(bodyParser.json())

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(userRoute);
app.use(sauceRoute);

module.exports = app;