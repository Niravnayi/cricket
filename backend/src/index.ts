import express from 'express';
import matchRoutes from './routes/matchesRoutes'
import userRoutes from './routes/userRoutes'
import organizerRoutes from './routes/organizerRoutes'
import teamRoutes from './routes/teamRoutes'
import matchStatsRoutes from './routes/matchStatsRoutes'

const app = express();
const port = 4000;

app.use(express.json());
app.use('/users', userRoutes);
app.use('/organizers',organizerRoutes)
app.use('/teams',teamRoutes)
app.use('/matches',matchRoutes)
app.use('/matchesStats',matchStatsRoutes)

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
