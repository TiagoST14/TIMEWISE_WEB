// Função para atualizar o relógio
function atualizaRelogio() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
}

// Função para obter a localização do navegador
function obterLocalizacao(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude.toFixed(20);
                const longitude = position.coords.longitude.toFixed(20);

                // Após obter latitude e longitude, chamar obterEndereco para buscar o endereço
                obterEndereco(latitude, longitude, (endereco) => {
                    callback(`Endereço: ${endereco}`);
                    console.log(longitude, latitude)
                });
            },
            (error) => {
                console.error('Erro ao obter a localização:', error.message);
                callback('Localização não disponível.');
            }
        );
    } else {
        callback('Geolocalização não suportada pelo navegador.');
    }
}

// Função para obter o endereço usando a API do Nominatim
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
function registrarHora() {
    const now = new Date();
    const data = now.toLocaleDateString();
    const hora = now.toLocaleTimeString();

    // Obter a localização e adicionar ao log
    obterLocalizacao((localizacao) => {
        const log = document.getElementById('log');
        const registro = document.createElement('p');
        registro.textContent = `Data: ${data}, Hora: ${hora}, ${localizacao}`;
        log.appendChild(registro);
    });
}

// Adiciona um evento de clique ao botão
document.getElementById('registerButton').addEventListener('click', registrarHora);

// Atualiza o relógio a cada segundo
setInterval(atualizaRelogio, 1000);

// Chama a função para definir o relógio na carga inicial
atualizaRelogio();
