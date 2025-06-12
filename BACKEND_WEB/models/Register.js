const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
    cpf: { type: String, required: true }, 
    nome: { type: String, required: true },
    data: { type: String, required: true },
    hora: { type: String, required: true },
    tipo: { type: String, required:true },
    localizacao: {
        road: String,         // Rua
        neighbourhood: String, // Bairro
        city: String,        // Cidade
        lat: String,         // Latitude
        lon: String          // Longitude
    }
});

const Register = mongoose.model('Register', registerSchema);
module.exports = Register;
