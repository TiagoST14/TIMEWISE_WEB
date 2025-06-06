

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
        localStorage.removeItem('_grecaptcha');
        
        window.location.href = "telaLogin.html";
    });
    function atualizarNomeUsuario(){
        const usuarioLogElement = document.getElementById('usuario_log');
        const usuarioNome = localStorage.getItem('usuarioNome')|| 'Usuário';
        usuarioLogElement.textContent = usuarioNome
    }
    atualizarNomeUsuario();
});
// Função para registrar ponto
function registerPunch(type) {


    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const time = `${hours}:${minutes}:${seconds}`;
    
    
    // const usuarioLogElement = document.getElementById('usuario_log').value;
    // if (!usuarioLogElement) {
    //     alert('Por favor, insira seu ID de funcionário');
    //     return;
    // }
    
    let typeText = '';
    switch(type) {
        case 'in':
            typeText = 'Entrada';
            break;
        case 'lunch-out':
            typeText = 'Saída para Almoço';
            break;
        case 'lunch-in':
            typeText = 'Retorno do Almoço';
            break;
        case 'out':
            typeText = 'Saída';
            break;
    }
    
    // Cria o elemento de registro
    const recordsContainer = document.getElementById('today-records');
    const recordElement = document.createElement('div');
    recordElement.classList.add('record-item');
    recordElement.innerHTML = `
        <p><strong>${typeText}:</strong> ${time} </p>
    `;
    
    // Adiciona o registro ao container
    recordsContainer.appendChild(recordElement);
    
    // Estiliza o elemento de registro
    recordElement.style.padding = '10px';
    recordElement.style.marginBottom = '8px';
    recordElement.style.borderLeft = '4px solid var(--primary-color)';
    recordElement.style.backgroundColor = '#f0f8ff';
    recordElement.style.borderRadius = '4px';
    
    // Efeito de destaque temporário
    recordElement.style.animation = 'fadeIn 0.5s';
    
    // Adiciona a animação ao CSS
    if (!document.querySelector('style#record-animations')) {
        const style = document.createElement('style');
        style.id = 'record-animations';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Feedback visual no botão
    const button = document.getElementById(`punch-${type}`);
    const originalBackground = button.style.backgroundColor;
    button.style.backgroundColor = '#27ae60';
    
    setTimeout(() => {
        button.style.backgroundColor = originalBackground;
    }, 500);
}

// Adiciona eventos aos botões
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('punch-in').addEventListener('click', function() {
        registerPunch('in');
    });
    
    document.getElementById('lunch-out').addEventListener('click', function() {
        registerPunch('lunch-out');
    });
    
    document.getElementById('lunch-in').addEventListener('click', function() {
        registerPunch('lunch-in');
    });
    
    document.getElementById('punch-out').addEventListener('click', function() {
        registerPunch('out');
    });
});


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