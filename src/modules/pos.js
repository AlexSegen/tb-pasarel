import Transbank from "transbank-pos-sdk";
import { POSIntegrado as FakePOS } from './fake-transbank-pos-sdk.js'
import { CONFIG } from "../config.js";

let POS;
// Pos Instance
if (CONFIG.isDev) {
    POS = new FakePOS();
} else {
    POS = new Transbank.POSIntegrado();
};

// Dictionary
const DICTIONARY = {
    "0800": () => POS.loadKeys(), // TRANSACCIÓN CARGA DE LLAVES
    "0100": () => POS.poll(), // TRANSACCIÓN DE POLLING
    "0250": () => POS.getLastSale(), // TRANSACCIÓN ÚLTIMA VENTA
    "0500": () => POS.closeDay(), // TRANSACCIÓN DE CIERRE
    "0700": () => POS.getTotals(), // DETALLE DE VENTAS
    "0300": () => POS.changeToNormalMode(), // CAMBIO DE MODALIDAD A POS NORMAL
    "0260": (printOnPos) => POS.salesDetail(printOnPos),  // TRANSACCIÓN TOTALES
    "0200": (amount, ticket, sendStatus, callback) => {
        console.log(
            `amount: ${amount}, ticket: ${ticket}, sendStatus: ${sendStatus}, callback: ${callback}`
        )
        return POS.sale(amount, ticket, sendStatus, callback)
    }, // TRANSACCIONES DE VENTA
    "1200": (operationId) => POS.refund(operationId), // TRANSACCIÓN ANULACIÓN VENTA

};

export { POS, DICTIONARY };
