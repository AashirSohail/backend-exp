const express = require('express');
const bodyParser = require ('body-parser');
const mongoose = require ('mongoose');
const Recipe = require ('./models/recipe');

const app = express();
mongoose.connect('mongodb+srv://aashir:donthaveany@cluster0-arbfh.mongodb.net/test?retryWrites=true&w=majority')
.then(()=>{
  console.log('Successfully connected to MongoDB using mongoose');
})
.catch((e) =>{
  console.log('Not able to connect to MongoDB using mongoose');
  console.log(e);
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());

app.get('/api/recipes', (req,res,next) =>{
    Recipe.find()
    .then((recipes)=>{
        res.status(200).json(recipes);
    })
    .catch((e)=>{
          console.log('error in posting data to DB');
          console.log(e);
    });
});

app.get('/api/recipes/:id', (req,res,next) =>{
    Recipe.findOne({
        _id: req.params.id
      }).then(
        (recipe) => {
          res.status(200).json(recipe);
        }
      ).catch(
        (error) => {
          res.status(404).json({
            error: error
          });
        }
      );
});

app.post('/api/recipes', (req,res,next) =>{
    const recipe = new Recipe({
        title: req.body.title,
        ingredients : req.body.ingredients,
        instructions: req.body.instructions,
        difficulty: req.body.difficulty,
        time: req.body.time,
      });
      recipe.save().then(()=>{
        res.status(201).json({
          message: 'posted data saved successfully'
        });
      })
      .catch((e)=>{
        console.log('error in posting data to DB');
        console.log(e);
      });
});

app.put('/api/recipes/:id', (req,res,next) =>{
    const recipe = new Recipe({
        title: req.body.title,
        ingredients : req.body.ingredients,
        instructions: req.body.instructions,
        difficulty: req.body.difficulty,
        time: req.body.time,
        _id: req.params.id
      });
    
      Recipe.updateOne({_id: req.params.id}, recipe)
    .then(() =>{
        res.status(201).json({
          message: 'put data updated successfully'
        });
      })
      .catch((e)=>{
        console.log('error in posting data to DB');
        console.log(e);
      });
});

app.delete('/api/recipes/:id', (req,res,next) =>{
    Recipe.deleteOne({_id: req.params.id}).then(
        () => {
          res.status(200).json({
            message: 'Deleted!'
          });
        }
      ).catch(
        (error) => {
          res.status(400).json({
            error: error
          });
        }
      );
});

module.exports = app;