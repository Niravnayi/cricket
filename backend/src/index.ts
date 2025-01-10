import express from 'express';
import usersRoutes from './routes/userRoutes'
import organizersRoutes from './routes/organizerRoutes'
import teamsRoutes from './routes/teamRoutes'
import tournamentsRoutes from './routes/tournamentRoutes'

const app = express();
const port = 4000;

app.use(express.json());
app.use('/users', usersRoutes);
app.use('/organizers',organizersRoutes)
app.use('/teams',teamsRoutes)
app.use('/tournaments',tournamentsRoutes)

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

