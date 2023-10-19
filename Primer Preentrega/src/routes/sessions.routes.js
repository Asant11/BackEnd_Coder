import { Router } from "express";
import passport from "passport";
import { passportError, authorization } from "../utils/messageErrors.js";
import sessionController from "../controllers/sessions.controller.js";

const routerSession = Router();

routerSession.post('/login', passport.authenticate('login'), sessionController.postLogin);

routerSession.get('/logout', sessionController.getLogout)


routerSession.get('/current', passportError('jwt'), authorization('user'), sessionController.getCurrent)

routerSession.get('/github', passport.authenticate('github', {scope: ['user: email']}), sessionController.githubUser)

routerSession.get('/githubSession', passport.authenticate('github'), sessionController.githubSession)

routerSession.get('/jwt', passport.authenticate('jwt', {session: true}),
async (req, res) => {
    res.status(200).send({mensaje: req.user})
    req.session.user = {
        first_name: req.user.user.first_name,
        last_name: req.user.user.last_name,
        email:req.user.user.email,
        age: req.user.user.age
    }
})


export default routerSession;