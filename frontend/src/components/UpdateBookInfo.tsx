import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Book, DefaultEmptyBook } from './Book';

function UpdateBookInfo() {
  const [book, setBook] = useState<Book>(DefaultEmptyBook);
  const id = useParams<{ id: string }>().id;
  const router = useRouter();

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/books/${id}`)
      .then((res) => res.json())
      .then((json) => setBook(json))
      .catch((err) => console.log('Error from UpdateBookInfo: ' + err));
  }, [id]);

  const inputOnChange = (event: ChangeEvent<HTMLInputElement>) => {
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
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    })
      .then(() => {
        router.push(`/show-book/${id}`);
      })
      .catch((err) => console.log('Error from UpdateBookInfo: ' + err));
  };

  return (
    <div className='UpdateBookInfo'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-8 m-auto'>
            <br />
            <Link href='/' className='btn btn-outline-warning float-left'>
              Show Article List
            </Link>
          </div>
          <div className='col-md-8 m-auto'>
            <h1 className='display-4 text-center'>Edit Article</h1>
            <p className='lead text-center'>Update Article's Info</p>
          </div>
        </div>

        <div className='col-md-8 m-auto'>
          <form noValidate onSubmit={onSubmit}>
            <div className='form-group'>
              <label htmlFor='title'>Title</label>
              <input
                type='text'
                placeholder='Title of the Article'
                name='title'
                className='form-control'
                value={book.title}
                onChange={inputOnChange}
              />
            </div>
            <br />

            <div className='form-group'>
              <label htmlFor='authors'>Authors</label>
              <input
                type='text'
                placeholder='Authors (comma-separated)'
                name='authors'
                className='form-control'
                value={Array.isArray(book.authors) ? book.authors.join(', ') : ''}
                onChange={inputOnChange}
              />
            </div>
            <br />

            <div className='form-group'>
              <label htmlFor='journal_conference'>Journal/Conference</label>
              <input
                type='text'
                placeholder='Journal or Conference Name'
                name='journal_conference'
                className='form-control'
                value={book.journal_conference}
                onChange={inputOnChange}
              />
            </div>
            <br />

            <div className='form-group'>
              <label htmlFor='year_of_publication'>Year of Publication</label>
              <input
                type='number'
                placeholder='Year of Publication'
                name='year_of_publication'
                className='form-control'
                value={book.year_of_publication || ''}
                onChange={inputOnChange}
              />
            </div>
            <br />

            <div className='form-group'>
              <label htmlFor='volume'>Volume</label>
              <input
                type='text'
                placeholder='Volume (optional)'
                name='volume'
                className='form-control'
                value={book.volume || ''}
                onChange={inputOnChange}
              />
            </div>
            <br />

            <div className='form-group'>
              <label htmlFor='number'>Number</label>
              <input
                type='text'
                placeholder='Number (optional)'
                name='number'
                className='form-control'
                value={book.number || ''}
                onChange={inputOnChange}
              />
            </div>
            <br />

            <div className='form-group'>
              <label htmlFor='pages'>Pages</label>
              <input
                type='text'
                placeholder='Pages (optional)'
                name='pages'
                className='form-control'
                value={book.pages || ''}
                onChange={inputOnChange}
              />
            </div>
            <br />

            <div className='form-group'>
              <label htmlFor='doi'>DOI</label>
              <input
                type='text'
                placeholder='DOI'
                name='doi'
                className='form-control'
                value={book.doi}
                onChange={inputOnChange}
              />
            </div>
            <br />

            <button type='submit' className='btn btn-outline-info btn-lg btn-block'>
              Update Article
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateBookInfo;