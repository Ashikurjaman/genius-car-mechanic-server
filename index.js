const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();


const app = express();
const port = 5000;


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gshit.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try {
        await client.connect();
        // console.log("connected successfully");
        const database =client.db("Car-mechanic")
        const serviceCollection = database.collection("servics");

        // Get Api
        app.get("/servics", async (req, res) => {
            const cursor = serviceCollection.find({});
            const service = await cursor.toArray();
            res.send(service);
        });

        // GET Api
        app.get("/servics/:id", async (req, res) => {
            const id = req.params.id;
            console.log("confirm",id);
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.json(service);
        })

        // Post Api
        app.post("/servics", async(req, res) => {
            const service = req.body;
            console.log("hit the post api",service);



            const result = await serviceCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });

        // delete api

        app.delete("/servics/:id", async (req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await serviceCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("genius-server");
});




app.listen(port, ()=>{
    console.log("Running Genius server on port",port);
});