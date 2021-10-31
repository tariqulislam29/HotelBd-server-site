const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ftjlc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        const database = client.db('hotelbd');
        const roomsCollection = database.collection('rooms');
        const stafsCollection = database.collection('stafs');
        const picturesCollection = database.collection('pictures');
        const ordersCollection = database.collection('placeOrders');

        // GET API
        app.get('/rooms', async (req, res) => {
            const cursor = roomsCollection.find({});
            const rooms = await cursor.toArray();
            res.send(rooms);
        });
        app.get('/stafs', async (req, res) => {
            const cursor = stafsCollection.find({});
            const stafs = await cursor.toArray();
            res.send(stafs);
        });
        app.get('/pictures', async (req, res) => {
            const cursor = picturesCollection.find({});
            const pictures = await cursor.toArray();
            res.send(pictures);
        });
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });
        // GET Single book
        app.get('/rooms/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };
            const book = await roomsCollection.findOne(query);
            res.json(book);
        });





        // POST API 
        app.post('/placeOrders', async (req, res) => {
            const orders = req.body;
            const result = await ordersCollection.insertOne(orders);
            console.log(result);
            res.json(result)
        });

        app.post('/rooms', async (req, res) => {
            const rooms = req.body;
            const result = await roomsCollection.insertOne(rooms);
            console.log(result);
            res.json(result)
        });

        // DELETE API 
        app.delete('/orders/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);

            res.json(result);


        })


        // PUT API 
        app.put('/orders/:id', async (req, res) => {

            const id = req.params.id;

            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: `approved`
                },
            };
            const result = await ordersCollection.updateOne(filter, updateDoc);

            res.json(result);


        })


    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('server running Hotel BD');
});

app.listen(port, () => {
    console.log('Server running at port', port);
})