import React from "react";
import { API_BASE_URL, API_OPTIONS } from "../config/api";
import { useEffect, useState } from "react";

export const Trailer = ({ id }) => {
  const [trailer, setTrailer] = useState([]);

  const fetchTrailer = async () => {
    const data = await fetch(
      `${API_BASE_URL}/movie/${id}/videos?language=zh-TW`,
      API_OPTIONS
    );
    const json = await data.json();
    console.log(json);
    setTrailer(json.results);
  };

  useEffect(() => {
    fetchTrailer();
  }, []);

  // 找到符合條件的影片 trailer是array
  const video = trailer.find(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );

  // 只有在找到符合條件的影片時才建立 URL，否則設置為 null，一定要加判斷不然不給跑
  const url = video ? `https://www.youtube.com/embed/${video.key}` : null;

  return (
    url && (
      <iframe
        src={url}
        title="Movie Trailer"
        allowFullScreen
        className="w-full aspect-video rounded-xl mt-2"
      />
    )
  );
};
