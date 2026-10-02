const express = require('express');
const cors = require('cors');
const midtransClient = require('midtrans-client');

const app = express();

// Set Header CORS Lengkap
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
     return res.status(200).end();
  }
  next();
});

app.use(express.json());

let snap = new midtransClient.Snap({
    isProduction: true,
    serverKey: process.env.MIDTRANS_SERVER_KEY
});

app.post('/api/create-transaction', async (req, res) => {
    try {
        const { userId, price, itemName } = req.body;

        let parameter = {
            "transaction_details": {
                "order_id": "AXS-" + Date.now(),
                "gross_amount": parseInt(price)
            },
            "item_details": [{
                "id": "ITEM-1",
                "price": parseInt(price),
                "quantity": 1,
                "name": itemName || "Diamond ML"
            }],
            "customer_details": {
                "first_name": "User",
                "last_name": userId
            }
        };

        const transaction = await snap.createTransaction(parameter);
        res.status(200).json({ token: transaction.token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = app;

