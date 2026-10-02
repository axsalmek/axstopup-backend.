const midtransClient = require('midtrans-client');

let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: 'SB-Mid-server-PASTE_SERVER_KEY_KAMU' // Ganti dengan Server Key Sandbox Midtrans kamu
});

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST' && req.url === '/api/create-transaction') {
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
                "name": itemName || "Diamond Topup"
            }],
            "customer_details": {
                "first_name": "User ID: " + userId
            }
        };

        try {
            const transaction = await snap.createTransaction(parameter);
            return res.status(200).json({ token: transaction.token });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method === 'POST' && req.url === '/api/midtrans-callback') {
        const notif = req.body;
        if (notif.transaction_status == 'settlement' || notif.transaction_status == 'capture') {
            console.log(`Order ${notif.order_id} LUNAS!`);
        }
        return res.status(200).send('OK');
    }

    return res.status(404).send('Not Found');
};
