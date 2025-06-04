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
        src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d"
        alt="Books"
        height={200}
        className="img-fluid"
      />
      <div className="desc mt-2">
        <h2>{book.title}</h2>
        <h3>{book.author}</h3>
        <p>{book.description}</p>
      </div>
    </div>
  );
};

export default BookCard;