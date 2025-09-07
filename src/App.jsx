import React from 'react'
import Search from './Components/Search'
import { useEffect } from 'react'
import { useState } from 'react'
import useDebounce from './CustomHook/Debounce';
import Spinner from './Components/Spinner';
import MovieCard from './Components/MovieCard';
const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
import { getTrendingMovies, updateSearchCount } from './appwrite';
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};
const App = () => {
  const [searchTerm, setsearchTerm] = useState('');
  const [errorMessage,setErrorMessage] = useState('');
  const [treandingErrorMessage,setTrendingErrorMessage] = useState('');
  const [trendingLoading,setTrendingLoading] = useState(false);
  const [movies,setMovies] = useState([]);
  const [loading,setLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [TrendingMovies, setTrendingMovies] = useState([]);
  const fetchMovies = async (query='') => {
    setLoading(true);
    setErrorMessage('');
    try {
      const endpoint = query? 
      `${API_BASE_URL}/search/movie?query=${query}`
      :  `${API_BASE_URL}/discover/movie?include_adult=false&include_video=true&language=en-US&page=1&sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      } 
      const data = await response.json();
      if(data.response === 'False') {
        setErrorMessage(data.error);
        setMovies([]);
      }
      setMovies(data.results||[]);
      if(query&&data.results.length>0){
        await updateSearchCount(query,data.results[0]);
      }
      console.log(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setErrorMessage('Failed to fetch movies. Please try again later.');
    }
    finally {
      setLoading(false);
    }
  };
  const loadTrendnigMovies = async()=>{
    setTrendingLoading(true);
    setTrendingErrorMessage('');
    try{
      const movies = await getTrendingMovies()
      setTrendingMovies(movies);
    }
    catch(error){
      setTrendingErrorMessage('Failed to load trending movies. Please try again later.');
      console.log(error);
    }
    finally{
      setTrendingLoading(false);
    }
  }
  useEffect(()=>{
    loadTrendnigMovies();
  },[])
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm])
  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header className='bg-[url(/BG-1.png)]  bg-cover bg-no-repeat'>
            <img src="./hero-img.png" alt="Hero image" />
            <h1>Find <span className="text-gradient">Movies</span> You'll enjoy without the hastle</h1>
            <Search searchTerm={searchTerm} setsearchTerm={setsearchTerm} />
          </header>
          {trendingLoading ? <Spinner/> : treandingErrorMessage?(
              <p className="text-red-500">${treandingErrorMessage}</p>
            ):TrendingMovies && TrendingMovies.length > 0 && (
            <section className='trending mt-28'>
              <h2>Trending Movies</h2>
              <ul>
                {TrendingMovies.map((movie,index)=>(
                  <li key={movie.$id}>
                    <p>{index+1}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section className="all-movies">
            <h2 className='mt-4'>{searchTerm==''?'Popular Movies':`Showing results of "${searchTerm} "`}</h2>
            {loading ? <Spinner/> : errorMessage?(
              <p className="text-red-500">${errorMessage}</p>
            ):(
              <ul>
              {movies.map((movie)=>(
               <li key={movie.id} onClick={()=>{console.log(movie)}}>
                 <MovieCard  movie={movie} />
               </li>
              ))}
              </ul>
            )}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </section>
        </div>
      </div>
    </main>
  )
}

export default App;