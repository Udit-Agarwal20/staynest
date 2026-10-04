import nodemailer from 'nodemailer';
import { bookingRequestTemplate } from '../templates/bookingRequest.js';
import { bookingStatusTemplate } from '../templates/bookingStatus.js';

let transporter = null;

const getTransporter = async () => {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Boolean(process.env.SMTP_SECURE === 'true'),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } catch {
      transporter = nodemailer.createTransport({ jsonTransport: true });
    }
  }

  return transporter;
};

export const sendBookingRequestEmail = async ({
  to,
  hostName,
  guestName,
  listingTitle,
  checkIn,
  checkOut,
  nights,
  guests,
  totalPrice,
}) => {
  try {
    if (!to) return;
    const transport = await getTransporter();
    const html = bookingRequestTemplate({
      hostName,
      guestName,
      listingTitle,
      checkIn,
      checkOut,
      nights,
      guests,
      totalPrice,
    });

    const info = await transport.sendMail({
      from: process.env.EMAIL_FROM || '"StayNest" <notifications@staynest.dev>',
      to,
      subject: `New booking request for ${listingTitle}`,
      html,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('Preview booking request email:', previewUrl);
    }
  } catch (err) {
    console.error('Failed to send booking request email (non-blocking):', err.message);
  }
};

export const sendBookingStatusEmail = async ({
  to,
  guestName,
  listingTitle,
  status,
  checkIn,
  checkOut,
  nights,
  totalPrice,
}) => {
  try {
    if (!to) return;
    const transport = await getTransporter();
    const html = bookingStatusTemplate({
      guestName,
      listingTitle,
      status,
      checkIn,
      checkOut,
      nights,
      totalPrice,
    });

    const info = await transport.sendMail({
      from: process.env.EMAIL_FROM || '"StayNest" <notifications@staynest.dev>',
      to,
      subject: `Your booking for ${listingTitle} has been ${status}`,
      html,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('Preview booking status email:', previewUrl);
    }
  } catch (err) {
    console.error('Failed to send booking status email (non-blocking):', err.message);
  }
};
