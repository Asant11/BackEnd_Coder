import { Router }  from "express"
import logger from "../utils/logger.js"

const routerLoggerTest = Router();

routerLoggerTest.get("/", (req, res) => {
    logger.fatal("Esto es un logger de fatal");
    logger.error("Esto es un logger de error");
    logger.warning("Esto es un logger de warn");
    logger.info("Esto es un logger de info");
    logger.debug("Esto es un logger de debug");
    res.send("OK: Loggers successfully loaded");
});

export default routerLoggerTest;