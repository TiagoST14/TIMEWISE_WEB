document.getElementById("addEmployeeBtn").addEventListener("click", function () {
  window.location.href = "novoFuncionario.html";
});

document.getElementById("sair").addEventListener("click", function () {
  window.location.href = "home.html";
});


// Função para carregar a tabela com os funcionários
async function loadEmployeeTable() {
  const tableBody = document.querySelector('#employeeTable tbody');

  try {
      const response = await fetch('http://localhost:3000/funcionarios');
      const employees = await response.json();

      tableBody.innerHTML = ''; // Limpar a tabela antes de preencher

      employees.forEach((employee) => {
          const row = document.createElement('tr');
          
          // Coluna Nome (clicável para abrir a página de edição)
          const nameCell = document.createElement('td');
          const nameLink = document.createElement('a');
          nameLink.textContent = employee.func_nome;
          nameLink.href = `editarFuncionario.html?cpf=${employee.func_cpf}`; // Redireciona para edição com o CPF
          nameCell.appendChild(nameLink);
          row.appendChild(nameCell);

          // Coluna CPF
          const cpfCell = document.createElement('td');
          cpfCell.textContent = employee.func_cpf;
          row.appendChild(cpfCell);
          
          // Coluna Ação (Editar e Excluir)
          const actionCell = document.createElement('td');

          // Botão Editar
          const editButton = document.createElement('button');
          editButton.textContent = 'Editar';
          editButton.onclick = () => {
              window.location.href = `editarFuncionario.html?cpf=${employee.func_cpf}`; // Redireciona para edição
          };
          actionCell.appendChild(editButton);

          // Botão Excluir
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Excluir';
          deleteButton.onclick = async () => {
              const confirmed = confirm(`Você realmente deseja excluir o funcionário ${employee.func_nome}?`);
              if (confirmed) {
                  await deleteEmployee(employee._id); // Função para excluir o funcionário
              }
          };
          actionCell.appendChild(deleteButton);

          // Adiciona os botões à célula de ação
          row.appendChild(actionCell);

          tableBody.appendChild(row);
      });
  } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
  }
}

// Função para excluir um funcionário
async function deleteEmployee(employeeId) {
  try {
      const response = await fetch(`http://localhost:3000/funcionarios/${employeeId}`, {
          method: 'DELETE',
      });

      if (response.ok) {
          alert('Funcionário excluído com sucesso!');
          loadEmployeeTable(); // Recarregar a tabela após a exclusão
      } else {
          const errorData = await response.json();
          alert(`Erro ao excluir funcionário: ${errorData.message}`);
      }
  } catch (error) {
      console.error('Erro ao excluir funcionário:', error);
      alert('Erro ao excluir funcionário. Tente novamente mais tarde.');
  }
}

// Carregar a tabela assim que a página for carregada
window.onload = loadEmployeeTable;

document.getElementById("addEmployeeBtn").addEventListener("click", function () {
  window.location.href = "novoFuncionario.html";
});

document.getElementById("sair").addEventListener("click", function () {
  window.location.href = "home.html";
});


// Função para carregar a tabela com os funcionários
async function loadEmployeeTable() {
  const tableBody = document.querySelector('#employeeTable tbody');

  try {
      const response = await fetch('http://localhost:3000/funcionarios');
      const employees = await response.json();

      tableBody.innerHTML = ''; // Limpar a tabela antes de preencher

      employees.forEach((employee) => {
          const row = document.createElement('tr');
          
          // Coluna Nome (clicável para abrir a página de edição)
          const nameCell = document.createElement('td');
          const nameLink = document.createElement('a');
          nameLink.textContent = employee.func_nome;
          nameLink.href = `editarFuncionario.html?cpf=${employee.func_cpf}`; // Redireciona para edição com o CPF
          nameCell.appendChild(nameLink);
          row.appendChild(nameCell);

          // Coluna CPF
          const cpfCell = document.createElement('td');
          cpfCell.textContent = employee.func_cpf;
          row.appendChild(cpfCell);
          
          // Coluna Ação (Editar e Excluir)
          const actionCell = document.createElement('td');

          // Botão Editar
          const editButton = document.createElement('button');
          editButton.textContent = 'Editar';
          editButton.onclick = () => {
              window.location.href = `editarFuncionario.html?cpf=${employee.func_cpf}`; // Redireciona para edição
          };
          actionCell.appendChild(editButton);

          // Botão Excluir
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Demitir';
          deleteButton.onclick = async () => {
              const confirmed = confirm(`Você realmente deseja demitir o funcionário ${employee.func_nome}?`);
              if (confirmed) {
                  await deleteEmployee(employee._id); // Função para excluir o funcionário
              }
          };
          actionCell.appendChild(deleteButton);

          // Adiciona os botões à célula de ação
          row.appendChild(actionCell);

          tableBody.appendChild(row);
      });
  } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
  }
}

// Função para excluir um funcionário
async function deleteEmployee(employeeId) {

 //TODO criar uma nova collection e mover os funcionairos demitidos

 //verificar se o funcionario existe


  try {
      const response = await fetch(`http://localhost:3000/funcionarios/${employeeId}`, {
          method: 'DELETE',
      });

      if (response.ok) {
          alert('Funcionário demitido com sucesso!');
          loadEmployeeTable(); // Recarregar a tabela após a exclusão
      } else {
          const errorData = await response.json();
          alert(`Erro ao demitir funcionário: ${errorData.message}`);
      }
  } catch (error) {
      console.error('Erro ao demitir funcionário:', error);
      alert('Erro ao demitir funcionário. Tente novamente mais tarde.');
  }
}

// Função para filtrar a tabela com base na pesquisa
function filterTable() {
  const searchName = document.getElementById('searchName').value.toLowerCase();
  const searchCpf = document.getElementById('searchCpf').value;
  const tableRows = document.querySelectorAll('#employeeTable tbody tr');

  tableRows.forEach(row => {
      const nameCell = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
      const cpfCell = row.querySelector('td:nth-child(2)').textContent;
      
      const matchesName = nameCell.includes(searchName);
      const matchesCpf = cpfCell.includes(searchCpf);
      
      if (matchesName && matchesCpf) {
          row.style.display = ''; // Mostrar a linha
      } else {
          row.style.display = 'none'; // Esconder a linha
      }
  });
}

// Carregar a tabela assim que a página for carregada
window.onload = loadEmployeeTable;
