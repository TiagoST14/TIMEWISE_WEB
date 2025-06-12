const mongoose = require('mongoose')

const Login = mongoose.model('Login',{
    email: String,
    senha: String
})
const LoginFuncionario = mongoose.model('LoginFunc',{
    func_cpf:string
})
module.exports = LoginFuncionario;
module.exports = Login;