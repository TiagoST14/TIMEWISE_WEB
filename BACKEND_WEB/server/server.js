const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Função para gerar o token JWT
const createToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

// Middleware para verificar o token JWT
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(403).json({ msg: "Acesso negado!" });
    }

    try {
        const verified = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.userId = verified.id;
        req.userNome = verified.nome;
        next();
    } catch (error) {
        return res.status(401).json({ msg: "Token inválido!" });
    }
};

// Rota pública
app.get('/', (req, res) => {
    return res.status(202).json({ message: "Servidor online!" });
});
app.listen(3000, () => console.log("Servidor online!"));

// Conexão com o banco de dados MongoDB
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.3jnymxn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => console.log("Conectado ao banco!"))
    .catch((err) => console.log(err));

// Importação do modelo de usuário
const User = require('../models/User');

// Rota para registro de usuário
app.post('/registro', async (req, res) => {
    const { nome, email, numeroCadastroEmpresa, telefone, senha } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(422).json({ erroemailmsg: "Por favor, utilize outro email!" });
        }

        const passwordHash = await bcrypt.hash(senha, 10);

        const novoUsuario = new User({
            nome,
            email,
            telefone,
            numeroCadastroEmpresa,
            senha: passwordHash,
        });

        await novoUsuario.save();

        res.status(200).json({ message: "Usuário cadastrado!" });
        console.log('Usuário cadastrado:', novoUsuario);
    } catch (error) {
        console.error('Erro ao salvar o usuário:', error);
        res.status(500).json({ message: "Erro inesperado ao cadastrar o usuário. Tente novamente mais tarde." });
    }
});

// Rota para login de usuário (sem middleware de autenticação)
app.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(422).json({ msg: "O Email e a Senha são obrigatórios!" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "Usuário não encontrado" });
        }

        const senhaCorreta = await bcrypt.compare(senha, user.senha);
        if (!senhaCorreta) {
            return res.status(422).json({ msg: "Email ou Senha incorretos!" });
        }

        const token = createToken(user._id, user.nome); 
        const nome = (user.nome)

        return res.status(200).json({ msg: "Login efetuado com sucesso!",nome, token });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ message: "Erro inesperado ao fazer login. Tente novamente mais tarde." });
    }
});


//ROTA PARA LOGIN COMO FUNCIONARIO (CPF)
app.post("/login-cpf", async (req, res) => {
    const { cpf, senha, } = req.body;

    if (!cpf || !senha) {
        return res.status(422).json({ msg: "O CPF e a senha são obrigatórios!" });
    }

    try {
        // Buscar funcionário pelo CPF
        const cpfLimpo = cpf.replace(/[.-]/g, '');
        const funcionario = await Funcionario.findOne({
            $expr: {
                $eq: [
                    { $replaceAll: { input: { $replaceAll: { input: "$func_cpf", find: ".", replacement: "" } }, find: "-", replacement: "" } },
                    cpfLimpo
                ]
            }
        });
        if (!funcionario) {
            return res.status(404).json({ msg: "Funcionário não encontrado!" });
        }

        // Verificar se a senha é igual ao CPF
        if (senha !== funcionario.func_cpf) {
            return res.status(422).json({ msg: "Senha incorreta!" });
        }

        // Gerar token de autenticação
        const token = createToken(funcionario._id, funcionario.func_nome);
        const nome = funcionario.func_nome;
        const func_cpf = funcionario.func_cpf;


        return res.status(200).json({ msg: "Login efetuado com sucesso!", nome, token, func_cpf });
    } catch (error) {
        console.error('Erro ao fazer login com CPF:', error);
        res.status(500).json({ message: "Erro inesperado ao fazer login. Tente novamente mais tarde." });
    }
});



// Exemplo de rota protegida
app.get('/dashboard', authMiddleware, (req, res) => {
    res.status(200).json({ msg: `Bem-vindo ao painel, usuário ${req.userId}` });
});



//rota para inserir Funcionario
const Funcionario = require('../models/Funcionario.js')
app.post("/funcCadastro", async (req, res) => {
    const { func_nome, func_email, func_cpf, 
        func_nasc, func_sexo, func_tel, 
        func_end, func_contrato, func_setor, 
        func_filial, func_escala } = req.body
    
    try {
        // Verificar se o funcionario já existe
        const funcExists = await Funcionario.findOne({ func_cpf: func_cpf })
        if (funcExists) {
            return res.status(422).json({ errorcpfmsg: "CPF ja cadastrado! Utilize outro cpf!" })
        }
        

        // Criação do novo funcionário
        const novoFuncionario = new Funcionario({
            func_nome,
            func_email,
            func_cpf,
            func_nasc,
            func_sexo,
            func_tel,
            func_end,
            func_contrato,
            func_setor,
            func_filial,
            func_escala
        });

        
        await novoFuncionario.save();

        res.status(200).json({ message: "Funcionário cadastrado com sucesso!" });
        console.log('Funcionário cadastrado:', novoFuncionario);
    } catch (error) {
        console.error('Erro ao salvar o Funcionário:', error);
        res.status(500).json({ message: "Erro inesperado ao cadastrar o Funcionário. Tente novamente mais tarde." });
    }
})
// Rota para buscar usuário por nome
// exemplo de requisição:   http://localhost:3000/buscar?nome=Ruan
app.get('/buscar', async (req, res) => {
    const { nome } = req.query;

    // Verificação se o nome foi fornecido na query string
    if (!nome) {
        return res.status(422).json({ msg: "O nome do usuário é obrigatório!" });
    }

    try {
        // Buscar um único usuário por nome (usando findOne)
        const usuario = await User.findOne({ nome: { $regex: new RegExp(nome, 'i') } });

        // Se o usuário não for encontrado
        if (!usuario) {
            return res.status(404).json({ msg: "Usuário não encontrado" });
        }

        // Se o usuário for encontrado, retornar os dados
        return res.status(200).json(usuario);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ message: "Erro inesperado ao buscar usuário. Tente novamente mais tarde." });
    }
});


// Rota para buscar e atualizar o funcionário pelo CPF
app.put("/funcUpdateByCPF/:cpf", async (req, res) => {
    const cpf = req.params.cpf;  // CPF do funcionário
    const {
        func_nome: novo_nome, 
        func_email, func_cpf, func_nasc, func_sexo, 
        func_tel, func_end, func_contrato, func_setor, 
        func_filial, func_escala
    } = req.body;

    try {
        // Encontrar o funcionário pelo CPF
        let funcionario = await Funcionario.findOne({ func_cpf: cpf });

        if (!funcionario) {
            return res.status(404).json({ message: "Funcionário não encontrado!" });
        }

        // Verificar se o CPF já está em uso por outro funcionário (evitar atualização para um CPF existente)
        if (func_cpf && func_cpf !== funcionario.func_cpf) {
            const cpfExists = await Funcionario.findOne({ func_cpf: func_cpf });
            if (cpfExists) {
                return res.status(422).json({ message: "CPF já está em uso por outro funcionário!" });
            }
        }

        // Atualizar os dados do funcionário
        funcionario = await Funcionario.findOneAndUpdate(
            { func_cpf: cpf },
            {
                $set: {
                    func_nome: novo_nome || funcionario.func_nome,
                    func_email: func_email || funcionario.func_email,
                    func_cpf: func_cpf || funcionario.func_cpf,
                    func_nasc: func_nasc || funcionario.func_nasc,
                    func_sexo: func_sexo || funcionario.func_sexo,
                    func_tel: func_tel || funcionario.func_tel,
                    func_end: func_end || funcionario.func_end,
                    func_contrato: func_contrato || funcionario.func_contrato,
                    func_setor: func_setor || funcionario.func_setor,
                    func_filial: func_filial || funcionario.func_filial,
                    func_escala: func_escala || funcionario.func_escala
                }
            },
            { new: true } // Retorna o documento atualizado
        );

        res.status(200).json({ message: "Funcionário atualizado com sucesso!", funcionario });
    } catch (error) {
        console.error('Erro ao atualizar o Funcionário:', error);
        res.status(500).json({ message: "Erro ao atualizar o Funcionário. Tente novamente mais tarde." });
    }
});


// Rota para inserir Funcionário
//const Funcionario = require('../models/Funcionario.js');

app.post("/funcCadastro", async (req, res) => {
    const { func_nome, func_email, func_cpf, 
            func_nasc, func_sexo, func_tel, 
            func_end, func_contrato, func_setor, 
            func_filial, func_escala } = req.body;

    try {
        // Verificar se o funcionário já existe pelo CPF
        const funcExists = await Funcionario.findOne({ func_cpf });
        if (funcExists) {
            return res.status(422).json({ errorcpfmsg: "CPF já cadastrado! Utilize outro CPF!" });
        }

        // Criação do novo funcionário
        const novoFuncionario = new Funcionario({
            func_nome,
            func_email,
            func_cpf, // Armazenando o CPF sem hash
            func_nasc,
            func_sexo,
            func_tel,
            func_end,
            func_contrato,
            func_setor,
            func_filial,
            func_escala
        });

        // Salvar o novo funcionário no banco de dados
        await novoFuncionario.save();

        res.status(200).json({ message: "Funcionário cadastrado com sucesso!" });
        console.log('Funcionário cadastrado:', novoFuncionario);
    } catch (error) {
        console.error('Erro ao salvar o Funcionário:', error);
        res.status(500).json({ message: "Erro inesperado ao cadastrar o Funcionário. Tente novamente mais tarde." });
    }
});
// Rota para buscar todos os funcionários
app.get('/funcionarios', async (req, res) => {
    try {
        // Buscar todos os funcionários no banco de dados
        const funcionarios = await Funcionario.find();

        // Se não houver funcionários, retornar uma mensagem adequada
        if (funcionarios.length === 0) {
            return res.status(404).json({ msg: "Nenhum funcionário encontrado" });
        }

        // Retornar os funcionários encontrados
        return res.status(200).json(funcionarios);
    } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
        return res.status(500).json({ message: "Erro ao buscar funcionários. Tente novamente mais tarde." });
    }
});

// Rota para buscar um funcionário pelo CPF, permitindo sem formatação
app.get('/funcionario/:cpf', async (req, res) => {
    try {
        // Obter o CPF da URL e remover formatações, se necessário
        const rawCPF = req.params.cpf;
        const formattedCPF = rawCPF.replace(/[.-]/g, ''); // Remove formatações

        // Buscar o funcionário no banco com ou sem formatação
        const funcionario = await Funcionario.findOne({
            func_cpf: { $regex: new RegExp(`^${rawCPF}$|^${formattedCPF}$`) }
        });

        if (!funcionario) {
            return res.status(404).json({ message: "Funcionário não encontrado" });
        }

        return res.status(200).json(funcionario);
    } catch (error) {
        console.error('Erro ao buscar funcionário:', error);
        return res.status(500).json({ message: "Erro ao buscar funcionário. Tente novamente mais tarde." });
    }
});


// Rota para buscar usuário por nome
app.get('/buscar', async (req, res) => {
    const { nome } = req.query;

    if (!nome) {
        return res.status(422).json({ msg: "O nome do usuário é obrigatório!" });
    }

    try {
        // Buscar usuário por nome
        const usuario = await User.find({ nome: { $regex: new RegExp(nome, 'i') } });

        if (usuario.length === 0) {
            return res.status(404).json({ msg: "Usuário não encontrado" });
        }

        return res.status(200).json(usuario);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ message: "Erro inesperado ao buscar usuário. Tente novamente mais tarde." });
    }
});

// Rota para excluir um funcionário
app.delete('/funcionarios/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await Funcionario.findByIdAndDelete(id);
  
      if (!result) {
        return res.status(404).json({ message: "Funcionário não encontrado" });
      }
  
      return res.status(200).json({ message: "Funcionário excluído com sucesso" });
    } catch (error) {
      console.error('Erro ao excluir funcionário:', error);
      return res.status(500).json({ message: "Erro ao excluir funcionário. Tente novamente mais tarde." });
    }
});




const Register = require('../models/Register');  // Importa o modelo de registro
// Rota para registrar o ponto
app.post('/registrarPonto', async (req, res) => {
    const { cpf, localizacao, tipo } = req.body;  // Extrai CPF e localização do corpo da requisição

    // Validação para verificar se CPF e localização foram fornecidos
    if (!cpf || !localizacao || !tipo) {
        return res.status(400).json({ message: 'CPF e localização são obrigatórios.' });
    }

    try {
        // Verifica se o CPF existe na coleção de funcionários
        const cpfLimpo = cpf.replace(/[.-]/g, '');
        const funcionario = await Funcionario.findOne({
            $expr: {
                $eq: [
                    { $replaceAll: { input: { $replaceAll: { input: "$func_cpf", find: ".", replacement: "" } }, find: "-", replacement: "" } },
                    cpfLimpo
                ]
            }
        });
        if (!funcionario) {
            return res.status(404).json({ message: 'CPF não encontrado. Por favor, forneça um CPF válido.' });
        }

        // Obtém a data e a hora atuais
        const now = new Date();
        const data = now.toLocaleDateString();
        const hora = now.toLocaleTimeString();
        

        // Criação do novo registro
        const novoRegistro = new Register({
            cpf,
            nome: funcionario.func_nome,  // Adiciona o nome do funcionário
            data,
            hora,
            tipo,
            localizacao: {
                road: localizacao.road,
                neighbourhood: localizacao.neighbourhood,
                city: localizacao.city,
                lat: localizacao.lat,
                lon: localizacao.lon
            }
        });

        // Salva o registro no banco de dados
        await novoRegistro.save();
        res.status(200).json({ message: 'Registro de ponto salvo com sucesso!' });  // Retorna sucesso
    } catch (error) {
        console.error('Erro ao salvar o registro de ponto:', error);
        res.status(500).json({ message: 'Erro ao salvar o registro de ponto.' });  // Retorna erro
    }
});
/*app.get('/buscaRegistro', async (req, res) => {
    try {
        // Buscar todos os funcionários no banco de dados
        const registros = await Register.find();

        // Se não houver funcionários, retornar uma mensagem adequada
        if (registros.length === 0) {
            return res.status(404).json({ msg: "Nenhum registro encontrado" });
        }

        // Retornar os funcionários encontrados
        return res.status(200).json(registros);
    } catch (error) {
        console.error('Erro ao buscar registros:', error);
        return res.status(500).json({ message: "Erro ao buscar registros. Tente novamente mais tarde." });
    }
});*/


// Rota para buscar registros com filtros opcionais
app.get('/registros', async (req, res) => {
    try {
        const { nome, dataInicio, dataFim, cpf, data } = req.query;
        const query = {};

        if (nome) {
            query.nome = { $regex: nome, $options: 'i' };
        }

        if (cpf) {
            // Remove pontos e traços do CPF buscado
            const cpfLimpo = cpf.replace(/[.-]/g, '');
            // Busca registros cujo CPF salvo, sem formatação, bate com o buscado
            query.$expr = {
                $eq: [
                    { $replaceAll: { input: { $replaceAll: { input: "$cpf", find: ".", replacement: "" } }, find: "-", replacement: "" } },
                    cpfLimpo
                ]
            };
        }

        if (data) {
            query.data = data;
        }

        // Filtro por intervalo de datas (para datas no formato "dd/mm/aaaa")
        if (dataInicio && dataFim) {
            query.$expr = {
                $and: [
                    { 
                        $gte: [
                            { 
                                $dateFromString: { 
                                    dateString: "$data", 
                                    format: "%d/%m/%Y" 
                                } 
                            }, 
                            new Date(dataInicio)
                        ] 
                    },
                    { 
                        $lte: [
                            { 
                                $dateFromString: { 
                                    dateString: "$data", 
                                    format: "%d/%m/%Y" 
                                } 
                            }, 
                            new Date(dataFim)
                        ] 
                    }
                ]
            };
        }

        const registros = await Register.find(query);
        res.status(200).json(registros);

    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ message: 'Erro ao buscar registros.' });
    }
});

// Rota para buscar registros com filtros
app.get('/registros', authMiddleware, async (req, res) => {
    try {
        const { nome, dataInicio, dataFim } = req.query;
        const query = {};

        // Filtro por nome
        if (nome) {
            query.nome = { $regex: nome, $options: 'i' };
        }

        // Filtro por intervalo de datas (formato dd/mm/aaaa)
        if (dataInicio || dataFim) {
            query.data = {};
            
            if (dataInicio) {
                query.data.$gte = dataInicio;
            }
            
            if (dataFim) {
                query.data.$lte = dataFim;
            }
        }

        // Busca registros ordenados por data e hora
        const registros = await Register.find(query)
            .sort({ data: 1, hora: 1 }); // Ordena por data e hora

        res.status(200).json(registros);

    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ message: 'Erro ao buscar registros.' });
    }
});

// Rota para obter as datas mínima e máxima de registros
app.get('/registros/datas', authMiddleware, async (req, res) => {
    try {
        const minDateDoc = await Register.findOne().sort({ data: 1 });
        const maxDateDoc = await Register.findOne().sort({ data: -1 });
        
        res.status(200).json({
            minDate: minDateDoc ? minDateDoc.data : null,
            maxDate: maxDateDoc ? maxDateDoc.data : null
        });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ message: 'Erro ao buscar datas disponíveis' });
    }
});
module.exports = app;