import React, { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Book, DefaultEmptyBook } from "./Book";

const CreateBookComponent = () => {
  const navigate = useRouter();
  const [book, setBook] = useState<Book>(DefaultEmptyBook);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    
    if (name === 'authors') {
      // Split comma-separated authors into array
      setBook({ ...book, [name]: value.split(',').map(author => author.trim()) });
    } else if (name === 'year_of_publication') {
      // Convert to number
      setBook({ ...book, [name]: parseInt(value) || 0 });
    } else {
      setBook({ ...book, [name]: value });
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(book);

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book)
    })
      .then((res) => {
        console.log(res);
        setBook(DefaultEmptyBook);
        navigate.push("/");
      })
      .catch((err) => {
        console.error('Error from CreateBook: ' + err);
      });
  };

  return (
    <div className="CreateBook">
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <br />
            <Link href="/" className="btn btn-outline-warning float-left">
              Show Book List
            </Link>
          </div>
          <div className="col-md-10 m-auto">
            <h1 className="display-4 text-center">Add Article</h1>
            <p className="lead text-center">Submit new research article</p>
            <form noValidate onSubmit={onSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Title of the Article"
                  name="title"
                  className="form-control"
                  value={book.title}
                  onChange={onChange}
                />
              </div>
              <br />
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Authors (comma-separated)"
                  name="authors"
                  className="form-control"
                  value={Array.isArray(book.authors) ? book.authors.join(', ') : ''}
                  onChange={onChange}
                />
              </div>
              <br />
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Journal or Conference Name"
                  name="journal_conference"
                  className="form-control"
                  value={book.journal_conference}
                  onChange={onChange}
                />
              </div>
              <br />
              <div className="form-group">
                <input
                  type="number"
                  placeholder="Year of Publication"
                  name="year_of_publication"
                  className="form-control"
                  value={book.year_of_publication || ''}
                  onChange={onChange}
                />
              </div>
              <br />
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Volume (optional)"
                  name="volume"
                  className="form-control"
                  value={book.volume || ''}
                  onChange={onChange}
                />
              </div>
              <br />
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Number (optional)"
                  name="number"
                  className="form-control"
                  value={book.number || ''}
                  onChange={onChange}
                />
              </div>
              <br />
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Pages (optional)"
                  name="pages"
                  className="form-control"
                  value={book.pages || ''}
                  onChange={onChange}
                />
              </div>
              <br />
              <div className="form-group">
                <input
                  type="text"
                  placeholder="DOI"
                  name="doi"
                  className="form-control"
                  value={book.doi}
                  onChange={onChange}
                />
              </div>
              <button
                type="submit"
                className="btn btn-outline-warning btn-block mt-4 mb-4 w-100"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBookComponent;