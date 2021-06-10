import React, {useEffect, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component/src/index';
import './App.css';

const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

export default function App() {

  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);

  const getPhotos = () => {
    fetch(`https://api.unsplash.com/photos?client_id=${accessKey}&page=${page}`)
      .then(res => res.json())
      .then((data) => {
        setImages((images) => [...images, ...data])
      })
  }

  useEffect(() => {
    getPhotos();
  }, [page])

  // return an error if there is no access key
  if (!accessKey) {
    return (
      <a href="https://unsplash.com/developers" className="error">
        Required: Get Your Unsplash API Key First
      </a>
    )
  }

  return (
    <div className="app">
      <h1>Unsplash Image Gallery!</h1>

      <form>
        <input type="text" placeholder="Search Unsplash..."/>
        <button>Search</button>
      </form>
      <InfiniteScroll
        dataLength={images.length} //This is important field to render the next data
        next={() => setPage((page) => page + 1)}
        hasMore={true}
        loader={<h4>Loading...</h4>}
      >
        <div className="image-grid">
          {images.map((image, index) => (
            <a
              href={image.links.html}
              className="image"
              target="_blank"
              rel="noopener noreferrer"
              key={index}
            >
              <img src={image.urls.regular} alt={image.alt_description}/>
            </a>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
