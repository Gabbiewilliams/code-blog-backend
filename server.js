import app from './index.js';
import dotenv from 'dotenv';

dotenv.config();

// Import posts routes
import postsRoutes from './src/routes/posts.routes.js';

const PORT = process.env.PORT || 5001;

// Mount the posts routes
app.use('/api/posts', postsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
