import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL, API_OPTIONS } from "../config/api";
import { useEffect, useState } from "react";
import { Spinner } from "../components/Spinner.jsx";
import { Trailer } from "../components/Trailer.jsx";

export const Details = () => {
  // useParams用於獲取路由參數
  const { id } = useParams();
  // useNavigate用於導航
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        // 獲取電影詳情
        const response = await fetch(
          `${API_BASE_URL}/movie/${id}?language=zh-TW`,
          API_OPTIONS
        );
        // 獲取電影演員
        const response2 = await fetch(
          `${API_BASE_URL}/movie/${id}/credits?language=zh-TW`,
          API_OPTIONS
        );
        const data = await response.json();
        console.log("API Response:", data); // 添加日誌以檢查API響應
        setMovie(data);

        const data2 = await response2.json();
        console.log("API Response:", data2); // 添加日誌以檢查API響應
        setCredits(data2.cast);
      } catch (error) {
        console.error(`Error fetching movies: ${error}`);
        setError(`Error fetching movies. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieDetails();
  }, [id]);

  // 要檢查movie是否為null，不然會跑出bug
  return loading ? (
    <div className="flex justify-center items-center mt-10">
      <Spinner />
    </div>
  ) : error ? (
    <p className="text-red-500"> {error}</p>
  ) : !movie ? (
    <div className="flex justify-center items-center mt-10">
      <Spinner />
    </div>
  ) : (
    <div className="movie-card ">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center cursor-pointer"
      >
        <img src="/back.png" alt="返回" className="w-7 h-7 mb-3" />
      </button>
      <div className="md:flex md:mx-10 md:gap-5">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
              : `/no-movie.png`
          }
          alt={movie.title}
          className="md:w-[500px] md:h-[800px]"
        />
        <div className="md:ml-5">
          <div className="mt-4">
            <h2 className="md:text-6xl">{movie.title}</h2>
            <p className="text-[16px] text-white">{movie.original_title}</p>
          </div>
          <div className="content">
            <div className="rating">
              <img src="/star.svg" alt="star" />
              <p>
                {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
              </p>
            </div>
            <span>•</span>
            <p className="lang">{movie.original_language}</p>
            <span>•</span>
            <p className="year">
              {movie.release_date ? movie.release_date.split("-")[0] : "N/A"}
            </p>
          </div>
          <h2 className="my-5">領銜主演</h2>
          <div className="cast">
            {/* 用silce可以只挑選前五個 */}
            {credits.slice(0, 5).map((credit) => (
              <div key={credit.id} className="cast-item">
                <p className="text-sm text-white my-2">
                  {credit.name} 飾演：
                  <span className="text-sm text-gray-400">
                    {credit.character}
                  </span>
                </p>
              </div>
            ))}
          </div>
          <h2 className="mt-10">劇情簡介</h2>
          <p className="text-[16px] text-white mt-5 leading-7">
            {movie.overview}
          </p>
          <h2 className="my-10">電影預告</h2>
          <Trailer id={id} />
        </div>
      </div>
    </div>
  );
};
