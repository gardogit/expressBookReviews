// router/auth_users.js
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users;
setTimeout(() => {
    users = require('./general').users;
}, 0);

const isValid = (username) => {
    return users.hasOwnProperty(username);
}

const authenticatedUser = (username, password) => {
    if (!users || !users[username]) {
        return false;
    }
    return users[username].password === password;
}

const SECRET_KEY = 'my_super_secret_key_for_jwt_123!@#'; // only testing

// only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({message: "Username and password are required"});
    }
  
    if (authenticatedUser(username, password)) {
      const token = jwt.sign({username: username}, SECRET_KEY, {expiresIn: '1h'});
      return res.status(200).json({token: token, message: "Login successful"});
    } else {
      return res.status(401).json({message: "Invalid credentials"});
    }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.user.username;
  
    if (!isbn || !review) {
      return res.status(400).json({ message: "ISBN and review are required" });
    }
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }
  
    books[isbn].reviews[username] = review;
  
    return res.status(200).json({ message: "Review added/modified successfully" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;
  
    if (!isbn) {
      return res.status(400).json({ message: "ISBN is required" });
    }
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (books[isbn].reviews && books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "Review not found" });
    }
});

module.exports = regd_users;
module.exports.isValid = isValid;
