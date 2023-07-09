const express = require("express");
const app = express();
const { Pool } = require("pg");
require("dotenv").config();

const dbPassword = process.env.DB_PASSWORD;

// Create a new pool for connecting to the PostgreSQL database
const pool = new Pool({
	user: "postgres",
	host: "localhost",
	database: "bookstore_database",
	password: dbPassword,
	port: 5432, // Replace with your database port if necessary
});

// Enable CORS middleware
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "http://localhost:3000");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	next();
});

// Set up middleware to parse JSON request bodies
app.use(express.json());

// Define a route to fetch all books
app.get("/api/books", async (req, res) => {
	try {
		// Query the database to fetch all books
		const { rows } = await pool.query("SELECT * FROM catalog");

		// Return the books as a JSON response
		res.json(rows);
	} catch (error) {
		console.error("Error fetching books:", error);
		res.status(500).json({ error: "Failed to fetch books" });
	}
});

// Retrieve detailed book information based on book ID

app.get("/api/catalog/:bookID", async (req, res) => {
	const { bookID } = req.params;
	try {
		// Query the database to fetch the book with the specified ID
		const { rows } = await pool.query("SELECT * FROM catalog WHERE id = $1", [
			bookID,
		]);

		// Check if a book with the specified ID exists
		if (rows.length === 0) {
			return res.status(404).json({ error: "Book not found" });
		}

		// Return the book as a JSON response
		res.json(rows[0]);
	} catch (error) {
		console.error("Error fetching book details:", error);
		res.status(500).json({ error: "Failed to fetch book details" });
	}
});

// Add a book to the user's cart
app.post("/api/cart", async (req, res) => {
	// Retrieve the book ID from the request body
	const { bookID } = req.body;

	try {
		// Add the book to the user's cart table in the database
		await pool.query("INSERT INTO cart (bookID) VALUES ($1)", [bookID]);

		// Return a success response
		res.json({ message: "Book added to cart" });
	} catch (error) {
		console.error("Error adding book to cart:", error);
		res.status(500).json({ error: "Failed to add book to cart" });
	}
});

// Remove a book from the user's cart
app.delete("/api/cart", async (req, res) => {
	// Retrieve the book ID from the request body
	const { bookID } = req.body;

	try {
		// Remove the book from the user's cart
		await pool.query("DELETE FROM cart WHERE bookID = $1", [bookID]);

		// Return a success response
		res.json({ message: "Book removed from cart" });
	} catch (error) {
		console.error("Error removing book from cart:", error);
		res.status(500).json({ error: "Failed to remove book from cart" });
	}
});

// Process the checkout and place the order
app.post("/api/checkout", async (req, res) => {
	// Retrieve the user's cart from the request body
	const { cartItems, userDetails } = req.body;

	try {
		// Insert the user details into the orders table
		const { rows: orderRows } = await pool.query(
			"INSERT INTO orders (user_id, order_date) VALUES ($1, NOW()) RETURNING id",
			[userDetails.id]
		);

		const orderID = orderRows[0].id;

		// Insert the cart items into the order_items table
		for (const cartItem of cartItems) {
			await pool.query(
				"INSERT INTO order_items (order_id, book_id) VALUES ($1, $2)",
				[orderID, cartItem.bookID]
			);
		}

		// Clear the user's cart by deleting all items from the cart table
		await pool.query("DELETE FROM cart WHERE user_id = $1", [userDetails.id]);

		// Return a success response
		res.json({ message: "Order placed successfully" });
	} catch (error) {
		console.error("Error placing order:", error);
		res.status(500).json({ error: "Failed to place order" });
	}
});

// Start the server
const port = 8000; // Choose a port number
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
