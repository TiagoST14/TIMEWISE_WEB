
document.addEventListener('DOMContentLoaded', function() {
  const acessibilidadeBtn = document.querySelector('.acessibilidade');
  const modalAcessibilidade = document.createElement('div');
  modalAcessibilidade.id = 'modalAcessibilidade';
  modalAcessibilidade.style.display = 'none';
  modalAcessibilidade.innerHTML = `
    <div class="modal-content">
      <h2>Opções de Acessibilidade</h2>
      <button class="close-modal">×</button>
      <div class="options">
        <button class="option-btn" id="increaseFont">A+ Aumentar fonte</button>
        <button class="option-btn" id="decreaseFont">A- Diminuir fonte</button>
        <button class="option-btn" id="highContrast">Alto Contraste</button>
        <button class="option-btn" id="resetAcessibility">Resetar</button>
      </div>
      <div class="vlibras-btn">
        <p>Tradução para Libras: <span id="vlibras-icon">👐</span></p>
      </div>
    </div>
  `;
  document.body.appendChild(modalAcessibilidade);

  // Estilos para o modal
  const style = document.createElement('style');
  style.textContent = `
    #modalAcessibilidade {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 0 20px rgba(0,0,0,0.3);
      z-index: 1000;
      width: 90%;
      max-width: 500px;
    }
    .modal-content {
      position: relative;
    }
    .close-modal {
      position: absolute;
      top: -15px;
      right: -15px;
      background: #034F84;
      color: white;
      border: none;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      font-size: 18px;
      cursor: pointer;
    }
    .options {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 20px;
    }
    .option-btn {
      padding: 10px;
      background: #034F84;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    .vlibras-btn {
      margin-top: 20px;
      text-align: center;
    }
    #vlibras-icon {
      font-size: 24px;
      cursor: pointer;
    }
    .high-contrast {
      background: black !important;
      color: white !important;
    }
    .high-contrast input,
    .high-contrast button,
    .high-contrast div {
      background: black !important;
      color: yellow !important;
      border-color: yellow !important;
    }
  `;
  document.head.appendChild(style);

  // Event Listeners
  acessibilidadeBtn.addEventListener('click', function() {
    modalAcessibilidade.style.display = 'block';
  });

  modalAcessibilidade.querySelector('.close-modal').addEventListener('click', function() {
    modalAcessibilidade.style.display = 'none';
  });

  // Funcionalidades
  document.getElementById('increaseFont').addEventListener('click', function() {
    changeFontSize(1);
  });

  document.getElementById('decreaseFont').addEventListener('click', function() {
    changeFontSize(-1);
  });

  document.getElementById('highContrast').addEventListener('click', function() {
    document.body.classList.toggle('high-contrast');
  });

  document.getElementById('resetAcessibility').addEventListener('click', function() {
    document.body.classList.remove('high-contrast');
    document.body.style.fontSize = '';
  });

  document.getElementById('vlibras-icon').addEventListener('click', function() {
    document.querySelector('.vlibras-widget-button').click();
  });

  function changeFontSize(direction) {
    const currentSize = parseFloat(getComputedStyle(document.body).fontSize);
    document.body.style.fontSize = (currentSize + direction * 2) + 'px';
  }
});


function setupAriaLabels() {
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    const label = input.previousElementSibling;
    if (label && label.tagName === 'P') {
      input.setAttribute('aria-label', label.textContent);
    }
  });

  // Botões importantes
  document.getElementById('botaoFunc')?.setAttribute('aria-label', 'Entrar como funcionário');
  document.getElementById('botaoAdm')?.setAttribute('aria-label', 'Entrar como administrador');
  document.getElementById('botao')?.setAttribute('aria-label', 'Entrar no sistema');
  document.getElementById('botaoFunc2')?.setAttribute('aria-label', 'Entrar como funcionário');
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  setupAriaLabels();
  
  // Foco acessível para modais
  const loginModals = document.querySelectorAll('.divLogin, .divLoginFunc,.tipoUser');
  loginModals.forEach(modal => {
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'modalTitle');
  });
});