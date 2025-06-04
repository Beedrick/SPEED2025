import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Article, DefaultEmptyArticle } from '../utils/Article';

function UpdateArticleInfo() {
  const [article, setArticle] = useState<Article>(DefaultEmptyArticle);
  const id = useParams<{ id: string }>().id;
  const router = useRouter();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/${id}`)
      .then((res) => res.json())
      .then((json) => setArticle(json))
      .catch((err) => console.error('Error from UpdateArticleInfo: ' + err));
  }, [id]);

  const inputOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setArticle({ ...article, [event.target.name]: event.target.value });
  };

  const textAreaOnChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setArticle({ ...article, [event.target.name]: event.target.value });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(article),
    })
      .then(() => {
        router.push(`/show-article/${id}`);
      })
      .catch((err) => console.error('Error updating article: ' + err));
  };

  return (
    <div className="UpdateArticleInfo">
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <br />
            <Link href="/" className="btn btn-outline-warning float-left">
              Show Article List
            </Link>
          </div>
          <div className="col-md-8 m-auto">
            <h1 className="display-4 text-center">Edit Article</h1>
            <p className="lead text-center">Update SPEED Article Information</p>
          </div>
        </div>

        <div className="col-md-8 m-auto">
          <form noValidate onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                placeholder="Title of the Article"
                name="title"
                className="form-control"
                value={article.title}
                onChange={inputOnChange}
              />
            </div>
            <br />

            <div className="form-group">
              <label htmlFor="authors">Authors</label>
              <input
                type="text"
                placeholder="Authors (comma-separated)"
                name="authors"
                className="form-control"
                value={article.authors}
                onChange={inputOnChange}
              />
            </div>
            <br />

            <div className="form-group">
              <label htmlFor="claim">Claim</label>
              <textarea
                placeholder="Claim made in the article"
                name="claim"
                className="form-control"
                value={article.claim}
                onChange={textAreaOnChange}
              />
            </div>
            <br />

            <div className="form-group">
              <label htmlFor="practice">Practice</label>
              <input
                type="text"
                placeholder="Associated SE Practice"
                name="practice"
                className="form-control"
                value={article.practice}
                onChange={inputOnChange}
              />
            </div>
            <br />

            <div className="form-group">
              <label htmlFor="result">Result</label>
              <textarea
                placeholder="Result or evidence from the article"
                name="result"
                className="form-control"
                value={article.result}
                onChange={textAreaOnChange}
              />
            </div>
            <br />

            <div className="form-group">
              <label htmlFor="year">Year</label>
              <input
                type="number"
                placeholder="Year of Publication"
                name="year"
                className="form-control"
                value={article.year ?? ''}
                onChange={inputOnChange}
              />
            </div>
            <br />

            <div className="form-group">
              <label htmlFor="doi">DOI</label>
              <input
                type="text"
                placeholder="DOI (if available)"
                name="doi"
                className="form-control"
                value={article.doi}
                onChange={inputOnChange}
              />
            </div>
            <br />

            <button type="submit" className="btn btn-outline-info btn-lg btn-block">
              Update Article
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateArticleInfo;
