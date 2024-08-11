// router/general.js
const express = require('express');
const general = express.Router();
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
const public_users = express.Router();

let users = {
    "testuser": { username: "testuser", password: "testpass" }
};

general.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    if (username && password) {
      if (!users[username]) {
        users[username] = { username: username, password: password };
        return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
        return res.status(400).json({message: "User already exists!"});
      }
    } else {
      return res.status(400).json({message: "Username and password are required"});
    }
});  

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});  

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        if (books[isbn]) {
            res.json(books[isbn]);
        } else {
            res.status(404).json({message: "Book not found"});
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});  
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    try {
        const author = req.params.author;
        const booksByAuthor = [];
  
        const isbns = Object.keys(books);
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
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
  
// Get book details based on title
public_users.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title.toLowerCase();
        const foundBooks = [];
  
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
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

general.use('/', public_users);
module.exports.general = general;
module.exports.users = users;
