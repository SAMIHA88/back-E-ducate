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
    nom: String,
    password: String,
    cpassword: String,
    profileImage: String,
    role:String,
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
        res.status(500).json({ error: "Error" }); 
    }
});
//api authentification
app.post("/Authentification", async (req, res) => {
  console.log(req.body);
  const { email, password,nom } = req.body;

  try {
    const user = await userModel.findOne({ email: email });

    if (user) {

      if (user.password === password) {
        const dataSend = {
          _id: user._id,
          email: user.email,
          nom: user.nom,
          role: user.role,
          profileImage: user.profileImage,
        };
        console.log(dataSend);

        if (user.role === req.body.role) {
          res.send({ message: "Authentification Valide", alert: true, data: dataSend });
        } else {
          res.send({ message: "Rôle invalide", alert: false });
        }
      } else {
        res.send({ message: "Mot de passe erroné", alert: false });
      }
    } else {
      res.send({ message: "Email erroné", alert: false });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erreur lors de l'authentification" });
  }
});



// start the Express server
app.listen(PORT, () => {
  console.log(`Serveur démaré sur le port: ${PORT}`);
});