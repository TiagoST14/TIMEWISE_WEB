// window.onload = function(){
//     const token = localStorage.getItem('token');
//     if (!token ){
//         alert("Faça Login Novamente!")
//         window.location.href = "telaLogin.html";
//     }
//         const _grecaptcha = localStorage.getItem('_grecaptcha');
//     if (!_grecaptcha){
//         alert("Faça Login Novamente!")
//         window.location.href = "telaLogin.html";
//     }
// }
// document.addEventListener("DOMContentLoaded", function() {

//     document.getElementById("sair").addEventListener("click", function() {
//         localStorage.removeItem('token');
//         localStorage.removeItem('usuarioNome');
//         localStorage.removeItem('_grecaptcha');
        
//         window.location.href = "telaLogin.html";
//     });
//     function atualizarNomeUsuario(){
//         const usuarioLogElement = document.getElementById('usuario_log');
//         const usuarioNome = localStorage.getItem('usuarioNome')|| 'Usuário';
//         usuarioLogElement.textContent = usuarioNome
//     }
//     atualizarNomeUsuario();
// });

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("card_user").addEventListener("click", function() {
        
        window.location.href = "telaCadastro.html";
    });
    document.getElementById("sair").addEventListener("click", function() {
        
        window.location.href = "telaLogin.html";
    });
    document.getElementById('cardFuncionario').addEventListener("click",function(){
            
        window.location.href = "funcionarios.html";
    });

    document.getElementById('cardEmpresa').addEventListener("click",function(){
        window.location.href= "empresas.html";
    })
    
});


    

//Função para obter o endereço usando a API do Nominatim
const chaveApi = 'pk.09c321c4408ab27407892c09dcc2abff'
function obterEndereco(latitude, longitude, callback) {
    const url = `https://us1.locationiq.com/v1/reverse?key=${chaveApi}&lat=${latitude}&lon=${longitude}&format=json&`;
    fetch(url)
    .then((response) => response.json())
    .then((data) => {
        console.log("Resposta da API LocationIQ:", data); // Log para depuração

        if (data && data.address) {
            const road = data.address.road || "N/A";
            const suburb = data.address.suburb || "N/A";
            const city = data.address.city || "N/A";
            const country = data.address.country || "N/A";

            // Formata o endereço desejado
            const enderecoFormatado = `${road}, ${suburb}, ${city}, ${country}`;
            callback(enderecoFormatado);
        } else {
            callback('Endereço não encontrado.');
        }
    })
    .catch((error) => {
        console.error('Erro ao converter coordenadas em endereço:', error);
        callback('Erro ao obter o endereço.');
    });
}

// Função para registrar a data, hora e localização do clique
// Seletores dos elementos do DOM
const log = document.getElementById('log');
const modalConfirmacao = document.getElementById("modal-confirmacao");
const modalMensagem = document.getElementById("modal-confirmacao-message");
const confirmarBtn = document.getElementById("confirmar-btn");
const cancelarBtn = document.getElementById("cancelar-btn");
const closeModal = document.getElementById("close-modal");

let dataPonto, horaPonto;

// Função para garantir que números menores que 10 sejam formatados com zero à esquerda
function addZero(number) {
    return number < 10 ? `0${number}` : number;
}

// Função para registrar a hora atual
function registrarHora() {

    

    const now = new Date();
    
    // Obtendo a data e hora atuais
    const dia = addZero(now.getDate());
    const mes = addZero(now.getMonth() + 1);
    const ano = now.getFullYear();
    const hora = addZero(now.getHours());
    const minutos = addZero(now.getMinutes());
    const segundos = addZero(now.getSeconds());
    
    // Formatando data e hora
    dataPonto = `${dia}/${mes}/${ano}`;
    horaPonto = `${hora}:${minutos}:${segundos}`;

   
    

    
     showModalConfirmacao(dataPonto, horaPonto);
    
}

// Função para exibir o modal de confirmação
function showModalConfirmacao(data, hora) {
    modalMensagem.textContent = `Você tem certeza que deseja bater o ponto em ${data} às ${hora}?`;
    modalConfirmacao.style.display = "block"; // Exibe o modal

    // Passa os valores de data e hora para os botões de confirmação
    confirmarBtn.onclick = function() {
        registrarPonto(data, hora); // Passa a data e hora confirmadas
        modalConfirmacao.style.display = "none"; // Fecha o modal
    };
}

// Função para registrar o ponto
function registrarPonto(dataPonto, horaPonto) {
    // Verifica o número de registros existentes
    const registrosExistentes = log.querySelectorAll('.registro');
    if (registrosExistentes.length >= 8) {
        alert('Você já bateu o ponto 4 vezes hoje.');
        return;
    }

    // Cria o contêiner do registro
    const registroContainer = document.createElement('div');
    registroContainer.classList.add('registro-container');

    // Cria os elementos de data e hora
    const registroData = document.createElement('p');
    registroData.textContent = `Data: ${dataPonto}`;
    registroData.classList.add('registro');

    const registroHora = document.createElement('p');
    registroHora.textContent = `Hora: ${horaPonto}`;
    registroHora.classList.add('registro');

    // Adiciona os elementos ao contêiner
    registroContainer.appendChild(registroData);
    registroContainer.appendChild(registroHora);

    // Adiciona o contêiner ao log
    log.appendChild(registroContainer);
}

// Função para bater o ponto
function batendoPonto() {
    registrarHora(); // Chama a função para registrar a hora e exibir o modal
}

// Quando o usuário clicar em cancelar
cancelarBtn.onclick = function() {
    modalConfirmacao.style.display = "none"; // Fecha o modal
};

// Quando o usuário clicar no "x" para fechar o modal
closeModal.onclick = function() {
    modalConfirmacao.style.display = "none"; // Fecha o modal
};

// Fecha o modal se o usuário clicar fora do conteúdo
window.onclick = function(event) {
    if (event.target == modalConfirmacao) {
        modalConfirmacao.style.display = "none"; // Fecha o modal
    }
}

// Chama a função de bater o ponto ao clicar no botão




// API DE CLIMA
function apiClima(){
        
        const apiKey = '49da1130055f366bb350cf083fff2949'; 
        const cidade = 'Campo Grande,BR'; 

        const url = `http://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&units=metric&lang=pt_br`;

       
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Não foi possível obter os dados');
                }
                return response.json();
            })
            .then(data => {
                const temperatura = data.main.temp;
                const descricao = data.weather[0].description;
                const nomeCidade = data.name;

                
                document.getElementById('cidade').textContent = `${nomeCidade}`;
                document.getElementById('temp').textContent = `${temperatura}°C`;
                document.getElementById('descricao').textContent = `${descricao.charAt(0).toUpperCase() + descricao.slice(1)}`;
            })
            .catch(error => {
                document.getElementById('cidade').textContent = 'Erro ao obter dados da cidade';
                document.getElementById('temp').textContent = '';
                document.getElementById('descricao').textContent = '';
                console.error(error);
            });
}
apiClima();       
getTime();
window.setInterval(getTime ,1000);
document.getElementById('registrar').addEventListener('click', registrarHora);




   

