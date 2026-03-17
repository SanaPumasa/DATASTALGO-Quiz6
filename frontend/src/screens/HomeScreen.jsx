import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchServices } from '../redux/actions/serviceActions';
import '../styles/Home.css';

function HomeScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const services = useSelector((state) => state.services.services);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  if (!isAuthenticated) {
    navigate('/signin');
    return null;
  }

  return (
    <div className="home-container">
      <h1>Available Services</h1>
      <div className="services-grid">
        {services && services.map((service) => (
          <div
            key={service.id}
            className="service-card"
            onClick={() => navigate(`/service/${service.id}`)}
          >
            {service.sample_image && (
              <img src={service.sample_image} alt={service.service_name} className="service-image" />
            )}
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
