const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const { Schema } = mongoose;

require('dotenv').config();

const server = express();

server.use(cors());
server.use(express.json());

mongoose.connect('mongodb://localhost:27017/digimon', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const PORT = process.env.PORT;

// SCHEMA

const digimonSchema = new Schema({
  name: String,
  img: String,
  level: String,
});
const Digimon = mongoose.model('Digimon', digimonSchema);

const getDataHandler = (req, res) => {
  axios.get('https://digimon-api.vercel.app/api/digimon').then((response) => {
    res.send(response.data);
  });
};

const addFavoriteHandler = (req, res) => {
  const { favoriteDigimon } = req.body;

  const newFavorite = new Digimon(favoriteDigimon);

  newFavorite.save();
};
const getFavoriteHandler = (req, res) => {
  Digimon.find({}, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  });
};
const updateFavoriteHandler = (req, res) => {
  const { favoriteDigimon } = req.body;

  Digimon.findOne({ _id: favoriteDigimon._id }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      data.name = favoriteDigimon.name;
      data.img = favoriteDigimon.img;
      data.level = favoriteDigimon.level;
      data.save().then(() => {
        Digimon.find({}, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            res.send(data);
          }
        });
      });
    }
  });
};
const deleteFavoriteHandler = (req, res) => {
  const { id } = req.params;

  Digimon.deleteOne({ _id: id }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      Digimon.find({}, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          res.send(data);
        }
      });
    }
  });
};
server.get('/getdata', getDataHandler);
server.post('/addfavorite', addFavoriteHandler);
server.get('/getfavorite', getFavoriteHandler);
server.put('/updatefavorite', updateFavoriteHandler);
server.delete('/deletefavorite/:id', deleteFavoriteHandler);

server.get('*', (req, res) => {
  res.send('PAGE NOT FOUND');
});

server.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
