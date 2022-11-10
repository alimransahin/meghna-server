const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASSWORD}@cluster0.vgokw2y.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const servicesCollection = client.db('meghna-tourist').collection('services');
        const reviewCollection = client.db('meghna-tourist').collection('review');
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        app.get('/servicesHome', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query);
            res.send(service);
        })

        app.post('/review', async(req,res)=>{
            const review=req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })
        app.get('/review/:service', async (req, res) => {
            const service = req.params.service;
            const query = { service: service }
            const cursor = reviewCollection.find(query);
            const reviews=await cursor.toArray();
            res.send(reviews);
        })
        app.get('/my-reviews', async (req, res) => {
            // const decoded = req.decoded;
            
            // if(decoded.email !== req.query.email){
            //     res.status(403).send({message: 'unauthorized access'})
            // }

            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        app.delete('/my-reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally {

    }
}
run().catch(err => console.error(err));




app.get('/', (req, res) => {
    res.send('meghna tourist server is running')
})

app.listen(port, () => {
    console.log(`meghna tourist server running on ${port}`);
})