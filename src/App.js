import React, { useEffect, useState } from "react";
import './App.css';
import tmdb from "./tmdb";
import MovieRow from "./components/MovieRow";
import FeaturedMovie from "./components/FeaturedMovie";
import Header from "./components/Header";

export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featureData, setFeatureData] = useState(null);
  const [blackHeader, setBlackHEader] = useState(false);

  useEffect(()=>{
    const loadAll = async () => {
      // Pegando a lista TOTAL
      let list = await tmdb.getHomeList();
      setMovieList(list);

      // Pegando o featured
      let originals = list.filter(i => i.slug === 'originals');
      let randomFeatured = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let featured = originals[0].items.results[randomFeatured];
      let featuredInfo = await tmdb.getMovieInfo(featured.id, 'tv');
      setFeatureData(featuredInfo);
    }

    loadAll();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if(window.scrollY > 10) {
        setBlackHEader(true);
      } else {
        setBlackHEader(false);
      }
    }

    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener);
    }
  }, []);

  return (
    <div className="page">

      <Header black={blackHeader} />

      {featureData && 
        <FeaturedMovie item={featureData} />
      }

      <section className="lists">
        {movieList.map((item, key)=>(
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>
    </div>
  );
}