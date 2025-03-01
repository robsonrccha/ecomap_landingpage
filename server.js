const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, "public")));

// Conectar ao MongoDB Atlas
mongoose.connect("mongodb+srv://rrocha:P1hXmR84JwrZRIUK@cluster0.hbxfupw.mongodb.net/ecomapDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("🔥 Conectado ao MongoDB Atlas"))
.catch(err => console.error("❌ Erro ao conectar ao MongoDB:", err));

const UserSchema = new mongoose.Schema({
  name: String,
  email: String
});

const User = mongoose.model("User", UserSchema);

// Rota para salvar dados no MongoDB
app.post("/subscribe", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Nome e e-mail são obrigatórios." });
    }

    const newUser = new User({ name, email });
    await newUser.save();

    res.status(201).json({ message: "Cadastro realizado com sucesso!" });
  } catch (error) {
    console.error("Erro no servidor:", error);
    res.status(500).json({ error: "Erro no servidor." });
  }
});

// Servir a landing page no acesso a "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Se o Vercel fornecer o PORT, usamos ele, senão usamos a porta 5000.
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
