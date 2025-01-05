import axios from "axios"
import Constants from 'expo-constants';

export const imagePath = "https://image.tmdb.org/t/p/w500";
export const imagePathOriginal = "https://image.tmdb.org/t/p/original";

const baseUrl = "https://api.themoviedb.org/3";
const apiKey = Constants.expoConfig.extra.apiKey;

// Trending movies and tv series
export const fetchTrending = async (timeWindow = "day") => {
  const { data } = await axios.get(
    `${baseUrl}/trending/all/${timeWindow}?api_key=${apiKey}`
  );

  return data?.results;
};

// Details

export const fetchDetails = async (type, id) => {
  const res = await axios.get(`${baseUrl}/${type}/${id}?api_key=${apiKey}`)

  return res?.data;
}

// Credits

export const fetchCredits = async (type, id) => {
  const res = await axios.get(`${baseUrl}/${type}/${id}/credits?api_key=${apiKey}`)

  return res?.data;
}

// Movies

export const fetchMovies = async (page, sortBy, releaseYear) => {
  let res;
  if (releaseYear === 0){
    res = await axios.get(`${baseUrl}/discover/movie?api_key=${apiKey}&page=${page}&sort_by=${sortBy}`)
  }
  else {
    res = await axios.get(`${baseUrl}/discover/movie?api_key=${apiKey}&page=${page}&sort_by=${sortBy}&primary_release_year=${releaseYear}`) 
  }

  return res?.data;
}

// Shows

export const fetchShows = async (page, sortBy, releaseYear) => {
  let res;
  if (releaseYear === 0){
    res = await axios.get(`${baseUrl}/discover/tv?api_key=${apiKey}&page=${page}&sort_by=${sortBy}`)
  }
  else {
    res = await axios.get(`${baseUrl}/discover/tv?api_key=${apiKey}&page=${page}&sort_by=${sortBy}&first_air_date_year=${releaseYear}`) 
  }

  return res?.data;
}

// Search Movies

export const searchMovies = async (query, page, releaseYear) => {
  let res;
  if (releaseYear === 0){
    res = await axios.get(`${baseUrl}/search/movie?api_key=${apiKey}&query=${query}&page=${page}`)
  }
  else {
    res = await axios.get(`${baseUrl}/search/movie?api_key=${apiKey}&query=${query}&page=${page}&primary_release_year=${releaseYear}`) 
  }

  return res?.data;
}

// Search Movies

export const searchShows = async (query, page, releaseYear) => {
  let res;
  if (releaseYear === 0){
    res = await axios.get(`${baseUrl}/search/tv?api_key=${apiKey}&query=${query}&page=${page}`)
  }
  else {
    res = await axios.get(`${baseUrl}/search/tv?api_key=${apiKey}&query=${query}&page=${page}&first_air_date_year=${releaseYear}`) 
  }

  return res?.data;
}