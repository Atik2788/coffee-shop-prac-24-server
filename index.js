const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8ev4byy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// console.log(uri);



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

    const coffeeCollection = client.db("coffeeDB").collection("coffee");
    const userCollection = client.db("coffeeDB").collection("users");
    // const userCollection = client.db("coffeeDB").collection("user")

    app.get('/coffee', async(req, res) =>{
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();  
      res.send(result)
    })

    app.post('/coffee', async (req, res) => {
      const newCoffee = req.body;
      // console.log(newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result)
    })

    app.delete('/coffee/:id', async(req, res) =>{
      const id = req.params.id;
      // console.log(id);
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.deleteOne(query)
      res.send(result)
    })

    // for update/edit coffee id
    app.get('/coffee/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.findOne(query)
      res.send(result)
    })

    // updated coffee
    app.put('/coffee/:id', async(req, res) =>{
      const id = req.params.id;
      // console.log(id);
      const filter = {_id: new ObjectId(id)};
      const option = {upsert: true};
      const updatedCoffee = req.body;
      // console.log(updatedCoffee);

      const newCoffee = {
        $set:{
          name: updatedCoffee.name, 
          quantity: updatedCoffee.quantity, 
          supplier: updatedCoffee.supplier, 
          taste: updatedCoffee.taste, 
          details: updatedCoffee.details, 
          photo: updatedCoffee.photo
        }
      }
      const result = await coffeeCollection.updateOne(filter, newCoffee, option);
      res.send(result);
    })


    // User Collection ***********************
    // User Collection ***********************

    app.get('/users', async(req, res) =>{
      const cursor = userCollection.find();
      const users = await cursor.toArray()
      res.send(users)
    })

    app.post('/users', async(req,res) =>{
      const newUser = req.body;
      // console.log(newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result)
    })

    app.patch('/users', async(req, res) =>{
      const user = req.body;
      const filter = {email: user.email}
      const updatedDoc = {
        $set: {
          lastLoggedAt: user.lastLoggedAt
        }
      }
      const result = await userCollection.updateOne(filter, updatedDoc)
      res.send(result)
    })

    app.delete('/users/:id', async(req, res)=>{
      const id = req.params.id;
      console.log(id);
      const query = {_id: new ObjectId (id)}
      const result = await userCollection.deleteOne(query);
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('coffee store server is running')
})



app.listen(port, () => {
  console.log(`coffee store server is running on PORT:`, port);
})