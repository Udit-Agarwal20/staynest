export const bookingStatusTemplate = ({
  guestName,
  listingTitle,
  status,
  checkIn,
  checkOut,
  nights,
  totalPrice,
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #2d261e; }
    .container { max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #e7ded5; border-radius: 12px; }
    .header { font-size: 20px; font-weight: bold; color: ${status === 'confirmed' ? '#2e7d32' : '#c62828'}; margin-bottom: 16px; }
    .card { background: #faf8f5; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #ede8e3; }
    .card p { margin: 6px 0; }
    .footer { font-size: 13px; color: #8c827a; margin-top: 24px; border-top: 1px solid #e7ded5; padding-top: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">🏡 StayNest - Booking Request ${status.toUpperCase()}</div>
    <p>Hi <strong>${guestName}</strong>,</p>
    <p>Your booking request for <strong>${listingTitle}</strong> has been <strong>${status}</strong> by the host.</p>
    <div class="card">
      <p><strong>Check-in:</strong> ${new Date(checkIn).toDateString()}</p>
      <p><strong>Check-out:</strong> ${new Date(checkOut).toDateString()}</p>
      <p><strong>Nights:</strong> ${nights}</p>
      <p><strong>Total Price:</strong> ₹${totalPrice}</p>
      <p><strong>Status:</strong> <span style="text-transform: capitalize; font-weight: bold;">${status}</span></p>
    </div>
    <p>You can view and manage your reservation details from your My Trips dashboard.</p>
    <div class="footer">StayNest · Open-source stay booking platform</div>
  </div>
</body>
</html>
`;
