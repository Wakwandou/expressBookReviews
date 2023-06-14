const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    if (!isValid(username)) {
        return res.status(400).json({ error: 'Username is invalid' });
    }
    let user_keys = Object.keys(users)
    user_keys.forEach((key) => {
        if (users[key].username === username) {
            return res.status(400).json({ error: "Username already exists"});
        }
    });
    users.push({"username":username, "password":password})
    res.send("User registered successfully")
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let book_keys = Object.keys(books)
    const matching_books = []
    book_keys.forEach((key) => {
        if (books[key].author === author) {
            matching_books.push(books[key]);
        }
    });
    res.send(matching_books)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let book_keys = Object.keys(books)
    const matching_books = []
    book_keys.forEach((key) => {
      if (books[key].title === title) {
          matching_books.push(books[key]);
      }
    });
    res.send(matching_books)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews)
});

// Task 10
public_users.get('/promise',function (req, res) {
    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
    });
    get_books.then(() => console.log("Promise for task 10 resolved"));
});

// Task 11
public_users.get('/promise/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(books[isbn]));
    });
    get_books.then(() => console.log("Promise for task 11 resolved"));
});

// Task 12
public_users.get('/promise/author/:author',function (req, res) {
    const author = req.params.author;
    const get_books = new Promise((resolve, reject) => {
        let book_keys = Object.keys(books)
        const matching_books = []
        book_keys.forEach((key) => {
            if (books[key].author === author) {
                matching_books.push(books[key]);
            }
        });
        resolve(res.send(matching_books));
    });
    get_books.then(() => console.log("Promise for task 12 resolved"));
});

// Task 13
public_users.get('/promise/title/:title',function (req, res) {
    const title = req.params.title;
    const get_books = new Promise((resolve, reject) => {
        let book_keys = Object.keys(books)
        const matching_books = []
        book_keys.forEach((key) => {
            if (books[key].title === title) {
                matching_books.push(books[key]);
            }
        });
        resolve(res.send(matching_books));
    });
    get_books.then(() => console.log("Promise for task 13 resolved"));
});

module.exports.general = public_users;
