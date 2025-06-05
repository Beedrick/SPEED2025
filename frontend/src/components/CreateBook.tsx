import React, { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Book, DefaultEmptyBook } from "./Book";

// Options for dropdowns
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

const CreateBookComponent = () => {
  const navigate = useRouter();
  const [book, setBook] = useState<Book>({
    ...DefaultEmptyBook,
    se_practices: [],
    claims: [],
  });

  // Add authors
  const [authorsInput, setAuthorsInput] = useState('');
  
  // Add errors state for validation
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Add the checkbox handler function HERE (inside the component)
  const handleCheckboxChange = (
    name: "se_practices" | "claims",
    value: string,
    checked: boolean
  ) => {
    const currentArray = book[name] || [];
    let newArray: string[];

    if (checked) {
      // Add the value if it's not already in the array
      newArray = currentArray.includes(value) 
        ? currentArray 
        : [...currentArray, value];
    } else {
      // Remove the value from the array
      newArray = currentArray.filter(item => item !== value);
    }

    setBook({ ...book, [name]: newArray });
    
    // Clear error for this field when user makes a selection
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }

    if (name === "year_of_publication") {
      setBook({ ...book, [name]: parseInt(value) || 0 });
    } else if (name === "authors") {
      setAuthorsInput(value);
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

    const preparedBook = {
      ...book,
      authors: authorsInput.split(',').map((a) => a.trim()).filter((a) => a !== ''),
    };

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(preparedBook)
    })
    .then((res) => {
      console.log(res);
      setBook(DefaultEmptyBook);
      setAuthorsInput('');
      setErrors({});
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
              Show Articles
            </Link>
          </div>
          <div className="col-md-10 m-auto">
            <h1 className="display-4 text-center">Add Article</h1>
            <p className="lead text-center">Submit new research article</p>
            <form noValidate onSubmit={onSubmit}>
              {/* Title */}
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Title of the Article *"
                  name="title"
                  className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                  value={book.title}
                  onChange={onChange}
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>
              <br />

              {/* Authors */}
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Authors (comma-separated) *"
                  name="authors"
                  className={`form-control ${errors.authors ? 'is-invalid' : ''}`}
                  value={authorsInput}
                  onChange={onChange}
                />
                {errors.authors && <div className="invalid-feedback">{errors.authors}</div>}
              </div>
              <br />

              {/* SE Practices Checkboxes */}
              <div className="form-group">
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

              {/* Claims Checkboxes */}
              <div className="form-group">
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
                <small className="form-text text-muted">
                  Selected: {book.claims?.join(", ") || "None"}
                </small>
                {errors.claims && <div className="text-danger small mt-1">{errors.claims}</div>}
              </div>
              <br />

              {/* Journal/Conference */}
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Journal or Conference Name *"
                  name="journal_conference"
                  className={`form-control ${errors.journal_conference ? 'is-invalid' : ''}`}
                  value={book.journal_conference}
                  onChange={onChange}
                />
                {errors.journal_conference && <div className="invalid-feedback">{errors.journal_conference}</div>}
              </div>
              <br />

              {/* Year */}
              <div className="form-group">
                <input
                  type="number"
                  placeholder="Year of Publication *"
                  name="year_of_publication"
                  className={`form-control ${errors.year_of_publication ? 'is-invalid' : ''}`}
                  value={book.year_of_publication || ""}
                  onChange={onChange}
                />
                {errors.year_of_publication && <div className="invalid-feedback">{errors.year_of_publication}</div>}
              </div>
              <br />

              {/* Volume */}
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Volume (optional)"
                  name="volume"
                  className="form-control"
                  value={book.volume || ""}
                  onChange={onChange}
                />
              </div>
              <br />

              {/* Number */}
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Number (optional)"
                  name="number"
                  className="form-control"
                  value={book.number || ""}
                  onChange={onChange}
                />
              </div>
              <br />

              {/* Pages */}
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Pages (optional)"
                  name="pages"
                  className="form-control"
                  value={book.pages || ""}
                  onChange={onChange}
                />
              </div>
              <br />

              {/* DOI */}
              <div className="form-group">
                <input
                  type="text"
                  placeholder="DOI *"
                  name="doi"
                  className={`form-control ${errors.doi ? 'is-invalid' : ''}`}
                  value={book.doi}
                  onChange={onChange}
                />
                {errors.doi && <div className="invalid-feedback">{errors.doi}</div>}
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