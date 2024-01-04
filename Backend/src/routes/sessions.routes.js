import { Router } from "express";
import passport from "passport";
import { passportError, authorization } from "../utils/messageErrors.js";
import sessionController from "../controllers/sessions.controller.js";
import { authToken } from "../utils/jwt.js";

const routerSession = Router();

routerSession.post('/login', passport.authenticate('login'), sessionController.postLogin);

routerSession.post('/password-recovery', sessionController.passwordRecovery);

routerSession.post('/reset-password/:token', sessionController.resetPassword);

routerSession.post('/register', passport.authenticate('register'), sessionController.postUser);

routerSession.get('/logout', sessionController.getLogout);

routerSession.get('/current', passportError('jwt'), sessionController.getCurrent);

routerSession.get('/github', passport.authenticate('github', {scope: ['user: email']}), sessionController.githubUser);

routerSession.get('/githubSession', passport.authenticate('github'), sessionController.githubSession);

export default routerSession;