import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth';
import reservationRoutes from "./routes/reservationRoutes";
import { setupGraphQL } from './graphql';
import User from "./models/user";
import bcrypt from "bcryptjs";
import { verifyToken } from "./middlewares/authMiddleware";

const app = express();
const port = 3001;

mongoose.connect('mongodb://127.0.0.1:27017/hotel-reservation', {
    autoCreate: true,
}).then(async () => {
    console.log('Connected to MongoDB');

    // ensure only default user 'admin'
    await User.findOneAndDelete({ username: 'admin' });
    const newUser = new User({ username: 'admin', password: bcrypt.hashSync('admin', 8), role: 'restaurant_employee' });
    await newUser.save();

}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

// Set up CORS options
const corsOptions = {
    origin: ['http://localhost:3000'],
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Add middleware to expose a custom header in the CORS response
app.use((req, res, next) => {
    res.header('Access-Control-Expose-Headers', 'authorization');
    next();
});


app.use('/auth', authRoutes);
app.use('/api', verifyToken, reservationRoutes);
app.use('/graphql', verifyToken);

setupGraphQL(app);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`GraphQL endpoint at http://localhost:${port}/graphql`);
});

export default app;