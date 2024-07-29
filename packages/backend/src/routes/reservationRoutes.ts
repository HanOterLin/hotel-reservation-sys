import { Router } from 'express';
import {
    addReservation,
    updateReservation,
    cancelReservation,
    getReservations,
} from '../controllers/reservationController';

const router = Router();

router.post('/reservations', addReservation);
router.put('/reservations/:id', updateReservation);
router.delete('/reservations/:id', cancelReservation);
router.get('/reservations', getReservations);

export default router;
