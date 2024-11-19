export interface GiphyData {
  data: {
    images: {
      original: {
        url: string;
      };
    };
    id: string;
  }[];
}

export interface SearchedGifData {
  data: {
    images: {
      original: {
        url: string;
      };
    };
    id: string;
  }[];
}
