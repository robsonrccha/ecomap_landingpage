const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");

const app = express();
app.use(express.json());
app.use(cors());

// Configuração do rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requisições por IP
});
app.use(limiter);

// Conectar ao MongoDB Atlas (usando variável de ambiente)
const mongoURI = process.env.MONGO_URI || "mongodb+srv://rrocha:P1hXmR84JwrZRIUK@cluster0.hbxfupw.mongodb.net/ecomapDB";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("🔥 Conectado ao MongoDB Atlas"))
.catch(err => console.error("❌ Erro ao conectar ao MongoDB:", err));

// Modelo de Usuário
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

const User = mongoose.model("User", UserSchema);

// Rota para salvar dados no MongoDB
app.post("/subscribe", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Nome e e-mail são obrigatórios." });
    }

    // Validação simples de e-mail
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "E-mail inválido." });
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

// Definir a porta para o Vercel
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});