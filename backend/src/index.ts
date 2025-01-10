import express from 'express';
import usersRoutes from './routes/usersRoutes'
import organizersRoutes from './routes/organizersRoutes'
import teamsRoutes from './routes/teamsRoutes'
import tournamentsRoutes from './routes/tournamentsRoutes'
import matchesRoutes from './routes/matchesRoutes'
import matchStatsRoutes from './routes/matchStatsRoutes'

const app = express();
const port = 4000;

app.use(express.json());

app.use('/users', usersRoutes);
app.use('/organizers',organizersRoutes)
app.use('/teams',teamsRoutes)
app.use('/tournaments',tournamentsRoutes)
app.use('/matches',matchesRoutes)
app.use('/matchStats',matchStatsRoutes)

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
