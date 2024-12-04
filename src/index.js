import cron from "node-cron";
import consola from "consola";
import { CONFIG } from "./config.js";
import { POS } from "./modules/pos.js";
import { checkRequest } from "./modules/soap-client.js";
import { downloadWSDL } from "./modules/httpclient.js";
import { Log } from "./modules/logger.js";

function startPOS() {
  if (CONFIG.isDev) {
    consola.info("--------- RUNNING MOCKS ---------");
  }

  try {

    POS.setDebug(true);
    POS.autoconnect()
      .then(async (port) => {
        if (port === false) {
          consola.error("No se encontró ningún POS conectado");
        } else {
          consola.success("Conectado al Puerto:", port.path);
        }
      })
      .catch((err) => {
        consola.error(`Ocurrió un error inesperado. POS: ${err.message}`);
        Log(err.message, "autoconnect");
      });
  } catch (err) {
    consola.error("Ocurrió un error al descargar archivo WSDL", err);
    Log(err.message, "startApp");
  }
}

function startApp() {
  try {

    if (!CONFIG.isDev) downloadWSDL();

    cron.schedule("*/5 * * * * *", async () => {
      consola.info("CRON ejecutado:", new Date().toISOString());
      if (POS.isConnected()) {
        const keys = await POS.loadKeys();
        checkRequest(keys);
        return;
      }

      startPOS();
    });
  } catch (err) {
    console.log("startApp error", err.message);
    Log(err.message, "startApp");
    return;
  }
}

startApp();
