const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
  
    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({message: "Username and password are required"});
    }
  
    // Check if the username already exists
    if (users[username]) {
      return res.status(409).json({message: "Username already exists"});
    }
  
    // Register the new user
    users[username] = { password: password };
  
    return res.status(201).json({message: "User registered successfully"});
  });  

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.json(books);
});  

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    if (books[isbn]) {
      res.json(books[isbn]);
    } else {
      res.status(404).json({message: "Book not found"});
    }
});  
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const booksByAuthor = [];
  
    // Get all the keys (ISBNs) from 'books'
    const isbns = Object.keys(books);
    // Iterate through all authors
    for (const isbn of isbns) {
      if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
        booksByAuthor.push({
          isbn: isbn,
          ...books[isbn]
        });
      }
    }
  
    if (booksByAuthor.length > 0) {
      res.json(booksByAuthor);
    } else {
      res.status(404).json({message: "No books found for this author"});
    }
  });
  
// Get book details based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    const foundBooks = [];
  
    // Iterate through all books
    for (const isbn in books) {
      if (books[isbn].title.toLowerCase().includes(title)) {
        foundBooks.push({
          isbn: isbn,
          ...books[isbn]
        });
      }
    }
  
    if (foundBooks.length > 0) {
      res.json(foundBooks);
    } else {
      res.status(404).json({message: "No books found with this title"});
    }
  });
  
// Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    // Check if the book exists
    if (books[isbn]) {
      // Return the reviews for the book
      res.json(books[isbn].reviews);
    } else {
      res.status(404).json({message: "Book not found"});
    }
  });  

module.exports.general = public_users;
