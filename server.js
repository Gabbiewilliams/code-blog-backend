import app from './index.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`[app] listening on ${PORT}`);
});
