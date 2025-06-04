import React, { useState, useEffect } from "react";
import Link from "next/link";
import BookCard from "./BookCard";
import { Book } from "./Book";
import BookSearch from './BookSearch';

function ShowBookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    loadAllBooks();
  }, []);

  const loadAllBooks = () => {
    setIsLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books`)
      .then((res) => res.json())
      .then((books) => {
        setBooks(books);
      })
      .catch((err) => {
        console.error("Error from ShowBookList: " + err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSearchResults = (searchResults: Book[]): void => {
    setBooks(searchResults);
  };

  const handleLoadingChange = (loading: boolean): void => {
    setIsLoading(loading);
  };

  const bookList =
    books.length === 0
      ? "There is no book record!"
      : books.map((book, k) => <BookCard book={book} key={k} />);

  return (
    <div className="ShowBookList">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <br />
            <h2 className="display-4 text-center">SPEED</h2>
          </div>
          <div className="col-md-11">
            <Link href="/create-book" className="btn btn-outline-warning float-right">
              + Add New Article Entry
            </Link>
            <br />
            <br />
            <hr />
          </div>
        </div>
        
        {/* Search Component */}
        <div className="row">
          <div className="col-md-12">
            <BookSearch 
              onSearchResults={handleSearchResults}
              onLoadingChange={handleLoadingChange}
            />
            <br />
          </div>
        </div>

        <div className="list">
          {isLoading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <p className="mt-2">Loading books...</p>
            </div>
          ) : (
            bookList
          )}
        </div>
      </div>
    </div>
  );
}

export default ShowBookList;