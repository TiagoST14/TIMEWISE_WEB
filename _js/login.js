document.addEventListener("DOMContentLoaded", function() {
  document.querySelector("#botao").addEventListener("click", function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const recaptchaToken = grecaptcha.getResponse(); // Obtém o token do reCAPTCHA

    if (email === "" || password === "") {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (recaptchaToken === "") {
      alert("Por favor, complete o reCAPTCHA.");
      return;
    }

    // Criação do objeto com o token do reCAPTCHA
    var log = {
      email: email,
      senha: password,
      recaptchaToken: recaptchaToken
    };

    // Converte o objeto em JSON
    var jsonData = JSON.stringify(log);

    // URL da rota de login no servidor
    var url = 'http://localhost:3000/login';

    // Envia a requisição para o servidor
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonData
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(res => {
      const loginMsg = document.getElementById('loginMsg');
      loginMsg.classList.remove('hidden', 'visible', 'success', 'error'); // Remove todas as classes
      localStorage.setItem('usuarioNome', res.body.nome);
      localStorage.setItem('token',res.body.token);
      if (res.status === 200) {
        // Se a resposta for bem-sucedida, exibe a mensagem de sucesso
        loginMsg.textContent = res.body.msg ;
        loginMsg.classList.add('visible', 'success');

        // Adiciona um delay antes de redirecionar
        setTimeout(() => {
          window.location.href = "./home.html";
        }, 1000);

      } else if (res.status === 422 || res.status === 404) {
        // Se houver erro de validação, exibe a mensagem de erro
        loginMsg.textContent = res.body.msg;
        loginMsg.classList.add('visible', 'error');
      } else {
        // Se ocorrer um erro diferente, exibe um erro genérico
        throw new Error('Erro ao enviar requisição: ' + res.status);
      }
    })
    .catch(error => {
      const loginMsg = document.getElementById('loginMsg');
      loginMsg.textContent = "Erro ao enviar requisição. Por favor, tente novamente mais tarde.";
      loginMsg.classList.remove('hidden');
      loginMsg.classList.add('visible', 'error');
      console.error('Erro:', error);
    });
  });
});


// Função para mover o reCAPTCHA
function moverRecaptcha(destinoId) {
  const recaptcha = document.getElementById("recaptchaContainer");
  const destino = document.getElementById(destinoId);

  // Insere o reCAPTCHA antes do botão no formulário selecionado
  destino.insertBefore(recaptcha, destino.querySelector("button"));
}
//DEFINIÇÃO DA ENTRADA | ENTRADA COMO ADM E SOME COM A DIV DE "MODO DE ENTRADA" E APARECENDO APENAS DE LOGIN COMO ADM
function entrarComoAdm(){
  const adm = document.getElementById("divLogin"); 
  const funcDiv = document.getElementById("divLoginFunc");
  const escolhaModo = document.getElementById("tipoUser");
  const reCAPTCHA = document.getElementById("recaptchaContainer");
  
  reCAPTCHA.style.display="block"
  escolhaModo.style.display = "none";
  funcDiv.style.display ="none"
  adm.style.display = "none";
  moverRecaptcha("divLogin")
}
function entrarComoFunc(){
  const funcionario = document.getElementById("tipoUser");
  const loginDiv = document.getElementById("divLogin");
  const loginFuncDiv = document.getElementById("divLoginFunc");
  const reCAPTCHA = document.getElementById("recaptchaContainer");
  
  reCAPTCHA.style.display="block";
  funcionario.style.display = "none";
  loginDiv.style.display ="none";
  loginFuncDiv.style.display = "block";

  moverRecaptcha("divLoginFunc");
}
function exibirLoginFunc(){
  const loginFuncDiv = document.getElementById("divLoginFunc");
  const msgStatus = document.getElementById('loginMsg');

  msgStatus.style.display="block";
  loginFuncDiv.style.display = "block";
  
}
function exibirLoginAdm(){
  const loginAdmDiv = document.getElementById("divLogin");
  loginAdmDiv.style.display ="block";
  
}





