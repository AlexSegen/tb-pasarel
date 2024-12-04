//import getLastSaleMock from '../../__mocks__/pos/getLastSale.json' with {type: "json"}; 
import { readFile } from 'node:fs/promises';

const getMock = (f) => `./__mocks__/pos/${f}.json`


async function getData(f) {
    try {
        const data = JSON.parse(await readFile(getMock(f), 'utf8'));
        return data;
      } catch (err) {
        console.error(`Error reading JSON file: ${err}`);
      }
  }

export class POSIntegrado {
    connected;
    constructor() {
        this.connected = false
        this.ackTimeout = 2000
        this.posTimeout = 150000
        this.port = null
        this.waiting = false

        this.responseCallback = function () {
        }
        this.ackCallback = function () {
        }
     }

    isConnected() {
        return this.connected
    }

    loadKeys() {
        return new Promise((resolve) => resolve({terminalId: 1}));
    }

    setDebug(debug) {
        console.log(`setDebug result, debug: ${debug}`);
    }

    autoconnect() {
        this.connected = true;
        return new Promise((resolve) => resolve({
            path: "autoconnect result",
        }));
    }

    sale(amount, ticket, sendStatus, callback) {
        console.log(`[sale] params - amount: ${amount}, ticket: ${ticket}, sendStatus: ${sendStatus}, callback: ${callback}`)
        return new Promise((resolve) => resolve("sale result"));
    }

    getLastSale() {
        return getData('getLastSale');
    }

    getTotals() {
        return new Promise((resolve) => resolve("getTotals result"));
    }

    salesDetail(printOnPos) {
        console.log(`[salesDetail] params - printOnPos: ${printOnPos}`);
        return getData('salesDetail');
    }
}
