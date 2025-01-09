import express from 'express';
import userRoutes from './routes/userRoutes'
import organizerRoutes from './routes/organizerRoutes'
import teamRoutes from './routes/teamRoutes'
import tournamentRoutes from './routes/tournamentRoutes'

const app = express();
const port = 4000;

app.use(express.json());
app.use('/users', userRoutes);
app.use('/organizers',organizerRoutes)
app.use('/teams',teamRoutes)
app.use('/tournaments',tournamentRoutes)

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

