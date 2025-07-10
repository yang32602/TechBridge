
import dotenv from 'dotenv';
dotenv.config();

const PAY_PAL_API = process.env.PAY_PAL_API;
const PAY_PAL_CLIENTID = process.env.PAY_PAL_CLIENTID;
const PAY_PAL_SECRETKEYS = process.env.PAY_PAL_SECRETKEYS;

export const createOrder = async (req, res) => {
  const host = req.get('host');
  const protocol = req.protocol;

  const order = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: `1000`
        }
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

  try {
    // Autenticación con PayPal
    const basicAuth = Buffer
      .from(`${PAY_PAL_CLIENTID}:${PAY_PAL_SECRETKEYS}`)
      .toString('base64');

    const tokenRes = await fetch(`${PAY_PAL_API}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    const tokenData = await tokenRes.json();
    const access_token = tokenData.access_token;

    // Crear la orden
    const orderRes = await fetch(`${PAY_PAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`
      },
      body: JSON.stringify(order)
    });

    const orderData = await orderRes.json();

    return res.json(orderData);
  } catch (error) {
    console.error("Error creando la orden de PayPal:", error);
    return res.status(500).json({ error: "Error creando la orden" });
  }
};


export const captureOrder = async (req, res) =>{
    return res.status(200).json({mensaje: 'todo chill en la capture'});
}

export const cancelOrder = async (req, res) =>{
    return res.status(200).json({mensaje: 'todo chillc el man cancelo'});
}