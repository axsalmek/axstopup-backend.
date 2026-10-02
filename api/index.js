const express = require('express');
const cors = require('cors');
const midtransClient = require('midtrans-client');

const app = express();

// Izinkan domain website kamu
app.use(cors({
    origin: '*' // Mengizinkan semua domain (termasuk www.axstopup.store) mengakses backend
}));

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
