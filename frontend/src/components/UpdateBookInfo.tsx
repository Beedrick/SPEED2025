'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Book, DefaultEmptyBook } from './Book';

const SE_PRACTICE_OPTIONS = [
  "Test-Driven Development (TDD)",
  "Code Reviews",
  "Continuous Integration (CI)",
  "Pair Programming",
  "Automated Testing",
  "Agile Planning",
];

const CLAIMS_OPTIONS = [
  "Improves code quality",
  "Reduces bugs",
  "Speeds up development",
  "Improves team communication",
  "Increases developer productivity",
];

function UpdateBookInfo() {
  const [book, setBook] = useState<Book>(DefaultEmptyBook);
  const [authorsInput, setAuthorsInput] = useState<string>(''); // Separate state for authors input
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  useEffect(() => {
    if (!id) return;

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${id}`)
      .then((res) => res.json())
      .then((json) => {
        setBook(json);
        // Set the authors input as a comma-separated string
        setAuthorsInput(Array.isArray(json.authors) ? json.authors.join(', ') : '');
      })
      .catch((err) => console.log('Error from UpdateBookInfo:', err));
  }, [id]);

  const handleCheckboxChange = (
    name: 'se_practices' | 'claims',
    value: string,
    checked: boolean
  ) => {
    const currentArray = book[name] || [];
    const newArray = checked
      ? currentArray.includes(value) ? currentArray : [...currentArray, value]
      : currentArray.filter((item) => item !== value);

    setBook({ ...book, [name]: newArray });
  };
  
  const inputOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === 'authors') {
      // Just update the input state, don't split yet
      setAuthorsInput(value);
    } else if (name === 'year_of_publication') {
      setBook({ ...book, year_of_publication: parseInt(value) || 0 });
    } else {
      setBook({ ...book, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Required field validations
    if (!book.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    const authorsArray = authorsInput.split(',').map((item) => item.trim()).filter(item => item.length > 0);
    if (authorsArray.length === 0) {
      newErrors.authors = 'At least one author is required';
    }

    if (!book.journal_conference?.trim()) {
      newErrors.journal_conference = 'Journal/Conference is required';
    }

    if (!book.year_of_publication || book.year_of_publication <= 0) {
      newErrors.year_of_publication = 'Valid year of publication is required';
    }

    if (!book.se_practices || book.se_practices.length === 0) {
      newErrors.se_practices = 'At least one SE practice must be selected';
    }

    if (!book.claims || book.claims.length === 0) {
      newErrors.claims = 'At least one claim must be selected';
    }

    if (!book.doi?.trim()) {
      newErrors.doi = 'DOI is required';
    }

    return newErrors;
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors({});

    // Convert authors input to array before submitting
    const authorsArray = authorsInput.split(',').map((item) => item.trim()).filter(item => item.length > 0);
    const bookToSubmit = { ...book, authors: authorsArray };

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookToSubmit),
    })
      .then(() => router.push(`/show-book/${id}`))
      .catch((err) => console.log('Error from UpdateBookInfo:', err));
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
            {/* Title */}
            <div className='form-group'>
              <label htmlFor='title'>Title *</label>
              <input
                type='text'
                placeholder='Title of the Article'
                name='title'
                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                value={book.title}
                onChange={inputOnChange}
              />
              {errors.title && <div className="invalid-feedback">{errors.title}</div>}
            </div>
            <br />

            {/* Authors */}
            <div className='form-group'>
              <label htmlFor='authors'>Authors *</label>
              <input
                type='text'
                placeholder='Authors (comma-separated)'
                name='authors'
                className={`form-control ${errors.authors ? 'is-invalid' : ''}`}
                value={authorsInput}
                onChange={inputOnChange}
              />
              {errors.authors && <div className="invalid-feedback">{errors.authors}</div>}
            </div>
            <br />

            {/* SE Practices */}
            <div className='form-group'>
              <label>SE Practices *</label>
              <div className={`checkbox-group ${errors.se_practices ? 'border-danger' : ''}`} style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', borderRadius: '4px' }}>
                {SE_PRACTICE_OPTIONS.map((practice) => (
                  <div key={practice} className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`se_practice_${practice}`}
                      checked={book.se_practices?.includes(practice) || false}
                      onChange={(e) => handleCheckboxChange("se_practices", practice, e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor={`se_practice_${practice}`}>
                      {practice}
                    </label>
                  </div>
                ))}
              </div>
              {errors.se_practices && <div className="text-danger small mt-1">{errors.se_practices}</div>}
            </div>
            <br />

            {/* Claims */}
            <div className='form-group'>
              <label>Claims *</label>
              <div className={`checkbox-group ${errors.claims ? 'border-danger' : ''}`} style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', borderRadius: '4px' }}>
                {CLAIMS_OPTIONS.map((claim) => (
                  <div key={claim} className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`claim_${claim}`}
                      checked={book.claims?.includes(claim) || false}
                      onChange={(e) => handleCheckboxChange("claims", claim, e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor={`claim_${claim}`}>
                      {claim}
                    </label>
                  </div>
                ))}
              </div>
              {errors.claims && <div className="text-danger small mt-1">{errors.claims}</div>}
            </div>
            <br />

            {/* Journal/Conference */}
            <div className='form-group'>
              <label htmlFor='journal_conference'>Journal/Conference *</label>
              <input
                type='text'
                name='journal_conference'
                className={`form-control ${errors.journal_conference ? 'is-invalid' : ''}`}
                value={book.journal_conference}
                onChange={inputOnChange}
              />
              {errors.journal_conference && <div className="invalid-feedback">{errors.journal_conference}</div>}
            </div>
            <br />

            {/* Year */}
            <div className='form-group'>
              <label htmlFor='year_of_publication'>Year of Publication *</label>
              <input
                type='number'
                name='year_of_publication'
                className={`form-control ${errors.year_of_publication ? 'is-invalid' : ''}`}
                value={book.year_of_publication || ''}
                onChange={inputOnChange}
              />
              {errors.year_of_publication && <div className="invalid-feedback">{errors.year_of_publication}</div>}
            </div>
            <br />

            {/* Volume */}
            <div className='form-group'>
              <label htmlFor='volume'>Volume</label>
              <input
                type='text'
                name='volume'
                className='form-control'
                value={book.volume || ''}
                onChange={inputOnChange}
              />
            </div>
            <br />

            {/* Number */}
            <div className='form-group'>
              <label htmlFor='number'>Number</label>
              <input
                type='text'
                name='number'
                className='form-control'
                value={book.number || ''}
                onChange={inputOnChange}
              />
            </div>
            <br />

            {/* Pages */}
            <div className='form-group'>
              <label htmlFor='pages'>Pages</label>
              <input
                type='text'
                name='pages'
                className='form-control'
                value={book.pages || ''}
                onChange={inputOnChange}
              />
            </div>
            <br />

            {/* DOI */}
            <div className='form-group'>
              <label htmlFor='doi'>DOI *</label>
              <input
                type='text'
                name='doi'
                className={`form-control ${errors.doi ? 'is-invalid' : ''}`}
                value={book.doi}
                onChange={inputOnChange}
              />
              {errors.doi && <div className="invalid-feedback">{errors.doi}</div>}
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