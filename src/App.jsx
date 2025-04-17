// 導入必要的React hooks和組件
import React, { useEffect, useState } from "react";
import Search from "./components/Search.jsx";
import { Spinner } from "./components/Spinner.jsx";
import { MovieCard } from "./components/MovieCard.jsx";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite.js";
import { API_BASE_URL, API_OPTIONS } from "./config/api";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// App組件：應用的主要組件
const App = () => {
  // 狀態管理
  const [searchTerm, setSearchTerm] = useState(""); // 搜索關鍵詞
  const [errormessage, setErrormessage] = useState(""); // 錯誤信息
  const [movieList, setMovieList] = useState([]); // 電影列表
  const [trendingMovies, setTrendingMovies] = useState([]); // 熱門電影列表
  const [isLoading, setIsLoading] = useState(false); // 加載狀態
  const [debounceSearchTerm, setDebounceSearchTerm] = useState("");

  useDebounce(
    () => {
      setDebounceSearchTerm(searchTerm);
    },
    500,
    [searchTerm]
  );

  // 獲取電影數據的異步函數
  const fetchMovies = async (query = "") => {
    setIsLoading(true); // 開始加載
    setErrormessage(" "); // 清空錯誤信息
    try {
      // 構建API端點URL，獲取按人氣排序的電影
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
            query
          )}&language=zh-TW`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&language=zh-TW`;
      const response = await fetch(endpoint, API_OPTIONS);

      // 檢查響應狀態
      if (!response.ok) {
        throw new Error(`Error fetching movies.`);
      }

      // 解析JSON響應
      const data = await response.json();
      console.log("API Response:", data); // 添加日誌以檢查API響應

      if (!data.results) {
        setErrormessage(`Error: No movies data available`);
        setMovieList([]);
        return;
      }

      // 更新電影列表狀態
      setMovieList(data.results);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      // 錯誤處理
      console.error(`Error fetching movies: ${error}`);
      setErrormessage(`Error fetching movies. Please try again later.`);
    } finally {
      setIsLoading(false); // 結束加載狀態
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  };

  // 使用useEffect hook在組件掛載時獲取電影數據
  useEffect(() => {
    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  // 渲染UI
  return (
    <main>
      <Toaster position="bottom-center" reverseOrder={false} />
      {/* 背景圖案 */}
      <div className="pattern" />

      <div className="wrapper">
        <nav className="text-white flex justify-end ">
          <Link to="/favorites">⭐️喜歡的電影</Link>
        </nav>
        {/* 頁面頭部 */}
        <header>
          <img src="./hero.png" alt="Hero banner" />
          <h1>
            無需費心，
            <br />
            找尋你最愛的<span className="text-gradient">電影</span>
          </h1>
          {/* 搜索組件 */}
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {/* 熱門電影部分 */}
        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>熱門排行</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 電影列表部分 */}
        <section className="all-movies">
          <h2>所有電影（預設為熱門排行）</h2>

          {isLoading ? (
            <Spinner />
          ) : !errormessage ? (
            <p className="text-red-500">{errormessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
