import React, { useState, useEffect } from "react";
import SortableTable from "../../components/table/SortableTable";
import styles from "./SearchPage.module.scss";

interface Article {
  title: string;
  authors: string;
  year: number;
  journal: string;
  practice: string;
  claim: string;
  result: string;
  researchType: string;
  participantType: string;
  rating: number;
}

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  const headers = [
    { key: "title", label: "Title" },
    { key: "authors", label: "Authors" },
    { key: "year", label: "Year" },
    { key: "journal", label: "Journal" },
    { key: "practice", label: "Practice" },
    { key: "claim", label: "Claim" },
    { key: "result", label: "Result" },
    { key: "researchType", label: "Research Type" },
    { key: "participantType", label: "Participant Type" },
    { key: "rating", label: "Rating" },
  ];

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error(error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Search Articles</h1>
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Search by title, author, or practice..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className={styles.results}>
        {results.length > 0 ? (
          <SortableTable headers={headers} data={results} />
        ) : (
          !loading && <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
