import dotenv from 'dotenv';
import * as puntosModel from '../models/puntos.model.js';
import * as techPointsModel from '../models/techPoints.model.js';
dotenv.config();

const PAY_PAL_API = process.env.PAY_PAL_API;
const PAY_PAL_CLIENTID = process.env.PAY_PAL_CLIENTID;
const PAY_PAL_SECRETKEYS = process.env.PAY_PAL_SECRETKEYS;

export const createOrder = async (req, res) => {
  const {id_empresa, id_techpoints } = req.body;
  const valor = await techPointsModel.obtenerPrecioPuntos(id_techpoints);
  const host = req.get('host');
  const protocol = req.protocol;

const order = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: `${valor}`
        },
        custom_id: `${id_empresa}-${id_techpoints}`
      }
    ],
    application_context: {
      brand_name: "TechBridge",
      landing_page: "NO_PREFERENCE",
      user_action: "PAY_NOW",
      return_url: `${protocol}://${host}/api/payment/capture-order`,
      cancel_url: `${protocol}://${host}/api/payment/cancel-order`
    }
  };



  try{
    const response = await fetch(`${PAY_PAL_API}/v2/checkout/orders`,{
      method : "POST",
      headers : { 
        'Authorization': `Bearer ${await getAccessToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    });
    const orderdata = await response.json();

    return res.json(orderdata);
  }catch(error){
    res.status(500).json({error: "error en la pasarela de pago"})
  }
  
};
export const captureOrder = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: "Token no proporcionado" });
  }

  try {
    const access_token = await getAccessToken();

    const response = await fetch(`${PAY_PAL_API}/v1/checkout/orders/${token}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.status !== "COMPLETED") {
      return res.redirect(`http://localhost:5173/comprar-puntos?payment=failed`);
    }

    // Buscar el custom_id desde distintas rutas posibles
    const capture = data?.purchase_units?.[0]?.payments?.captures?.[0];
    const purchaseUnit = data?.purchase_units?.[0];

    const customId = capture?.custom_id || purchaseUnit?.custom_id || "";

    const [id_empresa, id_techpoints] = customId.split("-");

    if (!id_empresa || !id_techpoints) {
      return res.status(400).json({ error: "custom_id malformado o no encontrado" });
    }

    await puntosModel.asingarPuntos(id_empresa, id_techpoints);

    return res.redirect(`http://localhost:5173/comprar-puntos?paymentId=${token}&PayerID=success&token=${token}`);

  } catch (error) {
    console.error("Error al capturar la orden:", error);
    return res.status(500).json({ error: "Error interno al capturar la orden" });
  }
};




export const cancelOrder = async (req, res) =>{
        return res.redirect(`http://localhost:5173/comprar-puntos?payment=cancelled`);
}


//funcion para consguir el token de acceso

 const getAccessToken = async ()=>{
    //el basic id:key espera un base64, asi queusamos buffer para convertirlo en una secuencia de bytes (buffer) y luego lo pasamos a base 64 para que lo acepte 
    const basicAuth = Buffer.from(`${PAY_PAL_CLIENTID}:${PAY_PAL_SECRETKEYS}`).toString('base64');

    //aqui hacemos el procedimiento para adquirir el token de acceso
    const token = await fetch(`${PAY_PAL_API}/v1/oauth2/token`,{
      method: "POST",//metodo
      headers: {//los heades que este rquiere Authorization y Content-Type
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'//usamos esto para volverlo texto plano y asi pypal lo admite
      },
      body: 'grant_type=client_credentials'
    });

    const { access_token } = await token.json();
    return access_token;
  }
