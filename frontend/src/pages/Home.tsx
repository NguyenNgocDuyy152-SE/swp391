import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const slides = [
    {
        id: 1,
        image: 'https://img.freepik.com/free-photo/doctor-with-stethoscope-hands-hospital-background_1423-1.jpg',
        title: 'Chăm sóc sức khỏe toàn diện',
        description: 'Đội ngũ bác sĩ chuyên môn cao, trang thiết bị hiện đại'
    },
    {
        id: 2,
        image: 'https://img.freepik.com/free-photo/medical-banner-with-doctor-working-hospital_23-2149611195.jpg',
        title: 'Khám chữa bệnh 24/7',
        description: 'Sẵn sàng phục vụ bệnh nhân mọi lúc, mọi nơi'
    },
    {
        id: 3,
        image: 'https://img.freepik.com/free-photo/medical-banner-with-stethoscope_23-2149611196.jpg',
        title: 'Công nghệ tiên tiến',
        description: 'Áp dụng những tiến bộ mới nhất trong y học'
    }
];

const Home: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000); // Chuyển slide mỗi 5 giây

        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className="home">
            {/* Hero Section with Slideshow */}
            <section className="hero">
                <div className="slideshow">
                    {slides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`slide ${index === currentSlide ? 'active' : ''}`}
                            style={{ backgroundImage: `url(${slide.image})` }}
                        >
                            <div className="slide-content">
                                <h2>{slide.title}</h2>
                                <p>{slide.description}</p>
                            </div>
                        </div>
                    ))}
                    <button className="slide-btn prev" onClick={prevSlide}>❮</button>
                    <button className="slide-btn next" onClick={nextSlide}>❯</button>
                    <div className="slide-dots">
                        {slides.map((_, index) => (
                            <span
                                key={index}
                                className={`dot ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => setCurrentSlide(index)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Rest of the content */}
      // ... existing code ...
        </div>
    );
};

export default Home; 