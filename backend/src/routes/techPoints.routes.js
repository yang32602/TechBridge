import express from "express";
import * as techpointsController from "../controllers/techPoints.controller.js";

const router = express.Router();

router.get("/", techpointsController.obtenerTodos);

export default router;

