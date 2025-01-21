import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http'
import signinRoutes from './routes/signinRoutes'
import signupRoutes from './routes/signupRoutes'
import usersRoutes from './routes/usersRoutes'
import organizersRoutes from './routes/organizersRoutes'
import playersRoutes from './routes/playersRoutes'
import teamsRoutes from './routes/teamsRoutes'
import tournamentsRoutes from './routes/tournamentsRoutes'
import matchesRoutes from './routes/matchesRoutes'
import scorecardRoute from './routes/scorecardsRoutes'
import battingStatsRoutes from './routes/battingStatsRoutes'
import bowlingStatsRoutes from './routes/bowlingStatsRoutes'
import extrasRoutes from './routes/extrasRoutes'
import matchStateRoutes from './routes/matchStateRoutes'

const app = express();

const server = http.createServer(app);
export const io = new Server(server);

app.use(cors());
const port = 4000;

app.use(express.json());

app.use('/signin', signinRoutes);
app.use('/signup', signupRoutes);
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
app.use('/match-state',matchStateRoutes)

io.on('connection', (socket) => {
  console.log('a user connected');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
