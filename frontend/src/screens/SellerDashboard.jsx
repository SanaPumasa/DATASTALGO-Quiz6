import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchSellerServices, addService, updateService, deleteService } from '../redux/actions/serviceActions';
import '../styles/SellerDashboard.css';

function SellerDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const services = useSelector((state) => state.services.services);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    service_name: '',
    description: '',
    price: '',
    duration_of_service: '',
    sample_image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    dispatch(fetchSellerServices());
  }, [dispatch]);

  if (user?.role !== 'seller') {
    navigate('/');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      sample_image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formDataWithImage = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== '') {
        formDataWithImage.append(key, formData[key]);
      }
    });

    try {
      if (editingId) {
        await dispatch(updateService(editingId, formDataWithImage));
      } else {
        await dispatch(addService(formDataWithImage));
      }
      setFormData({
        service_name: '',
        description: '',
        price: '',
        duration_of_service: '',
        sample_image: null,
      });
      setShowForm(false);
      setEditingId(null);
      dispatch(fetchSellerServices());
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message || 'Error saving service';
      setError(errorMessage);
      console.error('Error saving service:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (service) => {
    setFormData({
      service_name: service.service_name,
      description: service.description,
      price: service.price,
      duration_of_service: service.duration_of_service,
      sample_image: null,
    });
    setEditingId(service.id);
    setShowForm(true);
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await dispatch(deleteService(serviceId));
        dispatch(fetchSellerServices());
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  return (
    <div className="seller-dashboard-container">
      <h1>Seller Dashboard</h1>
      <button
        onClick={() => setShowForm(!showForm)}
        className="btn-add-service"
      >
        {showForm ? 'Cancel' : '+ Add New Service'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="service-form">
          <h2>{editingId ? 'Edit Service' : 'Add New Service'}</h2>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="service_name">Service Name *</label>
            <input
              type="text"
              id="service_name"
              name="service_name"
              value={formData.service_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price *</label>
              <input
                type="number"
                id="price"
                name="price"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="duration_of_service">Duration *</label>
              <input
                type="text"
                id="duration_of_service"
                name="duration_of_service"
                value={formData.duration_of_service}
                onChange={handleChange}
                placeholder="e.g. 2 hours"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="sample_image">Service Image</label>
            <input
              type="file"
              id="sample_image"
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-submit">
            {isSubmitting ? 'Saving...' : editingId ? 'Update Service' : 'Add Service'}
          </button>
        </form>
      )}

      <div className="services-table-container">
        <h2>My Services</h2>
        {services && services.length > 0 ? (
          <table className="services-table">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td>{service.service_name}</td>
                  <td>${service.price}</td>
                  <td>{service.duration_of_service}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(service)}
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No services yet. Add one to get started!</p>
        )}
      </div>
    </div>
  );
}

export default SellerDashboard;
