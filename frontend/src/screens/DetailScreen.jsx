import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../config/api';
import { getImageUrl } from '../utils/imageUtils';
import '../styles/Detail.css';

function DetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await api.get(`/services/${id}/`);
        setService(response.data);
      } catch (err) {
        setError('Service not found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleAvailService = () => {
    if (!isAuthenticated) {
      alert('Please sign in to book this service');
      navigate('/signin');
      return;
    }
    navigate('/subscription');
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!service) return <div className="error">Service not found</div>;

  return (
    <div className="detail-container">
      <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
      <div className="detail-content">
        {service.sample_image && (
          <img src={getImageUrl(service.sample_image)} alt={service.service_name} className="detail-image" />
        )}
        <div className="detail-info">
          <h1>{service.service_name}</h1>
          <p className="seller-info">By: {service.seller_username}</p>
          <div className="rating-box">
            <span className="rating">Rating: ★ {service.rating || 'N/A'}</span>
          </div>
          <div className="description-box">
            <h3>Description</h3>
            <p>{service.description}</p>
          </div>
          <div className="service-details">
            <div className="detail-item">
              <strong>Price:</strong>
              <span>${service.price}</span>
            </div>
            <div className="detail-item">
              <strong>Duration:</strong>
              <span>{service.duration_of_service}</span>
            </div>
          </div>
          <button onClick={handleAvailService} className="btn-avail">
            Avail Service
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailScreen;
