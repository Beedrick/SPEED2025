import React from "react";
import { useRouter } from "next/navigation";
import { Book } from "./Book";

interface IProp {
  book?: Book;
}

const BookCard = ({ book }: IProp) => {
  const router = useRouter();

  if (!book) {
    return null;
  }

  const onClick = () => {
    router.push(`/show-book/${book._id}`);
  };

  return (
    <div className="card-container" onClick={onClick} style={{ cursor: "pointer" }}>
      <img
        src="https://d4804za1f1gw.cloudfront.net/wp-content/uploads/sites/50/2018/11/hero.jpg"
        alt="Books"
        height={200}
        className="img-fluid"
      />
      <div className="desc mt-2">
        <h2>{book.title}</h2>
        <h3>
          {book.authors
          .map((author) => {
            const parts = author.trim().split(" ");
            const firstInitial = parts[0]?.charAt(0).toUpperCase() + ".";
            const lastName = parts.slice(1).join(" ");
            return `${firstInitial} ${lastName}`;
          })
          .join(", ")}
        </h3>
      </div>
    </div>
  );
};

export default BookCard;