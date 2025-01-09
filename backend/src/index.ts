import express from 'express';
import userRoutes from './routes/userRoutes'

const app = express();
const port = 4000;

app.use(express.json());
app.use('/users', userRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
