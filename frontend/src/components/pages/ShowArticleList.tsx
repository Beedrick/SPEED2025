import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Article, DefaultEmptyArticle } from '../utils/Article';

function ShowArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles`)
      .then((res) => res.json())
      .then((data) => setArticles(data))
      .catch((err) => console.error('Error fetching articles:', err));
  }, []);

  const filteredArticles = articles.filter((article) =>
    (article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (article.claim?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  return (
    <div className="container">
      <h1>SPEED2025</h1>

      <div className="mb-3">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
        />
      </div>

      <div className="text-end mb-3">
        <Link href="/create-article" className="btn btn-success">
          Create New Article
        </Link>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Claim</th>
          </tr>
        </thead>
        <tbody>
          {filteredArticles.map((article) => (
            <tr key={article._id}>
              <td>{article.title}</td>
              <td>{article.claim}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ShowArticleList;
