const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
require('dotenv').config();
const port = process.env.PORT || 5000;
app.use(express.json());



app.get("/", (req, res) => {
    res.send("Server is Running");
})

app.listen(port, () => {
    console.log(`App is listening on ${port}`);
})


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.pcelgh9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const userCollection = client.db("dribbble").collection("userCollections");


        app.post("/users", async (req, res) => {
            const userInfo = req.body;
            console.log(userInfo);

            const result = await userCollection.insertOne(userInfo);
            res.send(result);
        })
        app.patch("/profileUpdate/:email", async (req, res) => {
            const profileUpdateInfo = req.body;
            console.log(profileUpdateInfo);
            const email = req.params.email;
            console.log(email);
            const query = {
                email: email,
            }

            const updateInfo = {

                $set: {
                    location: profileUpdateInfo.location,
                    image: profileUpdateInfo.image
                }

            }

            console.log(updateInfo);

            const result = await userCollection.updateOne(query, updateInfo);
            res.send(result);
        })
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
