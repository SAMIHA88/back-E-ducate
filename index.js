require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

// N°Port
const PORT = process.env.PORT || 8080;

// MongoDB Connection
console.log(process.env.MONGODB_URL);
mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connecté à la base de données"))
    .catch((err) => {
        console.error("Erreur de connexion à la base de données:", err);
        process.exit(1); // Exit the application on connection error
    });

// Schema
const userSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
    },
    password: String,
    cpassword: String,
    profileImage: String,
});

// Model
const userModel = mongoose.model("user", userSchema);

// API
app.get("/", (req, res) => {
    res.send("Serveur démarré");
});
//api inscription
app.post("/Inscription", async (req, res) => {
    console.log(req.body);
    const { email } = req.body;

    try {
        const result = await userModel.findOne({ email: email });
        console.log(result);
        if (result) {
            res.send({ message: "Email existe déjà", alert: false });
        } else {
            const data = userModel(req.body)
            const save = data.save()
            res.send({ message: "Inscrit avec succès", alert: true });
        }
    } catch (err) {
        console.log(err);
        // Handle the error here
        res.status(500).json({ error: "Error" }); // Sending an error response (modify as needed)
    }
});
//api login
app.post("/Authentification", async (req, res) => {
    console.log(req.body);
    const { email } = req.body;
  
    try {
      const result = await userModel.findOne({ email: email });
  
      if (result) {
        const dataSend = {
          _id: result._id,
          email: result.email,
          profileImage: result.profileImage,
        };
        console.log(dataSend);
        res.send({ message: "Authentification Valide", alert: true ,data:dataSend});
      }else{
        res.send({ message: "Email erroné", alert:false});
      }
  
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Error" });
    }
  });
  




app.listen(PORT, () => console.log("Serveur démarré sur le port " + PORT));
