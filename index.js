const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require("cors")
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("welcome to coffe shop")
})


// const uri = "mongodb+srv://coffeMaster:Jk6vxoXGqPbsnUGm@cluster0.1u9t2.mongodb.net/?retryWrites=true&w=majority";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1u9t2.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection

        const coffeCollection = client.db("coffeDb").collection('coffe');

        //get coffe

        app.get('/coffe', async (req, res) => {
            const query = {}
            const allCoffe = await coffeCollection.find(query).toArray();
            res.send(allCoffe)
        })
        app.post('/coffe', async (req, res) => {
            const newCoffe = req.body;
            const result = await coffeCollection.insertOne(newCoffe)
            res.send(result)

        })

        app.get("/coffe/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeCollection.findOne(query);
            res.send(result)
        })

        app.delete('/coffe/:id', async (req, res) => {
            const id = req.params.id;

            const filter = { _id: new ObjectId(id) }
            const result = await coffeCollection.deleteOne(filter);
            res.send(result)
        })

        app.put('/coffe/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const updatedInfo = req.body;
            const options = { upsert: true }
            const updatedCoffe = {
                $set: {
                    name: updatedInfo.name, catagory: updatedInfo.catagory, supplier: updatedInfo.supplier, photo: updatedInfo.photo, quantity: updatedInfo.quantity
                }
            }

            const result = await coffeCollection.updateOne(filter, updatedCoffe, options);
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.listen(port, () => {
    console.log("the server is running");
})

