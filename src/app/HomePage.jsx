"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import { FaChevronLeft, FaChevronRight, FaArrowRight } from 'react-icons/fa';
import './HomePage.css';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setNewArrivals(data);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const slides = [
    {
      id: 1,
      title: 'New Arrivals: Summer Collection',
      subtitle: 'Light fabrics, vibrant colors. Shop now!',
      imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      link: '/products?category=summer',
    },
    {
      id: 2,
      title: 'Limited Edition Footwear',
      subtitle: 'Step up your style game with our exclusive drops.',
      imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      link: '/products?category=footwear',
    },
    {
      id: 3,
      title: 'Accessories for Every Look',
      subtitle: 'Complete your outfit with our stylish bags and jewelry.',
      imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      link: '/products?category=accessories',
    },
  ];

  const goToPrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const newArrivalsRef = useRef(null);

  const scrollNewArrivalsLeft = () => {
    if (newArrivalsRef.current) {
      newArrivalsRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollNewArrivalsRight = () => {
    if (newArrivalsRef.current) {
      newArrivalsRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const slideInterval = setInterval(goToNextSlide, 5000); // Change slide every 5 seconds
    return () => clearInterval(slideInterval);
  }, [slides.length]);

  // Placeholder data for sections
  const featuredCategories = [
    { name: "Men's Apparel", imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80', link: '/products?category=men' },
    { name: "Women's Fashion", imageUrl: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8d29tZW4lMjBmYXNoaW9ufGVufDB8fDB8fHww', link: '/products?category=women' },
    { name: 'Accessories', imageUrl: 'https://images.unsplash.com/3/www.madebyvadim.com.jpg?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YWNjZXNzb3JpZXN8ZW58MHx8MHx8fDA%3D', link: '/products?category=accessories' },
  ];

  // const newArrivals = products; // Take all products for horizontal scroll

  const testimonials = [
    { quote: 'Hikari has the most stylish and comfortable clothes! I always find something I love.', author: 'Jane D.' },
    { quote: 'Fast shipping and excellent quality. Highly recommend Hikari to everyone!', author: 'John S.' },
    { quote: 'Their customer service is top-notch. A truly great shopping experience.', author: 'Emily R.' },
  ];

  return (
    <div className="homepage">
      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slider-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.imageUrl})` }}
          >
            <div className="slider-overlay">
              <h1 className="slide-title">{slide.title}</h1>
              <p className="slide-subtitle">{slide.subtitle}</p>
              <Link href={slide.link} className="primary-btn slide-btn">Shop Now <FaArrowRight /></Link>
            </div>
          </div>
        ))}
        <div className="slider-controls">
          <button onClick={goToPrevSlide} className="slider-btn"><FaChevronLeft /></button>
          <button onClick={goToNextSlide} className="slider-btn"><FaChevronRight /></button>
        </div>
        <div className="slider-indicators">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`indicator-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            ></div>
          ))}
        </div>
      </div>

      <div className="section-container">
        <h2 className="section-title">Featured Categories</h2>
        <div className="categories-grid">
          {featuredCategories.map((category, index) => (
            <Link href={category.link} key={index} className="category-card">
              <div className="category-image-container">
                <img src={category.imageUrl} alt={category.name} className="category-image" />
              </div>
              <h3 className="category-name">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>

      

      <div className="section-container">
        <h2 className="section-title">New Arrivals</h2>
        <div className="new-arrivals-wrapper">
          <button onClick={scrollNewArrivalsLeft} className="new-arrivals-scroll-btn left"><FaChevronLeft /></button>
          <div className="new-arrivals-grid" ref={newArrivalsRef}>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => <ProductCardSkeleton key={index} />)
            ) : (
              newArrivals.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
          <button onClick={scrollNewArrivalsRight} className="new-arrivals-scroll-btn right"><FaChevronRight /></button>
        </div>
      </div>

      <div className="section-container">
        <h2 className="section-title">What Our Customers Say</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <p className="testimonial-quote">"{testimonial.quote}"</p>
              <p className="testimonial-author">- {testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;