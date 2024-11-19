"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { GiphyData, SearchedGifData } from "@/types/giphy";
import Image from "next/image";
import { useInView } from "react-intersection-observer";

export default function Home() {
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [gifData, setGifData] = useState<GiphyData | SearchedGifData>();
  const [searchTerm, setSearchTerm] = useState("");

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    const fetchInitialGifData = async () => {
      try {
        setIsFetchingData(true);
        const response = await axios.get(
          `https://api.giphy.com/v1/gifs/trending/?api_key=${process.env.NEXT_PUBLIC_GIPHY_API_KEY}&limit=25&rating=g&bundle=messaging_non_clips`
        );
        setGifData(response.data);
      } catch (error) {
        console.error("Error fetching initial GIF data:", error);
      } finally {
        setIsFetchingData(false);
      }
    };

    if (!searchTerm) {
      fetchInitialGifData();
    }
  }, [searchTerm]);

  useEffect(() => {
    const fetchSearchedGifData = async () => {
      try {
        if (!searchTerm) return;

        const response = await axios.get(
          `https://api.giphy.com/v1/gifs/search?api_key=${process.env.NEXT_PUBLIC_GIPHY_API_KEY}&q=${searchTerm}&limit=25&rating=g&bundle=messaging_non_clips`
        );
        setGifData(response.data);
      } catch (error) {
        console.error("Error fetching searched GIF data:", error);
      }
    };

    fetchSearchedGifData();
  }, [searchTerm]);

  const renderGifGrid = (gifs: GiphyData["data"] | SearchedGifData["data"]) =>
    gifs.map((gif) => (
      <div key={gif.id}>
        <Image
          src={gif.images.original.url}
          alt="gif"
          width={100}
          height={100}
        />
      </div>
    ));

  return (
    <main className="p-4">
      <input
        type="text"
        className="w-full max-w-md p-2 mb-4 text-black border rounded"
        placeholder="Search for GIFs..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="flex flex-col items-center justify-center gap-4">
        {isFetchingData ? (
          <p>Loading...</p>
        ) : (
          <>
            {gifData?.data && renderGifGrid(gifData.data)}
            <div ref={ref} />
            {inView && gifData?.data && renderGifGrid(gifData.data)}
          </>
        )}
      </div>
    </main>
  );
}
