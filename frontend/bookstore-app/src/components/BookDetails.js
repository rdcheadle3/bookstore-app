import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './details.css'; // Import CSS file

const BookDetails = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState({null});

  useEffect(() => {
    fetchBookDetails();
  }, []);

  const fetchBookDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/books/${bookId}`);
      const data = await response.json();
      setBook(data);
    } catch (error) {
      console.error('Error fetching book details:', error);
    }
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{book.title}</h2>
      <p>Author(s): {book.authors}</p>
      <p>ISBN: {book.isbn}</p>
      <p>Publisher: {book.publisher}</p>
    </div>
  );
};

export default BookDetails;