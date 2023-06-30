import React, { useEffect, useState } from 'react';
import './catalog.css'; // Import CSS file

const Catalog = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/books');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleSearchInputChange = event => {
    setSearchTerm(event.target.value);
  };

  const handleSortOptionChange = event => {
    setSortOption(event.target.value);
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.authors.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortOption === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sortOption === 'author') {
      return a.authors.localeCompare(b.authors);
    } else {
      return 0;
    }
  });

  return (
    <div className="catalog">
      <h1>Book Catalog</h1>
      <div className="filters">
        <input
          type="text"
          placeholder="Search by title or author"
          value={searchTerm}
          onChange={handleSearchInputChange}
        />
        <select value={sortOption} onChange={handleSortOptionChange}>
          <option value="">Sort by</option>
          <option value="title">Title</option>
          <option value="author">Author</option>
        </select>
      </div>
      {sortedBooks.length === 0 ? (
        <p>No books available</p>
      ) : (
        <ul>
          {sortedBooks.map(book => (
            <li key={book.id}>
              <h3>{book.title}</h3>
              <p>Author(s): {book.authors}</p>
              <p>ISBN: {book.isbn}</p>
              <p>Publisher: {book.publisher}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Catalog;
