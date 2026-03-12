const express = require('express');
let books = require("./booksdb.js");
const axios = require('axios');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// Task 6 - Register user
public_users.post("/register", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(400).json({message:"Username and password required"});
  }

  if(isValid(username)){
    return res.status(404).json({message:"User already exists"});
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(200).json({message:"User successfully registered"});
});


// Task 1 - Get all books
public_users.get('/', function (req, res) {

  return res.status(200).send(JSON.stringify(books,null,4));

});


// Task 2 - Get book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  return res.status(200).json(books[isbn]);

});


// Task 3 - Get books by Author
public_users.get('/author/:author', function (req, res) {

  const author = req.params.author;
  let result = [];

  Object.keys(books).forEach(function(key){

    if(books[key].author === author){
      result.push(books[key]);
    }

  });

  return res.status(200).json(result);

});


// Task 4 - Get books by Title
public_users.get('/title/:title', function (req, res) {

  const title = req.params.title;
  let result = [];

  Object.keys(books).forEach(function(key){

    if(books[key].title === title){
      result.push(books[key]);
    }

  });

  return res.status(200).json(result);

});


// Task 5 - Get book review
public_users.get('/review/:isbn',function (req, res) {

  const isbn = req.params.isbn;

  return res.status(200).json(books[isbn].reviews);

});


// Task 10 - Async/Await version
public_users.get('/async/books', async function (req, res) {

  try {

    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);

  } catch (error) {

    return res.status(500).json({message:"Error retrieving books"});

  }

});


// Task 11 - Promise ISBN
public_users.get('/promise/isbn/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  axios.get(`http://localhost:5000/isbn/${isbn}`)

  .then(response => {

    return res.status(200).json(response.data);

  })

  .catch(error => {

    return res.status(500).json({message:"Error retrieving book by ISBN"});

  });

});


// Task 12 - Promise Author
public_users.get('/promise/author/:author', function (req, res) {

  const author = req.params.author;

  axios.get(`http://localhost:5000/author/${author}`)

  .then(response => {

    return res.status(200).json(response.data);

  })

  .catch(error => {

    return res.status(500).json({message:"Error retrieving books by author"});

  });

});


// Task 13 - Promise Title
public_users.get('/promise/title/:title', function (req, res) {

  const title = req.params.title;

  axios.get(`http://localhost:5000/title/${title}`)

  .then(response => {

    return res.status(200).json(response.data);

  })

  .catch(error => {

    return res.status(500).json({message:"Error retrieving books by title"});

  });

});


module.exports.general = public_users;
