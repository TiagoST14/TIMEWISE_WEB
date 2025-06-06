
   cpf.addEventListener('keypress', () => {
        let cpfLength = cpf.value.length;
        if (cpfLength === 3 || cpfLength === 7) {
            cpf.value += '.';
        }
        if (cpfLength === 11) {
            cpf.value += '-';
        }
    });
document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("#botaoFunc2").addEventListener("click", function (event) {
      event.preventDefault(); // Impede o envio padrão do formulário

      // Obtém os valores dos campos de entrada
      const cpf = document.getElementById("cpf").value; // Campo de CPF
      const password = document.getElementById("passwordFunc").value; // Campo de senha
      const recaptchaToken2 = grecaptcha.getResponse(); // Obtém o token do reCAPTCHA

   

      // Validação dos campos obrigatórios
      if (cpf === "" || password === "") {
          alert("Por favor, preencha todos os campos.");
          return;
      }

       if (recaptchaToken2 === "") {
          alert("Por favor, complete o reCAPTCHA.");
          return;
       }

      // Criação do objeto com os dados do login
      var log = {
          cpf: cpf,
          senha: password,
          recaptchaToken2: recaptchaToken2
      };

      // Converte o objeto em JSON
      var jsonData = JSON.stringify(log);

      // URL da rota de login por CPF no servidor
      var url = 'http://localhost:3000/login-cpf';

      console.log("Enviando dados: ", jsonData); // Log para verificar o que está sendo enviado

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
          localStorage.setItem('token',res.body.token);
          if (res.status === 200) {
              // Se a resposta for bem-sucedida, exibe a mensagem de sucesso
              loginMsg.textContent = res.body.msg;
              loginMsg.classList.add('visible', 'success');

              // Armazena o nome do funcionário no localStorage
              localStorage.setItem('usuarioNome', res.body.nome);

              // Adiciona um delay antes de redirecionar
              setTimeout(() => {
                  window.location.href = "./menuFuncionario.html";
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
