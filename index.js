const express = require('express')
const cors = require('cors');
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())



const port = 3400;

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.user}:${process.env.password}@cluster0.6emt6xb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {


  const volunteer = client.db("volunteer");
  const event = volunteer.collection("event")
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
            const cursor = event.find({})
            const result =  await cursor.toArray()
            res.send(result)
         
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