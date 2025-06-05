import React, { ChangeEvent, FormEvent, useState, useRef } from "react";
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

interface BibTexEntry {
  id: string;
  type: string;
  title?: string;
  author?: string;
  year?: string;
  journal?: string;
  booktitle?: string;
  volume?: string;
  number?: string;
  pages?: string;
  doi?: string;
  [key: string]: any;
}

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

  // BibTeX upload states
  const [inputMode, setInputMode] = useState<'manual' | 'bibtex'>('manual');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simple BibTeX parser
  const parseBibTeX = (content: string): BibTexEntry[] => {
  const entries: BibTexEntry[] = [];
  const entryRegex = /@(\w+)\s*\{\s*([^,]+)\s*,\s*([\s\S]*?)\n\s*\}/g;
  let match;

  while ((match = entryRegex.exec(content)) !== null) {
    const [, type, id, fieldsStr] = match;
    const entry: BibTexEntry = { id: id.trim(), type: type.toLowerCase() };

    // Parse fields - updated regex to handle more field formats
    const fieldRegex = /(\w+)\s*=\s*\{([^}]*)\}|(\w+)\s*=\s*"([^"]*)"|(\w+)\s*=\s*([^,\n}]+)/g;
    let fieldMatch;

    while ((fieldMatch = fieldRegex.exec(fieldsStr)) !== null) {
      const fieldName = (fieldMatch[1] || fieldMatch[3] || fieldMatch[5] || '').toLowerCase();
      const fieldValue = (fieldMatch[2] || fieldMatch[4] || fieldMatch[6] || '').trim();
      
      // Handle custom fields
      if (fieldName === 'claims' || fieldName === 'se_practices') {
        // Split comma-separated values and clean them up
        entry[fieldName] = fieldValue.split(',').map(item => item.trim()).filter(item => item.length > 0);
      } else if (fieldName === 'note') {
        // Parse note field for embedded custom fields
        entry[fieldName] = fieldValue;
        
        // Look for Claims: and SE Practices: in the note
        const claimsMatch = fieldValue.match(/Claims:\s*([^;]+)/i);
        const practicesMatch = fieldValue.match(/SE Practices:\s*([^;]+)/i);
        
        if (claimsMatch) {
          entry.claims = claimsMatch[1].split(',').map(item => item.trim()).filter(item => item.length > 0);
        }
        
        if (practicesMatch) {
          entry.se_practices = practicesMatch[1].split(',').map(item => item.trim()).filter(item => item.length > 0);
        }
      } else {
        entry[fieldName] = fieldValue;
      }
    }

    entries.push(entry);
  }

  return entries;
};

  // Handle BibTeX file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.bib')) {
      setErrors({ ...errors, bibtex: 'Please upload a .bib file' });
      return;
    }

    setUploadedFile(file);
    setIsProcessing(true);
    setErrors({ ...errors, bibtex: '' });

    try {
      const content = await file.text();
      const entries = parseBibTeX(content);
      
      if (entries.length === 0) {
        setErrors({ ...errors, bibtex: 'No valid BibTeX entries found in the file' });
        return;
      }

      // Use the first entry to populate the form
      const entry = entries[0];
      
      // Convert BibTeX entry to Book format
      const populatedBook: Book = {
        ...DefaultEmptyBook,
        title: entry.title || '',
        journal_conference: entry.journal || entry.booktitle || '',
        year_of_publication: entry.year ? parseInt(entry.year) : undefined,
        volume: entry.volume || '',
        number: entry.number || '',
        pages: entry.pages || '',
        doi: entry.doi || '',
        // Now properly handle the custom fields
        se_practices: Array.isArray(entry.se_practices) ? entry.se_practices : [],
        claims: Array.isArray(entry.claims) ? entry.claims : [],
      };

      // Handle authors
      let authorsArray: string[] = [];
      if (entry.author) {
        authorsArray = entry.author.split(' and ').map(author => {
          // Handle "Last, First" format and convert to "First Last"
          if (author.includes(',')) {
            const parts = author.split(',');
            return `${parts[1].trim()} ${parts[0].trim()}`;
          }
          return author.trim();
        });
      }

      setBook(populatedBook);
      setAuthorsInput(authorsArray.join(', '));

      // If multiple entries, show a message
      if (entries.length > 1) {
        console.log(`Found ${entries.length} entries. Using the first one: ${entry.title}`);
      }

    } catch (error) {
      console.error('Error parsing BibTeX file:', error);
      setErrors({ ...errors, bibtex: 'Error parsing BibTeX file. Please check the file format.' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Clear uploaded file and reset form
  const handleClearFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setBook({ ...DefaultEmptyBook, se_practices: [], claims: [] });
    setAuthorsInput('');
    setErrors({});
  };

  // Handle input mode change
  const handleModeChange = (mode: 'manual' | 'bibtex') => {
    setInputMode(mode);
    if (mode === 'manual') {
      handleClearFile();
    }
  };

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
      setUploadedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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

            {/* Input Mode Toggle */}
            <div className="mb-4">
              <div className="btn-group w-100" role="group">
                <input
                  type="radio"
                  className="btn-check"
                  name="inputMode"
                  id="manualMode"
                  checked={inputMode === 'manual'}
                  onChange={() => handleModeChange('manual')}
                />
                <label className="btn btn-outline-primary" htmlFor="manualMode">
                  Manual Entry
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="inputMode"
                  id="bibtexMode"
                  checked={inputMode === 'bibtex'}
                  onChange={() => handleModeChange('bibtex')}
                />
                <label className="btn btn-outline-primary" htmlFor="bibtexMode">
                  Upload BibTeX File
                </label>
              </div>
            </div>

            {/* BibTeX Upload Section */}
            {inputMode === 'bibtex' && (
              <div className="mb-4 p-3 border rounded bg-light">
                <h5>Upload BibTeX File</h5>
                <div className="mb-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    className={`form-control ${errors.bibtex ? 'is-invalid' : ''}`}
                    accept=".bib"
                    onChange={handleFileUpload}
                  />
                  <div className="form-text">
                    Select a .bib file to automatically populate the form fields below.
                  </div>
                  {errors.bibtex && <div className="invalid-feedback">{errors.bibtex}</div>}
                </div>

                {uploadedFile && (
                  <div className="alert alert-success d-flex justify-content-between align-items-center">
                    <div>
                      <strong>✓ File uploaded:</strong> {uploadedFile.name}
                      <br />
                      <small className="text-muted">Form fields have been populated. Please review and select SE Practices & Claims below.</small>
                    </div>
                    <button
                      onClick={handleClearFile}
                      className="btn btn-sm btn-outline-secondary"
                      type="button"
                    >
                      Clear
                    </button>
                  </div>
                )}

                {isProcessing && (
                  <div className="text-center">
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Processing...</span>
                    </div>
                    <span>Processing BibTeX file...</span>
                  </div>
                )}
              </div>
            )}

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