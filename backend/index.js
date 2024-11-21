import app from './app.js';
import connectDB from './src/config/db.js';
import logger from './src/utils/logger.js';

const PORT = process.env.PORT || 8000;

// Connect to Database
connectDB();

// Start Server
app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
