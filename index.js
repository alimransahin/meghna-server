const express = require("express");
const cors=require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const app= express();
const port= process.env.PORT||5000;
require('dotenv').config();
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASSWORD}@cluster0.vgokw2y.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const servicesCollection = client.db('meghna-tourist').collection('services');
        app.get('/services', async (req,res)=>{
            const query={};
            const cursor=servicesCollection.find(query);
            const services=await cursor.toArray();
            res.send(services);
        })


    }
    finally{

    }
}
run().catch(err=>console.error(err));




app.get('/', (req, res) => {
    res.send('meghna tourist server is running')
})

app.listen(port, () => {
    console.log(`meghna tourist server running on ${port}`);
})