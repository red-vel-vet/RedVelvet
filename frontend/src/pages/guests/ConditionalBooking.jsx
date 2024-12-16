import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import cbStyles from '../../styles/ConditionalBooking.module.css';
import addItem from '../../assets/icons/add.svg';
import removeItem from '../../assets/icons/remove.svg';

function ConditionalBooking() {
  const location = useLocation();
  const navigate = useNavigate();

  // Access the events passed via navigation state
  const { selectedEvents = [] } = location.state || {};

  // Define ticket types and their prices
  const ticketOptions = [
    { id: 'mf_couple', name: 'MF Couple', price: 195 },
    { id: 'single_f', name: 'Single F', price: 75 },
    { id: 'single_m', name: 'Single M', price: 250 },
  ];

  // Initialize tickets with a quantity of 0
  const [addedTickets, setAddedTickets] = useState(
    ticketOptions.map((ticket) => ({ ...ticket, quantity: 0 }))
  );

  const handleIncrementQuantity = (ticketId) => {
    setAddedTickets((prevTickets) =>
      prevTickets.map((t) =>
        t.id === ticketId ? { ...t, quantity: t.quantity + 1 } : t
      )
    );
  };

  const handleDecrementQuantity = (ticketId) => {
    setAddedTickets((prevTickets) =>
      prevTickets.map((t) =>
        t.id === ticketId && t.quantity > 0
          ? { ...t, quantity: t.quantity - 1 }
          : t
      )
    );
  };

  const calculateTotal = () => {
    return addedTickets.reduce((total, ticket) => {
      return total + ticket.quantity * ticket.price;
    }, 0);
  };

  const totalCost = calculateTotal();

  const handleConfirmBooking = () => {
    if (totalCost > 0 && selectedEvents.length > 0) {
      alert(
        "Proceeding to purchase page with the following details:\n" +
          JSON.stringify({ selectedEvents, addedTickets, totalCost }, null, 2)
      );
      // navigate('/guests/payment', { state: { selectedEvents, addedTickets, totalCost } });
    } else {
      alert(
        'Please select at least one event and add tickets before proceeding.'
      );
    }
  };

  return (
    <div className={cbStyles.container}>
      <div className={cbStyles.bookingContent}>
        <h2>Purchase Tickets</h2>
        {selectedEvents.length > 0 ? (
          <>
            <div>
              <ul className={cbStyles.eventBookings}>
                {selectedEvents.map((event, index) => (
                  <li key={index} className={cbStyles.eventBooking}>
                    <div className={cbStyles.eventFlexContainer}>
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className={cbStyles.cbEventImage}
                      />
                      <div className={cbStyles.cbDetails}>
                        <p>
                          <strong>{event.title}</strong>
                        </p>
                        <p>
                          <strong>Host:</strong> {event.host}
                        </p>
                        <p>
                          <strong>Date:</strong>{' '}
                          {new Date(event.start).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ticket Selection Section */}
            <div className={cbStyles.ticketSection}>
              <div className={cbStyles.addedTicketsContainer}>
                <table className={cbStyles.ticketTable}>
                  <thead>
                    <tr>
                      <th>Ticket Type</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>–/+</th>
                    </tr>
                  </thead>
                  <tbody>
                    {addedTickets.map((ticket) => (
                      <tr key={ticket.id}>
                        <td>{ticket.name}</td>
                        <td>${ticket.price}</td>
                        <td>{ticket.quantity}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          {/* Decrement (–) icon */}
                          <img
                            src={removeItem}
                            alt="Decrease Quantity"
                            className={cbStyles.addRemoveIcon}
                            style={{ cursor: 'pointer', marginRight: '10px' }}
                            onClick={() => handleDecrementQuantity(ticket.id)}
                          />
                          {/* Increment (+) icon */}
                          <img
                            src={addItem}
                            alt="Increase Quantity"
                            className={cbStyles.addRemoveIcon}
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleIncrementQuantity(ticket.id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className={cbStyles.totalContainer}>
                  <h3>Total: ${totalCost}</h3>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p>No events selected. Please go back and select events.</p>
        )}
      </div>
      <div className={cbStyles.buttonContainer}>
        <Button variant="cancel" onClick={() => navigate('/guests/events')}>
          Go Back
        </Button>
        <Button
          variant="submit"
          onClick={handleConfirmBooking}
          disabled={selectedEvents.length === 0 || totalCost === 0}
        >
          Buy
        </Button>
      </div>
    </div>
  );
}

export default ConditionalBooking;
