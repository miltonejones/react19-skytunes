import React, { useState, useEffect } from "react";
import "./ArtistCarousel.css";
import { useNavigate } from "react-router-dom";
import Spinner from "../Spinner/Spinner";
import Logo from "../Logo/Logo";
import { fallbackImage } from "../../fallbackImage";

const ArtistCarousel = ({ artists }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("");

  // Filter out any artists that might have lost their imageLg property
  const validArtists = artists.filter((artist) => artist.imageLg);

  useEffect(() => {
    if (validArtists.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [validArtists.length, currentIndex]);

  if (validArtists.length <= 1) return <div>No artists to display</div>;

  const handleNext = () => {
    setDirection("next");
    setTimeout(() => {
      setCurrentIndex(
        currentIndex === validArtists.length - 1 ? 0 : currentIndex + 1
      );
      setDirection("");
    }, 800); // Match animation duration
  };

  const handlePrev = () => {
    setDirection("prev");
    setTimeout(() => {
      setCurrentIndex(
        currentIndex === 0 ? validArtists.length - 1 : currentIndex - 1
      );
      setDirection("");
    }, 800); // Match animation duration
  };

  const goToSlide = (index) => {
    if (index === currentIndex) return;

    const newDirection = index > currentIndex ? "next" : "prev";
    setDirection(newDirection);
    setTimeout(() => {
      setCurrentIndex(index);
      setDirection("");
    }, 800);
  };

  const currentArtist = validArtists[currentIndex];
  const nextArtist = validArtists[(currentIndex + 1) % validArtists.length];
  const prevArtist =
    validArtists[
      currentIndex === 0 ? validArtists.length - 1 : currentIndex - 1
    ];

  if (!currentArtist || validArtists.length === 0) {
    return <Spinner />; // Don't render banner if no artists with images
  }

  const handleClick = () => {
    navigate(`/artist/detail/${currentArtist.ID}`);
  };

  return (
    <div className="carousel-outer">
      <div className={`carousel-container ${direction}`}>
        {/* Previous slide - only visible during prev transition */}
        {direction === "prev" && (
          <Logo
            fallback={fallbackImage}
            key={`prev-${prevArtist.ID}`}
            src={prevArtist.imageLg}
            alt={prevArtist.Name}
            className="carousel-slide prev"
          />
        )}

        {/* Current active slide */}
        <Logo
          fallback={fallbackImage}
          key={`active-${currentArtist.ID}`}
          src={currentArtist.imageLg}
          alt={currentArtist.Name}
          className="carousel-slide active"
        />

        {/* Next slide - only visible during next transition */}
        {direction === "next" && (
          <Logo
            fallback={fallbackImage}
            key={`next-${nextArtist.ID}`}
            src={nextArtist.imageLg}
            alt={nextArtist.Name}
            className="carousel-slide next"
          />
        )}
      </div>

      {/* Carousel indicators */}
      {validArtists.length > 1 && (
        <div className="carousel-indicators">
          {validArtists.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentIndex ? "active" : ""}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}

      {/* Navigation arrows */}
      {validArtists.length > 1 && (
        <>
          <button
            className="carousel-arrow carousel-arrow-prev"
            onClick={handlePrev}
          >
            ‹
          </button>
          <button
            className="carousel-arrow carousel-arrow-next"
            onClick={handleNext}
          >
            ›
          </button>
        </>
      )}

      <div className="carousel-box">
        <div className="info-label">Artist</div>
        <div className="info-title">{currentArtist.Name}</div>
        <div className="info-caption">
          {validArtists.length > 1 && (
            <span className="carousel-counter">
              {currentIndex + 1} of {validArtists.length} •{" "}
            </span>
          )}
          {/* Open in your library */}
        </div>
        <button className="rounded-b-sm" onClick={handleClick}>
          Explore Artist
        </button>
      </div>
    </div>
  );
};

export default ArtistCarousel;
