import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MovieCard } from "../components/MovieCard";

export const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(data);
  }, []);

  return (
    <>
      <div className="pattern" />
      <div className="wrapper">
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center cursor-pointer"
          >
            <img src="/back.png" alt="返回" className="w-7 h-7 mb-3" />
          </button>

          <h2>您有 {favorites.length} 部喜歡的電影</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {favorites.length === 0 ? (
            <p className="text-white">你還沒有收藏任何電影喔！</p>
          ) : (
            favorites.map((movie) => <MovieCard key={movie.id} movie={movie} />)
          )}
        </div>
      </div>
    </>
  );
};
