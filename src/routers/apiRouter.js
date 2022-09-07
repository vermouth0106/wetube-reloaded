import express from "express";
import {
  registerView,
  createComment,
  removeComment,
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);

// 코드 챌린지 요기임니다!!! ♥️💙♥️💙♥️💙♥️💙♥️💙♥️💙♥️💙♥️💙♥️💙
apiRouter.delete("/comments/:id([0-9a-f]{24})", removeComment);
// 요기까지 !!!! 😘

export default apiRouter;
