document.addEventListener("DOMContentLoaded", function() {
    document.querySelector("#botao").addEventListener("click", function() {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        
        //*if (email === "" || password === "") {
        //    alert("Por favor, preencha todos os campos.");
          //  return;
        //}

       
        // Criação do objeto
        var log = {
            email: email,
            senha: password
        };

        // Converte o objeto em JSON
        var jsonData = JSON.stringify(log);

        // URL da rota de login no servidor
        var url = 'http://localhost:4000/login';

        // Envia a requisição para o servidor
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData // Aqui usamos a variável jsonData
        })
        .then(response => {
            if (response.ok) {
                // Se a resposta for bem-sucedida, tratamos os dados retornados
                return response.json().then(data => {
                    console.log('Resposta da API:', data);
                    alert(data.msg); // Exibindo mensagem recebida do servidor
                    window.location.href = "./home.html"
                });
            } else if (response.status === 422) {
                // Se houver erro de validação, tratamos a resposta como JSON para obter a mensagem de erro
                return response.json().then(data => {
                    console.log('Erro da API:', data);
                    alert(data.msg); // Exibindo mensagem de erro
                    throw new Error(data.msg || 'Erro ao enviar requisição');
                });
            }else if (response.status === 404) {
                // Se houver erro de validação, tratamos a resposta como JSON para obter a mensagem de erro
                return response.json().then(data => {
                    console.log('Erro da API:', data);
                    alert(data.msg); // Exibindo mensagem de erro
                    throw new Error(data.msg || 'Erro ao enviar requisição');
                });

            } else {
                // Se ocorrer um erro diferente de validação, lançamos um erro genérico
                throw new Error('Erro ao enviar requisição: ' + response.status);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            
        });
    });
});

function criaP(){
    const p = document.createElement('p')
    return p;
}
function setRes(msg,isValid){
    const resultado = document.querySelector("#respostaLogin");
    resultado.innerHTML= '';
    const p = criaP();

    if(isValid){
        p.classList.add('res_bom');
    } else{
        p.classList.add('res_ruim');
    }
    p.innerHTML = msg;
    resultado.appendChild(p);
}