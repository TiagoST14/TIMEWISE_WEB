// Variáveis globais para paginação
let currentPage = 1;
let itemsPerPage = 10; // Valor padrão
let allEmployees = []; // Armazenará todos os funcionários
let filteredEmployees = []; // Armazenará os funcionários filtrados

// Event Listeners
document.getElementById("addEmployeeBtn").addEventListener("click", function() {
    window.location.href = "novoFuncionario.html";
});

document.getElementById("sair").addEventListener("click", function() {
    window.location.href = "home.html";
});

document.getElementById("itensPorPagina").addEventListener("change", function() {
    itemsPerPage = parseInt(this.value);
    currentPage = 1;
    renderTable();
});

// Função principal para carregar a tabela
async function loadEmployeeTable() {
    try {
        const response = await fetch('http://localhost:3000/funcionarios');
        allEmployees = await response.json();
        filteredEmployees = [...allEmployees];
        
        renderTable();
        setupPagination();
    } catch (error) {
        console.error('Erro ao carregar funcionários:', error);
    }
}

// Função para renderizar a tabela com paginação
function renderTable() {
    const tableBody = document.querySelector('#employeeTable tbody');
    tableBody.innerHTML = '';

    // Calcula os itens a serem exibidos
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const employeesToShow = filteredEmployees.slice(startIndex, endIndex);

    // Preenche a tabela
    employeesToShow.forEach((employee) => {
        const row = document.createElement('tr');
        
        // Coluna Nome (clicável)
        const nameCell = document.createElement('td');
        const nameLink = document.createElement('a');
        nameLink.textContent = employee.func_nome;
        nameLink.href = `editarFuncionario.html?cpf=${employee.func_cpf}`;
        nameCell.appendChild(nameLink);
        row.appendChild(nameCell);

        // Coluna CPF
        const cpfCell = document.createElement('td');
        cpfCell.textContent = employee.func_cpf;
        row.appendChild(cpfCell);
        
        // Coluna Ações
        const actionCell = document.createElement('td');

        // Botão Editar
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.className = 'edit-btn';
        editButton.onclick = () => {
            window.location.href = `editarFuncionario.html?cpf=${employee.func_cpf}`;
        };
        actionCell.appendChild(editButton);

        // Botão Excluir
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Demitir';
        deleteButton.className = 'delete-btn';
        deleteButton.onclick = async () => {
            const confirmed = confirm(`Deseja demitir ${employee.func_nome}?`);
            if (confirmed) {
                await deleteEmployee(employee._id);
            }
        };
        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);
        tableBody.appendChild(row);
    });

    updatePaginationControls();
}

// Função para configurar a paginação
function setupPagination() {
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination-container';
    document.querySelector('.container').appendChild(paginationContainer);
    updatePaginationControls();
}

// Função para atualizar os controles de paginação
function updatePaginationControls() {
    const paginationContainer = document.querySelector('.pagination-container');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    
    paginationContainer.innerHTML = `
        <button id="prevPage" ${currentPage === 1 ? 'disabled' : ''}>Anterior</button>
        <span>Página ${currentPage} de ${totalPages}</span>
        <button id="nextPage" ${currentPage >= totalPages ? 'disabled' : ''}>Próximo</button>
    `;

    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    });
}

// Função para filtrar a tabela
function filterTable() {
    const searchName = document.getElementById('searchName').value.toLowerCase();
    const searchCpf = document.getElementById('searchCpf').value.toLowerCase();

    filteredEmployees = allEmployees.filter(employee => {
        const nameMatch = employee.func_nome.toLowerCase().includes(searchName);
        const cpfMatch = employee.func_cpf.toLowerCase().includes(searchCpf);
        return nameMatch && cpfMatch;
    });

    currentPage = 1;
    renderTable();
}

// Função para excluir funcionário
async function deleteEmployee(employeeId) {
    try {
        const response = await fetch(`http://localhost:3000/funcionarios/${employeeId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Funcionário demitido com sucesso!');
            await loadEmployeeTable(); // Recarrega os dados
        } else {
            const errorData = await response.json();
            alert(`Erro: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Erro ao demitir:', error);
        alert('Erro ao demitir funcionário.');
    }
}

// Inicialização
window.onload = loadEmployeeTable;