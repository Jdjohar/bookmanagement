// backend/utils/cloudinary.js
import cloudinary from 'cloudinary';
import PDFDocument from 'pdfkit';
import streamifier from 'streamifier';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadPDFToCloudinary = async (order) => {
  const doc = new PDFDocument();
  let buffers = [];

  doc.fontSize(18).text(`Invoice for ${order.schoolName}`, { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Email: ${order.email}`);
  doc.text(`Phone: ${order.phoneNumber}`);
  doc.text(`Payment Status: ${order.paymentStatus}`);
  doc.moveDown();

  doc.text('Books Ordered:');
  order.books.forEach((book) => {
    doc.text(`- ${book.name} ($${book.price})`);
  });

  doc.end();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { resource_type: 'raw', folder: 'invoices' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.url);
      }
    );

    doc.pipe(streamifier.createReadStream(Buffer.concat(buffers))).pipe(uploadStream);
  });
};
