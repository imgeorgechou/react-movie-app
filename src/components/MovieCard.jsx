import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export const MovieCard = ({
  movie: {
    title,
    vote_average,
    poster_path,
    release_date,
    original_language,
    id,
  },
}) => {
  const handleFavoriteToggle = () => {
    // 從 localStorage 獲取已收藏的電影
    const existing = JSON.parse(localStorage.getItem("favorites")) || [];
    // 檢查是否已經收藏
    const isFavorited = existing.find((m) => m.id === id);

    // 判斷是否已經加入收藏
    let updated;
    if (isFavorited) {
      // 移除
      updated = existing.filter((m) => m.id !== id);
      setLike(!like);
      toast.error("已移除收藏"); // 移除收藏時顯示
    } else {
      // 加入
      updated = [
        ...existing,
        {
          id,
          title,
          vote_average,
          poster_path,
          release_date,
          original_language,
        },
      ];
      setLike(!like);
      toast.success("已加入收藏"); // 加入收藏時顯示
    }

    localStorage.setItem("favorites", JSON.stringify(updated));
  };
  const existing = JSON.parse(localStorage.getItem("favorites")) || [];
  const isFavorited = existing.find((m) => m.id === id);
  const [like, setLike] = useState(isFavorited);
  return (
    <Link
      to={`/details/${id}`}
      className="movie-card hover:scale-105 hover:border-purple-800 hover:border-2 transition-transform duration-300"
    >
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : `/no-movie.png`
        }
        alt={title}
      />
      <div className="mt-4 flex justify-between">
        <h3>{title}</h3>
        {/* onClick裡是放function */}
        <button
          className="text-2xl z-10 cursor-pointer hover:scale-120  transition-transform duration-300 "
          onClick={(e) => {
            e.preventDefault(); // 阻止了 Link 的跳轉行為
            handleFavoriteToggle();
          }}
        >
          {like ? "❤️" : "🤍"}
        </button>
      </div>
      <div className="content">
        <div className="rating">
          <img src="star.svg" alt="star" />
          <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
        </div>
        <span>•</span>
        <p className="lang">{original_language}</p>
        <span>•</span>
        <p className="year">
          {release_date ? release_date.split("-")[0] : "N/A"}
        </p>
      </div>
    </Link>
  );
};
