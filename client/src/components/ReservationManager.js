import React, { useState, useEffect } from 'react';
import './reservationManager.css';

const API_BASE = process.env.REACT_APP_API_BASE || '';

const ReservationManager = ({ userId }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch reservations
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/api/reservations/user/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch reservations');
        }
        const data = await response.json();
        
        // Sort reservations by date (most recent first)
        const sortedReservations = data.sort((a, b) => 
          new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time)
        );
        
        setReservations(sortedReservations);
        setLoading(false);
      } catch (err) {
        setError('Failed to load your reservations. Please try again later.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchReservations();
  }, [userId]);

  // Handle modifying a reservation
  const handleModify = (reservation) => {
    setSelectedReservation(reservation);
    setShowModifyModal(true);
  };

  // Handle canceling a reservation
  const handleCancel = (reservation) => {
    setSelectedReservation(reservation);
    setShowCancelModal(true);
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to format time
  const formatTime = (timeString) => {
    // Assuming timeString is in 24-hour format like "19:00:00"
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  };

  // Confirm reservation cancellation
  const confirmCancellation = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/reservations/${selectedReservation.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to cancel reservation');
      }
      
      // Remove the canceled reservation from the list
      setReservations(reservations.filter(r => r.id !== selectedReservation.id));
      setShowCancelModal(false);
      setMessage('Reservation successfully canceled');
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError('Failed to cancel reservation. Please try again.');
      console.error(err);
    }
  };

  // Calculate if a reservation is in the past
  const isPastReservation = (date, time) => {
    const reservationDate = new Date(date + 'T' + time);
    return reservationDate < new Date();
  };

  return (
    <div className="reservation-manager">
      <h2>My Reservations</h2>
      
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Loading your reservations...</div>
      ) : reservations.length === 0 ? (
        <div className="no-reservations">
          <p>You don't have any reservations yet.</p>
          <button onClick={() => window.location.href = '/book-table'} className="book-now-btn">
            Book a Table
          </button>
        </div>
      ) : (
        <div className="reservations-list">
          <div className="reservation-categories">
            <h3>Upcoming Reservations</h3>
            {reservations.filter(r => !isPastReservation(r.date, r.time)).length === 0 ? (
              <p>No upcoming reservations.</p>
            ) : (
              reservations
                .filter(r => !isPastReservation(r.date, r.time))
                .map(reservation => (
                  <div key={reservation.id} className="reservation-card">
                    <div className="reservation-header">
                      <span className="table-number">Table {reservation.table_name}</span>
                      <span className="reservation-status">Confirmed</span>
                    </div>
                    <div className="reservation-details">
                      <div className="reservation-date">{formatDate(reservation.date)}</div>
                      <div className="reservation-time">{formatTime(reservation.time)}</div>
                      <div className="reservation-guests">{reservation.num_guests} {reservation.num_guests > 1 ? 'Guests' : 'Guest'}</div>
                      {reservation.special_requests && (
                        <div className="reservation-notes">
                          <strong>Special Requests:</strong> {reservation.special_requests}
                        </div>
                      )}
                    </div>
                    <div className="reservation-actions">
                      <button onClick={() => handleModify(reservation)} className="modify-btn">
                        Modify
                      </button>
                      <button onClick={() => handleCancel(reservation)} className="cancel-btn">
                        Cancel
                      </button>
                    </div>
                  </div>
                ))
            )}
            
            <h3 className="past-title">Past Reservations</h3>
            {reservations.filter(r => isPastReservation(r.date, r.time)).length === 0 ? (
              <p>No past reservations.</p>
            ) : (
              reservations
                .filter(r => isPastReservation(r.date, r.time))
                .map(reservation => (
                  <div key={reservation.id} className="reservation-card past">
                    <div className="reservation-header">
                      <span className="table-number">Table {reservation.table_name}</span>
                      <span className="reservation-status completed">Completed</span>
                    </div>
                    <div className="reservation-details">
                      <div className="reservation-date">{formatDate(reservation.date)}</div>
                      <div className="reservation-time">{formatTime(reservation.time)}</div>
                      <div className="reservation-guests">{reservation.num_guests} {reservation.num_guests > 1 ? 'Guests' : 'Guest'}</div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}
      
      {/* Modify Reservation Modal */}
      {showModifyModal && selectedReservation && (
        <ModifyReservationModal 
          reservation={selectedReservation}
          onClose={() => setShowModifyModal(false)}
          onModify={(updatedReservation) => {
            // Update the reservation in the list
            setReservations(reservations.map(r => 
              r.id === updatedReservation.id ? updatedReservation : r
            ));
            setShowModifyModal(false);
            setMessage('Reservation successfully updated');
            setTimeout(() => setMessage(null), 3000);
          }}
        />
      )}
      
      {/* Cancellation Confirmation Modal */}
      {showCancelModal && selectedReservation && (
        <div className="modal-overlay">
          <div className="cancel-modal">
            <h3>Cancel Reservation</h3>
            <p>Are you sure you want to cancel your reservation for:</p>
            <p><strong>{formatDate(selectedReservation.date)}</strong> at <strong>{formatTime(selectedReservation.time)}</strong>?</p>
            <div className="modal-actions">
              <button onClick={confirmCancellation} className="confirm-cancel">
                Yes, Cancel Reservation
              </button>
              <button onClick={() => setShowCancelModal(false)} className="keep-reservation">
                No, Keep My Reservation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Modify Reservation Modal component
const ModifyReservationModal = ({ reservation, onClose, onModify }) => {
  const [form, setForm] = useState({
    date: reservation.date,
    time: reservation.time.substring(0, 5), // Just HH:MM part
    num_guests: reservation.num_guests,
    special_requests: reservation.special_requests || ''
  });
  const [availableTimes, setAvailableTimes] = useState([]);
  const [error, setError] = useState(null);
  
  // Fetch available times for the selected date
  useEffect(() => {
    // This would be replaced with your actual API call
    // For now, just providing some example times
    const fetchAvailableTimes = () => {
      const times = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
      setAvailableTimes(times);
    };
    
    fetchAvailableTimes();
  }, [form.date]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Convert time back to HH:MM:SS format if needed
      const timeFormatted = form.time + ':00';
      
      const response = await fetch(`${API_BASE}/api/reservations/${reservation.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...reservation,
          date: form.date,
          time: timeFormatted,
          num_guests: parseInt(form.num_guests),
          special_requests: form.special_requests
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update reservation');
      }
      
      const updatedReservation = await response.json();
      onModify(updatedReservation);
    } catch (err) {
      setError('Failed to update reservation. Please try again.');
      console.error(err);
    }
  };
  
  return (
    <div className="modal-overlay">
      <div className="modify-modal">
        <button className="close-modal" onClick={onClose}>&times;</button>
        <h3>Modify Reservation</h3>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Time</label>
            <select
              name="time"
              value={form.time}
              onChange={handleChange}
              required
            >
              {availableTimes.map(time => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Number of Guests</label>
            <select
              name="num_guests"
              value={form.num_guests}
              onChange={handleChange}
              required
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Special Requests</label>
            <textarea
              name="special_requests"
              value={form.special_requests}
              onChange={handleChange}
              rows={3}
              placeholder="Any special requests or accommodations..."
            />
          </div>
          
          <div className="modal-actions">
            <button type="submit" className="save-changes">
              Save Changes
            </button>
            <button type="button" onClick={onClose} className="cancel-changes">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationManager;
