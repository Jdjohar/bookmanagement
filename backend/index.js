// backend/index.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import pdfkit from 'pdfkit';
import cloudinary from 'cloudinary';
import { Section, Book, Order } from './model.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Cloudinary Configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Error:', err));

const adminEmail = process.env.ADMIN_EMAIL;
const adminPhone = process.env.ADMIN_PHONE;

/* ====================
   SECTION ROUTES
==================== */

app.get('/', async (req, res) => {
     res.status(201).json("welcome here");
})

app.post('/api/sections', async (req, res) => {
  try {
    const { name, description } = req.body;
    const section = new Section({ name, description });
    await section.save();
    res.status(201).json(section);
  } catch (error) {
    res.status(500).json({ error: 'Error creating section' });
  }
});

app.get('/api/sections', async (req, res) => {
  try {
    const sections = await Section.find();
    res.json(sections);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching sections' });
  }
});

/* ====================
    BOOK ROUTES
==================== */

app.post('/api/books', async (req, res) => {
  try {
    const { name, price, section } = req.body;
    const book = new Book({ name, price, section });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: 'Error creating book' });
  }
});

app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find().populate('section');
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching books' });
  }
});

/* ====================
    ORDER ROUTES
==================== */

app.post('/api/orders', async (req, res) => {
  try {
    const { schoolName, email, phoneNumber, books } = req.body;
    const order = new Order({ schoolName, email, phoneNumber, books });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error placing order' });
  }
});

// Fetch unpaid orders
app.get('/api/orders/unpaid', async (req, res) => {
  try {
    const unpaidOrders = await Order.find({ paymentStatus: 'Unpaid' });
    res.json(unpaidOrders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching unpaid orders' });
  }
});

// Generate PDF Invoice & Upload to Cloudinary
const generateInvoice = (order) => {
  return new Promise((resolve, reject) => {
    const doc = new pdfkit();
    const buffers = [];

    doc.text(`Invoice for ${order.schoolName}`, { align: 'center' });
    doc.text(`Email: ${order.email}`);
    doc.text(`Phone: ${order.phoneNumber}`);
    doc.text('Books:');

    order.books.forEach((book) => {
      doc.text(`- ${book.name} : $${book.price}`);
    });

    const totalPrice = order.books.reduce((acc, book) => acc + book.price, 0);
    doc.text(`Total: $${totalPrice}`);

    doc.end();

    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', async () => {
      const pdfBuffer = Buffer.concat(buffers);
      try {
        const uploadResult = await cloudinary.v2.uploader.upload_stream(
          { resource_type: 'raw', folder: 'invoices' },
          (error, result) => {
            if (error) reject(error);
            resolve(result.secure_url);
          }
        );
        uploadResult.end(pdfBuffer);
      } catch (error) {
        reject(error);
      }
    });
  });
};

// Update order status to "Paid" and upload invoice
app.put('/api/orders/:id/pay', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.paymentStatus === 'Paid') {
      return res.status(400).json({ error: 'Order is already paid' });
    }

    const invoiceUrl = await generateInvoice(order);

    order.paymentStatus = 'Paid';
    order.invoiceUrl = invoiceUrl;
    await order.save();

    res.json(order);
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ error: 'Error updating payment status' });
  }
});

// Get order invoice
app.get('/api/orders/:id/invoice', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || !order.invoiceUrl) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json({ invoiceUrl: order.invoiceUrl });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching invoice' });
  }
});

/* ====================
    ADMIN ROUTES
==================== */

app.post('/api/admin/login', (req, res) => {
  const { email, phone } = req.body;
  if (email === adminEmail && phone === adminPhone) {
    res.json({ message: 'Login successful', isAdmin: true });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// ✅ Fetch All Paid Invoices (Newly Added API)
app.get('/api/admin/invoices', async (req, res) => {
  try {
    const invoices = await Order.find({ paymentStatus: 'Paid' }).populate('books.bookId');
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch invoices' });
  }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
