const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
var jwt = require("jsonwebtoken");
const port = process.env.PORT || 4321;

// middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "tech-world-client-1def7.web.app", "tech-world-client-1def7.firebaseapp.com"],
    credentials: true,
  })
);
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jrqljyn.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const serviceCollection = client.db("techWorld").collection("service");
    const userCollection = client.db("techWorld").collection("user");
    const cartCollection = client.db("techWorld").collection("cart");
    const brandCollection = client.db("techWorld").collection("brand");
    const reviewCollection = client.db("techWorld").collection("review");
    const newsCollection = client.db("techWorld").collection("news");

    // jwt api
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN, {
        expiresIn: "1h",
      });
      res.send({ token });
    });

    // user api
    app.post("/user", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const ifExist = await userCollection.findOne(query);
      if (ifExist) {
        return res.send({ message: "user already exist", insertedId: null });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.get("/user", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    // service api
    app.get("/service", async (req, res) => {
      const result = await serviceCollection.find().toArray();
      res.send(result);
    });

    app.post("/service", async (req, res) => {
      const productItem = req.body;
      const result = await serviceCollection.insertOne(productItem);
      res.send(result);
    });

    // brand api
    app.get("/brand", async (req, res) => {
      const result = await brandCollection.find().toArray();
      res.send(result);
    });


    // review api
    app.get("/review", async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    });


    // news api
    app.get("/news", async (req, res) => {
      const result = await newsCollection.find().toArray();
      res.send(result);
    });


    // cart api
    app.post("/cart", async (req, res) => {
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem);
      res.send(result);
    });

    app.get("/cart", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    app.patch('/cart/:id', async (req, res) => {
      const item = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
          $set: {
              name: item.name,
              type: item.type,
              price: parseFloat(item.price),
              brand: item.brand,
              rating: item.rating,
              details: item.details,
              image: item.image
          }
      }

      const result = await cartCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
  })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("tech world is running");
});

app.listen(port, () => {
  console.log(`tech world server is running through port ${port}`);
});
