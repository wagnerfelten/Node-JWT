require("dotenv").config();

const express = require("express");
const mogoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

//Config Json
app.use(express.json());

//Models
const User = require("./models/User");

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Bem vindo a nossa API" });
});

//Registro User 
app.post("/auth/register", async(req, res) => {
    const {name, email, password, confirmPassword} = req.body;

    if(!name){
        return res.status(422).json({msg: "O nome é obrigatório!"})
    }

    if(!email){
        return res.status(422).json({msg: "O email é obrigatório!"})
    }

    if(!password){
        return res.status(422).json({msg: "A senha é obrigatório!"})
    }

    if(password !== confirmPassword){
        return res.status(422).json({msg: "As senhas não conferem!"})
    }

    //Check if user
    const userExists = await User.findOne({email: email});

    if(userExists){
        return res.status(422).json({msg: "Email já existe!"})
    }

    //Create password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: passwordHash });

    try{
        await user.save()
        res.status(201).json({ msg: "Usúario criado com sucesso!" })
    } catch(error){
        console.log(error);
        res.status(500).json({ msg: "Aconteceu um erro no servidor, tente mais tarde!"});
    }
    
 });

 // Lgin user
app.post("/auth/login", async (req, res) => {
    const {email, password} = req.body;

    if(!email){
        res.status(422).json({msg: "Email obrigatório!"})
    }

    if(!password){
        res.status(422).json({msg: "Senha obrigatório!"})
    }

    const user = await User.findOne({email: email});

    if(!user){
        return res.status(422).json({msg: "Usúario não encontrado!"})
    }

    res.status(200).json({msg: "Login feito"})
})

//Credenciais
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mogoose
  .connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.bkkrwdj.mongodb.net/?retryWrites=true&w=majority`)
  .then(() => {
    app.listen(Port, () => console.log(`Running Server na PORT ${Port}`))
  })
  .catch((error) => console.log(error));
const Port = 3000;
