const express = require('express')
const cors = require('cors');
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())



const port = 3400;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.user}:${process.env.password}@cluster0.6emt6xb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {


  const volunteer = client.db("volunteer");
  const event = volunteer.collection("event")
  const donation = volunteer.collection("donation")
  try {
    // await client.connect();
    // console.log("database connected")

    // event post through admin
    app.post("/event", async (req, res) => {
      const data = req.body;
      const result = await event.insertOne(data)
      res.send(result)
    })


    /// get event through admin
    app.get("/event", async(req, res) => {

            const query = {}
            const cursor = event.find(query)
            const result =  await cursor.toArray()
            res.send(result)
         
    })

    /// specific event delete through admin

    app.delete("/delete/:id", async(req, res) => {
          
          const id = req.params.id;
          const query = {_id: ObjectId(id)}

          const result = await event.deleteOne(query)
          res.send(result)
    })

    // load single event through admin for update

    app.get('/event/:id', async(req, res) => {
         const id = req.params.id;
         const query = {_id: ObjectId(id)}
         const result = await event.findOne(query)
         res.send(result)
    })

      /// update single event through admin

      app.put("/event/:id", async (req,res) => {
          
             const id = req.params.id;
             const filter = {_id: ObjectId(id)}
             const options = { upsert: true };
             const doc = {
               $set:{
                    image: req.body.image,
                    title:req.body.title
               }
             };
              const result = await event.updateOne(filter,doc,options)
              res.send(result)
      })


      /// donation book for user and get single event detail 

      app.get("/book/:id", async (req, res) => {
            
              const  id = req.params.id;
              const query ={_id: ObjectId(id)}
              const result = await event.findOne(query)
              res.send(result)
      })

      //// store data from user for donation
      
      app.post("/bookDonate", async (req,res) => {
            
            const data = req.body;
            const result = await donation.insertOne(data)
            res.send(result)
      })

      //// per user donation book load  through email

      app.get("/donation", async  (req, res) => {
            const query = req.query.email;
            const email = {donerEmail: query}
            const cursor =  donation.find(email)
            const result = await cursor.toArray()
            res.send(result)
            console.log(email)
      })

  }
  finally {
    //   await client.close();
  }
}
run().catch(console.dir)

app.get("/", (req, res) => {

  res.send("server working")
})







app.listen(port, () => {
  console.log("this server starts")
})