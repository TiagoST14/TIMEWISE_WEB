const mongoose = require('mongoose')

const Funcionario = mongoose.model('Funcionario',{
    func_nome: String,
    func_email: String,
    func_cpf: String,
    func_nasc: String,
    func_sexo: String,
    func_tel: String,
    func_end: String,
    func_contrato: String,
    func_setor: String,
    func_filial: String,
    func_escala: String
});

module.exports = Funcionario;