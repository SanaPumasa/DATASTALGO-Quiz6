import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchServices } from '../redux/actions/serviceActions';
import { getImageUrl } from '../utils/imageUtils';
import '../styles/Home.css';

function HomeScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const services = useSelector((state) => state.services.services);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const handleServiceClick = (serviceId) => {
    if (!isAuthenticated) {
      alert('Please sign in to view service details and make a booking');
      navigate('/signin');
      return;
    }
    navigate(`/service/${serviceId}`);
  };

  return (
    <div className="home-container">
      <h1>Available Services</h1>
      <div className="services-grid">
        {services && services.map((service) => (
          <div
            key={service.id}
            className="service-card"
            onClick={() => handleServiceClick(service.id)}
          >
            <img
              src={getImageUrl(service.sample_image)}
              alt={service.service_name}
              className="service-image"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect width="300" height="200" fill="%23e0e0e0"/%3E%3Ctext x="50%" y="50%" font-family="Arial" font-size="14" fill="%23999" text-anchor="middle" dominant-baseline="middle"%3ENo Image Available%3C/text%3E%3C/svg%3E';
              }}
            />
            <div className="card-content">
              <h3>{service.service_name}</h3>
              <p className="description">{service.description.substring(0, 100)}...</p>
              <div className="card-footer">
                <span className="rating">★ {service.rating || 'N/A'}</span>
                <span className="shop-name">{service.seller_username}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomeScreen;
