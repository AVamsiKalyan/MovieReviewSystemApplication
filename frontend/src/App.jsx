import { useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'
import MovieCard from './components/MovieCard'
import ReviewCard from './components/ReviewCard'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import {Routes, Route } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import AddMoviePage from './pages/AddMoviePage'
import MoviePage from './pages/MoviePage'
import ReviewsPage from './pages/ReviewsPage'


function App() {
  return (
    <>
      
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/add-movie" element={<AddMoviePage />} />
        <Route path="/movies/:id" element={<MoviePage />} />
        <Route path="/reviews" element={<ReviewsPage/>}/>
      </Routes>
    


    </>
  )
}

export default App
