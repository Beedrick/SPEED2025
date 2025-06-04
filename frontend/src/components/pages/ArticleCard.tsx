import React from "react";
import { useRouter } from "next/navigation";
import { Article } from "../utils/Article";

interface IProp {
  article?: Article;
}

const ArticleCard = ({ article }: IProp) => {
  const router = useRouter();

  if (!article) return null;

  const onClick = () => {
    router.push(`/show-article/${article._id}`);
  };

  return (
    <div
      className="card p-3 shadow-sm h-100"
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className="card-body">
        <h5 className="card-title">{article.title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{article.authors}</h6>
        <p className="card-text"><strong>Claim:</strong> {article.claim}</p>

        <div className="d-flex justify-content-between mt-3">
          <span className="badge bg-primary">{article.practice}</span>
          <span className="badge bg-secondary">{article.result}</span>
        </div>

        <div className="mt-2 text-muted" style={{ fontSize: "0.85rem" }}>
          Year: {article.year} | DOI: {article.doi}
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
