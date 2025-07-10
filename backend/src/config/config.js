//aqui configuare todo lo de paypal
import dotenv from 'dotenv';
dotenv.config();

//Cliente
export const PAY_PAL_CLIENTID = process.env.PAY_PAL_CLIENTID;
//llave secreta
export const PAY_PAL_SECRETKEYS = process.env.PAY_PAL_SECRETKEYS;
//PAY PAL API
export const PAY_PAL_API = "https://api-m.sandbox.paypal.com";

console.log(PAY_PAL_API)
console.log(PAY_PAL_CLIENTID)
console.log(PAY_PAL_SECRETKEYS)