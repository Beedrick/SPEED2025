import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Book, DefaultEmptyBook } from './Book';

function ShowBookDetails() {
  const [book, setBook] = useState<Book>(DefaultEmptyBook);
  const id = useParams<{ id: string }>().id;
  const navigate = useRouter();

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/books/${id}`)
      .then((res) => res.json())
      .then((json) => setBook(json))
      .catch((err) => console.log('Error from ShowBookDetails: ' + err));
  }, [id]);

  const onDeleteClick = (id: string) => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/books/${id}`, { method: 'DELETE' })
      .then(() => navigate.push('/'))
      .catch((err) => console.log('Error from ShowBookDetails_deleteClick: ' + err));
  };

  const BookItem = (
    <div>
      <table className='table table-hover table-dark table-striped table-bordered'>
        <tbody>
          <tr>
            <th scope='row'>1</th>
            <td>Title</td>
            <td>{book.title}</td>
          </tr>
          <tr>
            <th scope='row'>2</th>
            <td>Authors</td>
            <td>{Array.isArray(book.authors) ? book.authors.join(', ') : book.authors}</td>
          </tr>
          <tr>
            <th scope='row'>3</th>
            <td>Journal/Conference</td>
            <td>{book.journal_conference}</td>
          </tr>
          <tr>
            <th scope='row'>4</th>
            <td>Year of Publication</td>
            <td>{book.year_of_publication}</td>
          </tr>
          {/* New rows for SE Practices and Claims */}
          <tr>
            <th scope='row'>5</th>
            <td>SE Practices</td>
            <td>{Array.isArray(book.se_practices) ? book.se_practices.join(', ') : 'N/A'}</td>
          </tr>
          <tr>
            <th scope='row'>6</th>
            <td>Claims</td>
            <td>{Array.isArray(book.claims) ? book.claims.join(', ') : 'N/A'}</td>
          </tr>
          <tr>
            <th scope='row'>7</th>
            <td>Volume</td>
            <td>{book.volume || 'N/A'}</td>
          </tr>
          <tr>
            <th scope='row'>8</th>
            <td>Number</td>
            <td>{book.number || 'N/A'}</td>
          </tr>
          <tr>
            <th scope='row'>9</th>
            <td>Pages</td>
            <td>{book.pages || 'N/A'}</td>
          </tr>
          <tr>
            <th scope='row'>10</th>
            <td>DOI</td>
            <td>{book.doi}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div className='ShowBookDetails'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-10 m-auto'>
            <br />
            <Link href='/' className='btn btn-outline-warning float-left'>
              Show Article List
            </Link>
          </div>
          <div className='col-md-8 m-auto'>
            <h1 className='display-4 text-center'>Article's Record</h1>
            <p className='lead text-center'>View Article's Info</p>
            <hr />
            <br />
          </div>
          <div className='col-md-10 m-auto'>{BookItem}</div>
          <div className='col-md-6 m-auto'>
            <button
              type='button'
              className='btn btn-outline-danger btn-lg btn-block'
              onClick={() => onDeleteClick(book._id || '')}
            >
              Delete Article
            </button>
          </div>
          <div className='col-md-6 m-auto'>
            <Link
              href={`/edit-book/${book._id}`}
              className='btn btn-outline-info btn-lg btn-block'
            >
              Edit Article
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowBookDetails;
