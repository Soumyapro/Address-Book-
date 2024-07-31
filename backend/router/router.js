import express from 'express';
import auth from '../middleware/auth.js';
import { deleteDetails, getDetails, login, signUp, submitDetails, updateDetails } from '../controller/userController.js';

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/login", login);
router.post("/submit-details", auth, submitDetails);
router.get("/get-details", auth, getDetails);
router.put("/update-details/:detailsId", auth, updateDetails);
router.delete("/delete-details/:detailsId", auth, deleteDetails);

export default router;