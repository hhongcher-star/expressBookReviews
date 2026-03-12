const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];


// Task 7 part 1
const isValid = (username)=>{ 
// check if username already exists
let filtered_users = users.filter((user)=> user.username === username);
if(filtered_users.length > 0){
return true;
}else{
return false;
}
}


// Task 7 part 2
const authenticatedUser = (username,password)=>{ 

let filtered_users = users.filter((user)=> user.username === username && user.password === password);

if(filtered_users.length > 0){
return true;
}else{
return false;
}

}


// only registered users can login
regd_users.post("/login", (req,res) => {

const username = req.body.username;
const password = req.body.password;

if(!username || !password){
return res.status(400).json({message:"Username or password missing"});
}

if(authenticatedUser(username,password)){

let accessToken = jwt.sign(
{data:username},
"access",
{expiresIn:60*60}
);

req.session.authorization = {
accessToken,
username
};

return res.status(200).json({message:"User successfully logged in"});
}

return res.status(404).json({message:"Invalid login credentials"});

});


// Task 8 - Add / Modify review
regd_users.put("/auth/review/:isbn", (req, res) => {

const isbn = req.params.isbn;
const review = req.query.review;
const username = req.session.authorization.username;

books[isbn].reviews[username] = review;

return res.status(200).json({message:"Review added or updated successfully"});

});

// Task 9 - Delete review
regd_users.delete("/auth/review/:isbn", (req, res) => {

const isbn = req.params.isbn;
const username = req.session.authorization.username;

if(books[isbn].reviews[username]){

delete books[isbn].reviews[username];

return res.status(200).json({
message:"Review deleted successfully"
});

}

return res.status(404).json({
message:"No review found for this user"
});

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;