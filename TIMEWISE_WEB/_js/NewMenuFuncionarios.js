// Função para atualizar o relógio e a data
function updateClock() {
    const now = new Date();
    
    // Atualiza o relógio
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
    
    // Atualiza a data
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    document.getElementById('date').textContent = `${day}/${month}/${year}`;
}

// Atualiza o relógio a cada segundo
setInterval(updateClock, 1000);
updateClock(); // Inicializa o relógio imediatamente

document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("sair").addEventListener("click", function() {
        localStorage.removeItem('token');
        localStorage.removeItem('usuarioNome');
        localStorage.removeItem('func_cpf'); // Remove o CPF também
        localStorage.removeItem('_grecaptcha');
        
        window.location.href = "telaLogin.html";
    });
    
    function atualizarNomeUsuario(){
        const usuarioLogElement = document.getElementById('usuario_log');
        const usuarioNome = localStorage.getItem('usuarioNome')|| 'Usuário';
        usuarioLogElement.textContent = usuarioNome
    }
    atualizarNomeUsuario();

    // Função para obter o endereço usando a API do LocationIQ
    const chaveApi = 'pk.09c321c4408ab27407892c09dcc2abff';
    
    function obterEndereco(latitude, longitude, callback) {
        const url = `https://us1.locationiq.com/v1/reverse?key=${chaveApi}&lat=${latitude}&lon=${longitude}&format=json&`;
        fetch(url)
        .then((response) => response.json())
        .then((data) => {
            console.log("Resposta da API LocationIQ:", data); // Log para depuração

            if (data && data.address) {
                const road = data.address.road || "N/A";
                const suburb = data.address.suburb || data.address.neighbourhood || "N/A";
                const city = data.address.city || "N/A";
                const country = data.address.country || "N/A";

                // Retorna objeto com dados de localização
                const localizacao = {
                    road: road,
                    neighbourhood: suburb,
                    city: city,
                    country: country,
                    lat: latitude,
                    lon: longitude
                };
                
                callback(null, localizacao);
            } else {
                callback('Endereço não encontrado.', null);
            }
        })
        .catch((error) => {
            console.error('Erro ao converter coordenadas em endereço:', error);
            callback('Erro ao obter o endereço.', null);
        });
    }

    // Função para obter localização do usuário
    function obterLocalizacaoUsuario(callback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    
                    // Obter endereço a partir das coordenadas
                    obterEndereco(latitude, longitude, callback);
                },
                function(error) {
                    console.error('Erro ao obter localização:', error);
                    let mensagem = 'Erro ao obter localização: ';
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            mensagem += 'Permissão negada pelo usuário.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            mensagem += 'Localização indisponível.';
                            break;
                        case error.TIMEOUT:
                            mensagem += 'Tempo limite excedido.';
                            break;
                        default:
                            mensagem += 'Erro desconhecido.';
                            break;
                    }
                    callback(mensagem, null);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                }
            );
        } else {
            callback('Geolocalização não é suportada por este navegador.', null);
        }
    }

    // Função para registrar ponto no servidor
    function registrarPontoServidor(tipo, localizacao) {
        const cpf = localStorage.getItem('func_cpf').replace(/[.-]/g, '');
        
        if (!cpf) {
            alert('CPF do funcionário não encontrado. Faça login novamente.');
            return;
        }

        const dadosPonto = {
            cpf: cpf,
            tipo: tipo,
            localizacao: localizacao
        };

        console.log('Enviando dados do ponto:', dadosPonto); // Log para depuração

        fetch('http://localhost:3000/registrarPonto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosPonto)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message && data.message.includes('sucesso')) {
                console.log('Ponto registrado com sucesso:', data);
                // alert('Ponto registrado com sucesso!');
                
                // Atualizar a interface local
                atualizarInterfaceRegistros();
            } else {
                console.error('Erro ao registrar ponto:', data);
                alert('Erro ao registrar ponto: ' + (data.message || 'Erro desconhecido'));
            }
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
            alert('Erro ao conectar com o servidor. Tente novamente.');
        });
    }

    // Função para registrar ponto (atualizada)
    function registerPunch(type) {
        // Verificar se o CPF está disponível
        const cpf = localStorage.getItem('func_cpf').replace(/[.-]/g, '');
        if (!cpf) {
            alert('CPF do funcionário não encontrado. Faça login novamente.');
            return;
        }

        console.log('CPF encontrado no localStorage:', cpf); // Log para depuração

        // Primeiro, obter a localização
        obterLocalizacaoUsuario(function(erro, localizacao) {
            if (erro) {
                alert('Não foi possível obter sua localização: ' + erro);
                return;
            }
            
            console.log('Localização obtida:', localizacao); // Log para depuração
            
            // Se a localização foi obtida com sucesso, registrar no servidor
            registrarPontoServidor(type, localizacao);
        });
    }

    // Função para salvar registros no localStorage (agora por CPF e data)
    function salvarRegistrosLocal(registros) {
        const hoje = new Date().toLocaleDateString();
        const cpf = localStorage.getItem('func_cpf').replace(/[.-]/g, '');
        if (!cpf) return;
        localStorage.setItem(`registros_${cpf}_${hoje}`, JSON.stringify(registros));
    }

    // Função para carregar registros do localStorage (por CPF e data)
    function carregarRegistrosLocal() {
        const hoje = new Date().toLocaleDateString();
        const cpf = localStorage.getItem('func_cpf').replace(/[.-]/g, '');
        if (!cpf) return [];
        const registros = localStorage.getItem(`registros_${cpf}_${hoje}`);
        return registros ? JSON.parse(registros) : [];
    }

    // Função para limpar registros antigos (apenas do CPF atual)
    function limparRegistrosAntigos() {
        const hoje = new Date().toLocaleDateString();
        const cpf = localStorage.getItem('func_cpf').replace(/[.-]/g, '');
        if (!cpf) return;
        const prefix = `registros_${cpf}_`;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(prefix) && key !== `${prefix}${hoje}`) {
                localStorage.removeItem(key);
            }
        }
    }

    // Função para buscar registros do dia no banco de dados pelo CPF
    async function buscarRegistrosDoDiaBanco() {
        const cpf = localStorage.getItem('func_cpf').replace(/[.-]/g, '');
        if (!cpf) return [];
        const hoje = new Date();
        const dia = String(hoje.getDate()).padStart(2, '0');
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const ano = hoje.getFullYear();
        const dataHoje = `${dia}/${mes}/${ano}`;
        try {
            const response = await fetch(`http://localhost:3000/registros?cpf=${cpf}&data=${dataHoje}`);
            if (!response.ok) return [];
            const registros = await response.json();
            return registros;
        } catch (e) {
            return [];
        }
    }

    // Função para atualizar a interface com os registros do banco
    async function atualizarInterfaceRegistros() {
        const recordsContainer = document.getElementById('today-records');
        recordsContainer.innerHTML = '';
        const registros = await buscarRegistrosDoDiaBanco();
        if (!registros || registros.length === 0) {
            recordsContainer.innerHTML = '<p>Nenhum registro encontrado para hoje.</p>';
            return;
        }
        // Mapeamento dos tipos para nomes amigáveis
        const mapTipo = {
            'entrada1': 'Entrada',
            'saida1': 'Saída para Almoço',
            'entrada2': 'Retorno do Almoço',
            'saida2': 'Saída'
        };
        // Exibir cada registro do banco
        registros.forEach(registro => {
            const tipoAmigavel = mapTipo[registro.tipo] || registro.tipo;
            const recordElement = document.createElement('div');
            recordElement.classList.add('record-item');
            recordElement.innerHTML = `
                <p><strong>${tipoAmigavel}:</strong> ${registro.hora}</p>
            `;
            recordElement.style.padding = '10px';
            recordElement.style.marginBottom = '8px';
            recordElement.style.borderLeft = '4px solid var(--primary-color)';
            recordElement.style.backgroundColor = '#f0f8ff';
            recordElement.style.borderRadius = '4px';
            recordsContainer.appendChild(recordElement);
        });
    }

    // Função para criar o popup de confirmação (caso não exista)
    function criarPopupConfirmacao() {
        if (document.getElementById('popup-confirmacao-ponto')) return;
        const popup = document.createElement('div');
        popup.id = 'popup-confirmacao-ponto';
        popup.style.display = 'none';
        popup.innerHTML = `
            <div class="popup-overlay"></div>
            <div class="popup-content">
                <h3>Confirmar registro de ponto</h3>
                <p id="popup-mensagem-ponto">Deseja realmente registrar este ponto?</p>
                <div class="popup-botoes">
                    <button id="btn-confirmar-ponto">Confirmar</button>
                    <button id="btn-cancelar-ponto">Cancelar</button>
                </div>
            </div>
        `;
        document.body.appendChild(popup);
    }

    // Função para mostrar o popup e aguardar confirmação
    function mostrarPopupConfirmacao(tipo, callback) {
        criarPopupConfirmacao();
        const popup = document.getElementById('popup-confirmacao-ponto');
        const mensagem = document.getElementById('popup-mensagem-ponto');
        let tipoTexto = '';
        switch(tipo) {
            case 'entrada1': tipoTexto = 'Entrada'; break;
            case 'saida1': tipoTexto = 'Saída para Almoço'; break;
            case 'entrada2': tipoTexto = 'Retorno do Almoço'; break;
            case 'saida2': tipoTexto = 'Saída'; break;
            default: tipoTexto = 'Ponto'; break;
        }
        mensagem.textContent = `Deseja realmente registrar o ponto de "${tipoTexto}"?`;
        popup.style.display = 'flex';
        
        // Funções de clique
        const btnConfirmar = document.getElementById('btn-confirmar-ponto');
        const btnCancelar = document.getElementById('btn-cancelar-ponto');
        
        // Remover event listeners antigos
        btnConfirmar.onclick = null;
        btnCancelar.onclick = null;
        
        btnConfirmar.onclick = function() {
            popup.style.display = 'none';
            callback(true);
        };
        btnCancelar.onclick = function() {
            popup.style.display = 'none';
            callback(false);
        };
    }

    // Função para mostrar popup de erro customizado
    function mostrarPopupErro(mensagem) {
        criarPopupConfirmacao();
        const popup = document.getElementById('popup-confirmacao-ponto');
        const mensagemElem = document.getElementById('popup-mensagem-ponto');
        mensagemElem.textContent = mensagem;
        popup.style.display = 'flex';
        // Esconde os botões de confirmação/cancelamento
        document.getElementById('btn-confirmar-ponto').style.display = 'none';
        document.getElementById('btn-cancelar-ponto').textContent = 'OK';
        document.getElementById('btn-cancelar-ponto').onclick = function() {
            popup.style.display = 'none';
            // Restaura os botões para o próximo uso
            document.getElementById('btn-confirmar-ponto').style.display = '';
            document.getElementById('btn-cancelar-ponto').textContent = 'Cancelar';
        };
    }

    // Função para verificar se já existe ponto do mesmo tipo no dia (consultando o banco)
    async function jaRegistrouPontoHojeBanco(tipo) {
        const cpf = localStorage.getItem('func_cpf').replace(/[.-]/g, '');
        if (!cpf) return false;
        const hoje = new Date();
        const dia = String(hoje.getDate()).padStart(2, '0');
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const ano = hoje.getFullYear();
        const dataHoje = `${dia}/${mes}/${ano}`;
        try {
            const response = await fetch(`http://localhost:3000/registros?cpf=${cpf}&data=${dataHoje}`);
            if (!response.ok) return false;
            const registros = await response.json();
            // Verifica se já existe registro do mesmo tipo
            return registros.some(reg => reg.tipo === tipo);
        } catch (e) {
            return false;
        }
    }

    // Substituir chamada direta do registerPunch por popup de confirmação e verificação de duplicidade no banco
    async function acionarRegistroPontoComConfirmacao(tipo) {
        if (await jaRegistrouPontoHojeBanco(tipo)) {
            mostrarPopupErro('Você já registrou esse tipo de ponto hoje!');
            return;
        }
        mostrarPopupConfirmacao(tipo, function(confirmado) {
            if (confirmado) {
                registerPunch(tipo);
            }
        });
    }

    // Adiciona eventos aos botões
    document.getElementById('punch-in').addEventListener('click', function() {
        acionarRegistroPontoComConfirmacao('entrada1');
    });
    
    document.getElementById('lunch-out').addEventListener('click', function() {
        acionarRegistroPontoComConfirmacao('saida1');
    });
    
    document.getElementById('lunch-in').addEventListener('click', function() {
        acionarRegistroPontoComConfirmacao('entrada2');
    });
    
    document.getElementById('punch-out').addEventListener('click', function() {
        acionarRegistroPontoComConfirmacao('saida2');
    });

    // Função global para compatibilidade (caso seja chamada de outro lugar)
    window.obterEndereco = function() {
        registerPunch('entrada1');
    };

    // Carregar registros ao iniciar a página
    limparRegistrosAntigos();
    atualizarInterfaceRegistros();
});

// API DE CLIMA
function apiClima() {
    const apiKey = '49da1130055f366bb350cf083fff2949';
    const cidade = 'Campo Grande,BR';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&units=metric&lang=pt_br`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Não foi possível obter os dados');
            return response.json();
        })
        .then(data => {
            const temperatura = Math.round(data.main.temp);
            const descricao = data.weather[0].description;
            const nomeCidade = data.name;
            const condicao = data.weather[0].main.toLowerCase();
            const agora = Math.floor(Date.now() / 1000);
            const isNoite = agora < data.sys.sunrise || agora > data.sys.sunset;
            
            // Atualiza os elementos básicos
            document.getElementById('cidade').textContent = nomeCidade;
            document.getElementById('temp').textContent = `${temperatura}°C`;
            document.getElementById('descricao').textContent = 
                descricao.charAt(0).toUpperCase() + descricao.slice(1);
            
            // Atualiza o ícone conforme a condição e período do dia
            atualizarIconeClima(condicao, isNoite);
        })
        .catch(error => {
            console.error('Erro ao buscar dados do clima:', error);
            document.getElementById('cidade').textContent = 'Dados indisponíveis';
            document.getElementById('temp').textContent = '';
            document.getElementById('descricao').textContent = '';
            atualizarIconeClima('error', false);
        });
}

function atualizarIconeClima(condicao, isNoite) {
    const widget = document.getElementById('weatherWidget');
    const icon = widget.querySelector('.clima-icon i');
    
    // Remove todas as classes de condição
    widget.className = widget.className.replace(/\bclima-\S+/g, '');
    widget.classList.add('containerClima');
    
    // Mapeamento com versões diurnas e noturnas
    const condicoes = {
        'clear': { 
            icon: isNoite ? 'fa-moon' : 'fa-sun', 
            class: isNoite ? 'clima-noite' : 'clima-sol' 
        },
        'clouds': { 
            icon: isNoite ? 'fa-cloud-moon' : 'fa-cloud-sun', 
            class: 'clima-nublado' 
        },
        'rain': { 
            icon: isNoite ? 'fa-cloud-moon-rain' : 'fa-cloud-sun-rain', 
            class: 'clima-chuva' 
        },
        'drizzle': { 
            icon: isNoite ? 'fa-cloud-moon-rain' : 'fa-cloud-sun-rain', 
            class: 'clima-chuva' 
        },
        'thunderstorm': { 
            icon: 'fa-bolt', 
            class: 'clima-tempestade' 
        },
        'snow': { 
            icon: 'fa-snowflake', 
            class: 'clima-neve' 
        },
        // ... (outras condições permanecem iguais)
    };
    
    const config = condicoes[condicao] || condicoes['clear'];
    widget.classList.add(config.class);
    icon.className = 'fas ' + config.icon;
}
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btnGerarPDF").addEventListener("click", gerarPDF);
  });

document.addEventListener('DOMContentLoaded', apiClima);

// Atualiza a cada 15 minutos (900000 ms)
setInterval(apiClima, 900000);

document.getElementById('mes')
document.getElementById('ano')

function obterPeriodoSelecionado() {
    const dataInicio = document.getElementById('dataInicio').value;
    const dataFim = document.getElementById('dataFim').value;
    return { dataInicio, dataFim };
}

const periodo = obterPeriodoSelecionado();

