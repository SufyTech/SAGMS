const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');
const reportRoutes = require('./routes/reportRoutes');
const complaintRoutes = require('./routes/complaintRoutes');


dotenv.config(); // Load environment variables
connectDB(); // Connect to the database

const app = express(); // Initialize express app
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(express.json()); // Middleware to parse incoming JSON requests
app.use('/uploads', express.static('uploads')); // Serve static files from the uploads folder

// Test route to check if the server is working
app.get('/', (req, res) => {
  console.log('GET / route is hit'); // Debug log to ensure route is accessed
  res.send('API is working'); // Response text to confirm server is working
});

// Mount the report routes
app.use('/api/reports', reportRoutes);

// Mount the complaint routes
app.use('/api/complaints', complaintRoutes);


// Error handling middleware (Optional but recommended)
app.use((req, res, next) => {
  res.status(404).send('Resource not found'); // Handle 404 errors for undefined routes
});

// Start the server
const PORT = process.env.PORT || 5000; // Use environment variable or default to port 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
