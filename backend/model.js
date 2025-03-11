// backend/models.js
import mongoose from 'mongoose';

// Section Schema
const sectionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
});

export const Section = mongoose.model('Section', sectionSchema);

// Book Schema
const bookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
});

export const Book = mongoose.model('Book', bookSchema);

// Order Schema
// backend/models.js

const orderSchema = new mongoose.Schema({
    schoolName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    books: [
      {
        bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
        name: String,
        price: Number,
      },
    ],
    paymentStatus: { type: String, enum: ['Unpaid', 'Paid'], default: 'Unpaid' },
    invoiceUrl: { type: String }, // Add this line to store the invoice URL
    createdAt: { type: Date, default: Date.now },
  });

export const Order = mongoose.model('Order', orderSchema);
