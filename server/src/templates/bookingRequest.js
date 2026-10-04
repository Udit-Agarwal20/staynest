export const bookingRequestTemplate = ({
  hostName,
  guestName,
  listingTitle,
  checkIn,
  checkOut,
  nights,
  guests,
  totalPrice,
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #2d261e; }
    .container { max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #e7ded5; border-radius: 12px; }
    .header { font-size: 20px; font-weight: bold; color: #e05638; margin-bottom: 16px; }
    .card { background: #faf8f5; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #ede8e3; }
    .card p { margin: 6px 0; }
    .footer { font-size: 13px; color: #8c827a; margin-top: 24px; border-top: 1px solid #e7ded5; padding-top: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">🏡 StayNest - New Booking Request</div>
    <p>Hi <strong>${hostName}</strong>,</p>
    <p>You have received a new booking request from <strong>${guestName}</strong> for <strong>${listingTitle}</strong>.</p>
    <div class="card">
      <p><strong>Check-in:</strong> ${new Date(checkIn).toDateString()}</p>
      <p><strong>Check-out:</strong> ${new Date(checkOut).toDateString()}</p>
      <p><strong>Nights:</strong> ${nights}</p>
      <p><strong>Guests:</strong> ${guests}</p>
      <p><strong>Total Price:</strong> ₹${totalPrice}</p>
    </div>
    <p>Please log in to your Host Dashboard to confirm or decline this request.</p>
    <div class="footer">StayNest · Open-source stay booking platform</div>
  </div>
</body>
</html>
`;
