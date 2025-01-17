import express from 'express';
import usersRoutes from './routes/usersRoutes'
import organizersRoutes from './routes/organizersRoutes'
import playersRoutes from './routes/playersRoutes'
import teamsRoutes from './routes/teamsRoutes'
import tournamentsRoutes from './routes/tournamentsRoutes'
import matchesRoutes from './routes/matchesRoutes'
import scorecardRoute from './routes/scorecardsRoutes'
import battingStatsRoutes from './routes/battinStatsRoutes'
import bowlingStatsRoutes from './routes/bowlingStatsRoutes'
import extrasRoutes from './routes/extrasRoutes'

const app = express();
const port = 4000;

app.use(express.json());

app.use('/users', usersRoutes);
app.use('/organizers',organizersRoutes)
app.use('/players',playersRoutes)
app.use('/teams',teamsRoutes)
app.use('/tournaments',tournamentsRoutes)
app.use('/matches',matchesRoutes)
app.use('/scorecards',scorecardRoute)
app.use('/batting-stats',battingStatsRoutes)
app.use('/bowling-stats',bowlingStatsRoutes)
app.use('/extras',extrasRoutes)


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
