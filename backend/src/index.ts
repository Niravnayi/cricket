import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import signinRoutes from './routes/signinRoutes';
import signupRoutes from './routes/signupRoutes';
import usersRoutes from './routes/usersRoutes';
import organizersRoutes from './routes/organizersRoutes';
import playersRoutes from './routes/playersRoutes';
import teamsRoutes from './routes/teamsRoutes';
import tournamentsRoutes from './routes/tournamentsRoutes';
import matchesRoutes from './routes/matchesRoutes';
import scorecardRoute from './routes/scorecardsRoutes';
import teamPlayersRoutes from './routes/teamPlayersRoutes';
import battingStatsRoutes from './routes/battingStatsRoutes';
import bowlingStatsRoutes from './routes/bowlingStatsRoutes';
import extrasRoutes from './routes/extrasRoutes';
import matchStateRoutes from './routes/matchStateRoutes';

const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // React frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Socket'],
    credentials: true,
  },
});

const port = 4000;

app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Socket'],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use('/signin', signinRoutes);
app.use('/signup', signupRoutes);
app.use('/users', usersRoutes);
app.use('/organizers', organizersRoutes);
app.use('/players', playersRoutes);
app.use('/teams', teamsRoutes);
app.use('/tournaments', tournamentsRoutes);
app.use('/matches', matchesRoutes);
app.use('/scorecards', scorecardRoute);
app.use('/batting-stats', battingStatsRoutes);
app.use('/bowling-stats', bowlingStatsRoutes);
app.use('/extras', extrasRoutes);
app.use('/match-state', matchStateRoutes);
app.use('/team-players', teamPlayersRoutes);

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on("updateMatchStatus", (data) => {
    console.log("Match status update:", data);
    io.emit("matchStatusUpdate", data); 
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
