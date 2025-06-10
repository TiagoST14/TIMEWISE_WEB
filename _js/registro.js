/**
 * Script para a página de registros de ponto
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const btnFiltrar = document.getElementById('btn-filtrar');
    const btnLimpar = document.getElementById('btn-limpar');
    const btnExportar = document.getElementById('btn-exportar');
    const btnSair = document.getElementById('sair');  // Novo - botão de sair
    const registrosBody = document.getElementById('registros-body');

    if (btnSair) {
        btnSair.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'home.html';  // Redireciona para a home
        });
    }
    
    // Dados de exemplo (substituir por chamada AJAX para o backend)
    const registrosExemplo = [
        {
            id: 1,
            data: '2023-05-15',
            funcionario: 'João Silva',
            entrada: '08:00',
            saidaAlmoco: '12:00',
            retornoAlmoco: '13:00',
            saida: '17:00',
            horasTrabalhadas: '8h'
        },
        {
            id: 2,
            data: '2023-05-15',
            funcionario: 'Maria Souza',
            entrada: '08:05',
            saidaAlmoco: '12:00',
            retornoAlmoco: '13:05',
            saida: '17:00',
            horasTrabalhadas: '7h 50min'
        },
        {
            id: 3,
            data: '2023-05-16',
            funcionario: 'João Silva',
            entrada: '08:00',
            saidaAlmoco: '12:00',
            retornoAlmoco: '13:00',
            saida: '17:00',
            horasTrabalhadas: '8h'
        },
        {
            id: 4,
            data: '2023-05-16',
            funcionario: 'Carlos Oliveira',
            entrada: '09:00',
            saidaAlmoco: '12:30',
            retornoAlmoco: '13:30',
            saida: '18:00',
            horasTrabalhadas: '8h'
        }
    ];
    
    // Carrega registros iniciais
    carregarRegistros(registrosExemplo);
    
    // Event Listeners
    btnFiltrar.addEventListener('click', filtrarRegistros);
    btnLimpar.addEventListener('click', limparFiltros);
    btnExportar.addEventListener('click', exportarRegistros);
    
    /**
     * Carrega os registros na tabela
     * @param {Array} registros - Array de objetos com os registros
     */
    function carregarRegistros(registros) {
        registrosBody.innerHTML = '';
        
        if (registros.length === 0) {
            registrosBody.innerHTML = `
                <tr>
                    <td colspan="7" class="sem-registros">Nenhum registro encontrado</td>
                </tr>
            `;
            return;
        }
        
        registros.forEach(registro => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatarData(registro.data)}</td>
                <td>${registro.funcionario}</td>
                <td>${registro.entrada}</td>
                <td>${registro.saidaAlmoco}</td>
                <td>${registro.retornoAlmoco}</td>
                <td>${registro.saida}</td>
                <td>${registro.horasTrabalhadas}</td>
            `;
            registrosBody.appendChild(row);
        });
    }
    
    /**
     * Formata data para o padrão brasileiro
     * @param {string} data - Data no formato YYYY-MM-DD
     * @returns {string} Data formatada (DD/MM/YYYY)
     */
    function formatarData(data) {
        const [ano, mes, dia] = data.split('-');
        return `${dia}/${mes}/${ano}`;
    }
    
    /**
     * Filtra os registros conforme os critérios selecionados
     */
    function filtrarRegistros() {
        const funcionarioId = document.getElementById('funcionario').value;
        const dataInicio = document.getElementById('data-inicio').value;
        const dataFim = document.getElementById('data-fim').value;
        
        let registrosFiltrados = [...registrosExemplo];
        
        // Filtro por funcionário
        if (funcionarioId) {
            registrosFiltrados = registrosFiltrados.filter(reg => 
                reg.funcionario.toLowerCase().includes(
                    document.getElementById('funcionario').options[
                        document.getElementById('funcionario').selectedIndex
                    ].text.toLowerCase()
                )
            );
        }
        
        // Filtro por data
        if (dataInicio) {
            registrosFiltrados = registrosFiltrados.filter(reg => 
                reg.data >= dataInicio
            );
        }
        
        if (dataFim) {
            registrosFiltrados = registrosFiltrados.filter(reg => 
                reg.data <= dataFim
            );
        }
        
        carregarRegistros(registrosFiltrados);
    }
    
    /**
     * Limpa todos os filtros
     */
    function limparFiltros() {
        document.getElementById('funcionario').value = '';
        document.getElementById('data-inicio').value = '';
        document.getElementById('data-fim').value = '';
        carregarRegistros(registrosExemplo);
    }
    
    /**
     * Exporta os registros para CSV
     */
    function exportarRegistros() {
        // Implementação simplificada - na prática, seria uma chamada ao backend
        alert('Exportação de registros para CSV será implementada aqui');
    }
});