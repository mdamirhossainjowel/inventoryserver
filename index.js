const express = require("express");
const cors = require("cors");

const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lhcdr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});


async function run() {
  try {
    await client.connect();
    const db = client.db("inventorysystem");
    const product_collection = db.collection("inventory_products");
    const catagory_collection = db.collection("inventory_catagory");
  
   

    app.get("/products", async (req, res) => {
      const query = {};
      const result = await product_collection.find(query).toArray();
      res.send(result);
    });
    app.post("/products", async (req, res) => {
      const addProduct = req.body;
      const result = await product_collection.insertOne(addProduct);
      const result1 = await catagory_collection.insertOne(addProduct);
      res.send(result);
    });
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await product_collection.findOne(filter);
      res.send(result);
    });
    app.get("/catagory", async (req, res) => {
      const query = {};
      const result = await catagory_collection.find(query).toArray();
      res.send(result);
    });
    app.get("/catagory/:catagory", async (req, res) => {
      const catagory = req.params.catagory;
      const result = await catagory_collection.find({ catagory: catagory }).toArray();
      res.send(result);
    });
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await product_collection.deleteOne(filter);
      res.send(result);
    });
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedoc = {
        $set: {
          available_quantity: data.available_quantity,
          minimum_quantity: data.minimum_quantity,
          price: data.price,
        },
      };
      const result = await product_collection.updateOne(
        filter,
        updatedoc,
        options
      );
      return res.send(result);
    });



  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello there i am from Inventory System Server");
});
app.listen(port, () => {
  console.log(`Inventory System listening on port ${port}`);
});
