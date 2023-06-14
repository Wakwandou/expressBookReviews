const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return true;
}

const authenticatedUser = (username, password)=>{ //returns boolean
    let verify = false;
    let user_keys = Object.keys(users)
    user_keys.forEach((key) => {
        if (users[key].username === username && users[key].password === password) {
            verify = true;
            return;
        }
    });
    return verify;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username) {
        return res.status(404).send({message: "Body Empty"});
    }
    if(authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(404).send({message: "Authentication failed"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization;
    const isbn = req.params.isbn;
    const review = req.body.review;
    let book = books[isbn];
    if(!book) {
        return res.status(404).send({ message: "Book with given ISBN not found." });
    }
    book.reviews[username] = review;
    return res.status(200).send("Your review has been integrated");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization;
    const isbn = req.params.isbn;
    let book = books[isbn];
    if(!book) {
        return res.status(404).send({ message: "Book with given ISBN not found." });
    }
    if(!book.reviews[username]) {
        return res.status(404).send({ message: "You have not reviewed this book yet." });
    }
    delete book.reviews[username];
    return res.status(200).send({ message: "Your review has been deleted." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
