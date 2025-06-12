document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const btnFiltrar = document.getElementById('btn-filtrar');
    const btnLimpar = document.getElementById('btn-limpar');
    const btnExportar = document.getElementById('btn-exportar');
    const btnSair = document.getElementById('sair');
    const registrosBody = document.getElementById('registros-body');
    const token = localStorage.getItem('token');
    const btnAnterior = document.getElementById('btn-anterior');
    const btnProximo = document.getElementById('btn-proximo');
    const paginaAtualSpan = document.querySelector('.pagina-atual');
    const funcionarioInput = document.getElementById('funcionario');
    const dataInicioInput = document.getElementById('data-inicio');
    const dataFimInput = document.getElementById('data-fim');
    const funcionarioSelect = document.getElementById('funcionario'); // Alterei para select


    // Variáveis de estado
    let paginaAtual = 1;
    let registrosPorPagina = 10;
    let todosRegistros = [];
    let registrosFiltrados = [];
    let funcionariosDisponiveis = [];

    // Inicialização
    document.getElementById('sair').addEventListener('click', () => {
        window.location.href = 'home.html'; // Redirecionamento direto
    });

    // Carrega dados iniciais
    carregarFuncionarios(); // <-- Chamada ao carregar a página
    carregarDadosIniciais();
    

    // Event Listeners
    btnFiltrar.addEventListener('click', filtrarRegistros);
    btnLimpar.addEventListener('click', limparFiltros);
    btnExportar.addEventListener('click', exportarRegistros);
    btnAnterior.addEventListener('click', paginaAnterior);
    btnProximo.addEventListener('click', paginaProxima);

    // Eventos de validação de data
    dataInicioInput.addEventListener('change', validarDataInicio);
    dataFimInput.addEventListener('change', validarDataFim);

    /**
     * Carrega todos os dados iniciais necessários
     */
    async function carregarDadosIniciais() {
        try {
            await Promise.all([
                carregarFuncionarios(),
                carregarRegistrosIniciais()
            ]);
        } catch (error) {
            console.error('Erro ao carregar dados iniciais:', error);
            mostrarMensagemErro('Erro ao carregar dados iniciais');
        }
    }
    /**
     * Carrega os registros iniciais do banco de dados
     */
    async function carregarRegistrosIniciais() {
        try {
            // Busca datas disponíveis
            const { minDate, maxDate } = await buscarDatasDisponiveis();
            
            // Configura os datepickers
            if (minDate && maxDate) {
                const [minDay, minMonth, minYear] = minDate.split('/');
                const [maxDay, maxMonth, maxYear] = maxDate.split('/');
                
                dataInicioInput.min = `${minYear}-${minMonth.padStart(2, '0')}-${minDay.padStart(2, '0')}`;
                dataInicioInput.max = `${maxYear}-${maxMonth.padStart(2, '0')}-${maxDay.padStart(2, '0')}`;
                
                dataFimInput.min = dataInicioInput.min;
                dataFimInput.max = dataInicioInput.max;
            }

            // Carrega registros
            const response = await fetch('http://localhost:3000/registros', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao carregar registros');
            }

            const registros = await response.json();
            todosRegistros = registros;
            registrosFiltrados = agruparRegistrosPorDia(registros);
            atualizarExibicaoRegistros();
        } catch (error) {
            console.error('Erro:', error);
            mostrarMensagemErro('Erro ao carregar registros');
        }
    }

    /**
     * Carrega a lista de funcionários para o autocomplete
     */
   // Substitua a função carregarFuncionarios por esta versão melhorada
    async function carregarFuncionarios() {
        try {
            const response = await fetch('http://localhost:3000/funcionarios', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao carregar funcionários');
            }

            funcionariosDisponiveis = await response.json();
            
            // Remove o datalist padrão se existir
            const oldDatalist = document.getElementById('funcionarios-list');
            if (oldDatalist) oldDatalist.remove();
            
            // Cria o datalist personalizado
            const customDatalist = document.getElementById('custom-funcionarios-list');
            customDatalist.innerHTML = '';
            
            // Adiciona cada funcionário como opção
            funcionariosDisponiveis.forEach(func => {
                const option = document.createElement('div');
                option.className = 'custom-datalist-option';
                option.textContent = func.func_nome;
                option.addEventListener('click', () => {
                    funcionarioInput.value = func.func_nome;
                    customDatalist.classList.remove('show');
                    // Filtra automaticamente ao selecionar
                    filtrarRegistros();
                });
                customDatalist.appendChild(option);
            });
            
            // Eventos para mostrar/esconder o datalist
            funcionarioInput.addEventListener('focus', () => {
                customDatalist.classList.add('show');
            });
            
            funcionarioInput.addEventListener('input', () => {
                const value = funcionarioInput.value.toLowerCase();
                const options = customDatalist.querySelectorAll('.custom-datalist-option');
                
                options.forEach(option => {
                    const text = option.textContent.toLowerCase();
                    option.style.display = text.includes(value) ? 'block' : 'none';
                });
                
                customDatalist.classList.add('show');
            });
            
            // Esconde ao clicar fora
            document.addEventListener('click', (e) => {
                if (!funcionarioInput.contains(e.target) && !customDatalist.contains(e.target)) {
                    customDatalist.classList.remove('show');
                }
            });
            
        } catch (error) {
            console.error('Erro:', error);
            mostrarMensagemErro('Erro ao carregar lista de funcionários');
        }
    }

    /**
     * Valida quando a data de início é alterada
     */
    function validarDataInicio() {
        if (this.value && dataFimInput.value && new Date(this.value) > new Date(dataFimInput.value)) {
            dataFimInput.value = this.value;
        }
        dataFimInput.min = this.value;
    }

    /**
     * Valida quando a data de fim é alterada
     */
    function validarDataFim() {
        if (this.value && dataInicioInput.value && new Date(this.value) < new Date(dataInicioInput.value)) {
            dataInicioInput.value = this.value;
        }
        dataInicioInput.max = this.value;
    }

    /**
     * Agrupa registros por data e funcionário
     */
    function agruparRegistrosPorDia(registros) {
        const agrupados = {};

        registros.forEach(registro => {
            const key = `${registro.data}_${registro.cpf}`;
            
            if (!agrupados[key]) {
                agrupados[key] = {
                    data: registro.data,
                    nome: registro.nome,
                    cpf: registro.cpf,
                    entrada1: '',
                    saidaAlmoco: '',
                    retornoAlmoco: '',
                    saida2: '',
                    horasTrabalhadas: '0h'
                };
            }

            // Atribui o horário ao tipo correto
            switch(registro.tipo) {
                case 'entrada1':
                    agrupados[key].entrada1 = registro.hora;
                    break;
                case 'saida1':
                    agrupados[key].saidaAlmoco = registro.hora;
                    break;
                case 'entrada2':
                    agrupados[key].retornoAlmoco = registro.hora;
                    break;
                case 'saida2':
                    agrupados[key].saida2 = registro.hora;
                    break;
            }
        });

        // Calcula horas trabalhadas para cada grupo
        Object.values(agrupados).forEach(grupo => {
            grupo.horasTrabalhadas = calcularHorasTrabalhadas(grupo);
        });

        return Object.values(agrupados);
    }

    /**
     * Calcula horas trabalhadas
     */
    function calcularHorasTrabalhadas(registro) {
        if (!registro.entrada1 || !registro.saida2) {
            return '0h';
        }

        // Converte horários para minutos
        function timeToMinutes(time) {
            const [h, m] = time.split(':').map(Number);
            return h * 60 + m;
        }

        const entrada = timeToMinutes(registro.entrada1);
        const saida = timeToMinutes(registro.saida2);
        
        let almoco = 0;
        if (registro.saidaAlmoco && registro.retornoAlmoco) {
            const saidaAlmoco = timeToMinutes(registro.saidaAlmoco);
            const retornoAlmoco = timeToMinutes(registro.retornoAlmoco);
            almoco = retornoAlmoco - saidaAlmoco;
        }

        const totalMinutos = (saida - entrada) - almoco;
        const horas = Math.floor(totalMinutos / 60);
        const minutos = totalMinutos % 60;

        return minutos > 0 ? `${horas}h ${minutos}min` : `${horas}h`;
    }

    /**
     * Atualiza a exibição dos registros com paginação
     */
    function atualizarExibicaoRegistros() {
        const inicio = (paginaAtual - 1) * registrosPorPagina;
        const fim = inicio + registrosPorPagina;
        const registrosPagina = registrosFiltrados.slice(inicio, fim);
        exibirRegistros(registrosPagina);
        atualizarControlesPaginacao();
    }

    /**
     * Exibe os registros na tabela
     */
    function exibirRegistros(registros) {
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
                <td>${formatarDataParaExibicao(registro.data)}</td>
                <td>${registro.nome}</td>
                <td>${registro.entrada1 || '-'}</td>
                <td>${registro.saidaAlmoco || '-'}</td>
                <td>${registro.retornoAlmoco || '-'}</td>
                <td>${registro.saida2 || '-'}</td>
                <td>${registro.horasTrabalhadas}</td>
            `;
            registrosBody.appendChild(row);
        });
    }

    /**
     * Formata data para exibição (dd/mm/aaaa)
     */
    function formatarDataParaExibicao(dataAPI) {
        if (!dataAPI) return '-';
        const [dia, mes, ano] = dataAPI.split('/');
        return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${ano}`;
    }

      
    
    document.getElementById('itensPorPagina').addEventListener('change', function() {
    registrosPorPagina = parseInt(this.value); // Converte para número
    paginaAtual = 1; // Reset para a primeira página
    atualizarExibicaoRegistros(); // Atualiza a exibição
    });

    // Controles de paginação
    function atualizarControlesPaginacao() {
        const totalPaginas = Math.ceil(registrosFiltrados.length / registrosPorPagina);
        paginaAtualSpan.textContent = `Página ${paginaAtual} de ${totalPaginas}`;
        btnAnterior.disabled = paginaAtual === 1;
        btnProximo.disabled = paginaAtual >= totalPaginas;
    }

    // Navegação
    function paginaAnterior() {
        if (paginaAtual > 1) {
            paginaAtual--;
            atualizarExibicaoRegistros();
        }
    }

    function paginaProxima() {
        const totalPaginas = Math.ceil(registrosFiltrados.length / registrosPorPagina);
        if (paginaAtual < totalPaginas) {
            paginaAtual++;
            atualizarExibicaoRegistros();
        }
    }

    /**
     * Valida o intervalo de datas selecionado
     */
    function validarDatas(dataInicio, dataFim) {
        if (dataInicio && dataFim) {
            const inicio = new Date(dataInicio);
            const fim = new Date(dataFim);
            
            if (inicio > fim) {
                mostrarMensagemErro('A data inicial não pode ser maior que a data final');
                return false;
            }
        }
        return true;
    }

    /**
     * Filtra os registros com base nos critérios selecionados
     */
    // Atualize a função filtrarRegistros para validar o input:
    async function filtrarRegistros() {
        const funcionarioNome = funcionarioInput.value.trim();
        const dataInicio = dataInicioInput.value;
        const dataFim = dataFimInput.value;

        // Valida funcionário
        if (funcionarioNome && !funcionariosDisponiveis.some(f => f.func_nome === funcionarioNome)) {
            mostrarMensagemErro('Funcionário não encontrado');
            return;
        }

        // Validação das datas
        if (dataInicio || dataFim) {
            if (!dataInicio || !dataFim) {
                mostrarMensagemErro('Ambos os campos de data devem ser preenchidos');
                return;
            }

            const inicio = new Date(dataInicio);
            const fim = new Date(dataFim);
            
            if (inicio > fim) {
                mostrarMensagemErro('Data de início não pode ser maior que data de fim');
                return;
            }

            // Verifica se as datas são válidas
            if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
                mostrarMensagemErro('Datas inválidas');
                return;
            }
        }

        try {
            let url = 'http://localhost:3000/registros?';
            if (funcionarioNome) url += `nome=${encodeURIComponent(funcionarioNome)}&`;
            if (dataInicio) url += `dataInicio=${formatarDataParaAPI(dataInicio)}&`;
            if (dataFim) url += `dataFim=${formatarDataParaAPI(dataFim)}`;

            // Remove o último & se existir
            url = url.endsWith('&') ? url.slice(0, -1) : url;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Erro ao filtrar registros');

            const registros = await response.json();
            registrosFiltrados = agruparRegistrosPorDia(registros);
            paginaAtual = 1;
            atualizarExibicaoRegistros();
        } catch (error) {
            console.error('Erro:', error);
            mostrarMensagemErro('Erro ao filtrar registros');
        }
    }

// Função auxiliar para formatar a data (certifique-se que está correta)
    function formatarDataParaAPI(dataString) {
        const date = new Date(dataString);
        return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    }
    /**
     * Limpa todos os filtros
     */
    function limparFiltros() {
        funcionarioInput.value = '';
        dataInicioInput.value = '';
        dataFimInput.value = '';
        paginaAtual = 1;
        carregarRegistrosIniciais();
    }

    /**
     * Exporta os registros para CSV
     */
    async function exportarRegistros() {
        try {
            if (registrosFiltrados.length === 0) {
                throw new Error('Nenhum registro para exportar');
            }

            // Adiciona BOM (Byte Order Mark) e usa delimitador ;
            let csv = '\uFEFF'; // BOM para UTF-8 (essencial para Excel)
            csv += 'Data;Funcionário;Entrada;Saída Almoço;Retorno Almoço;Saída;Horas Trabalhadas\n';
            
            registrosFiltrados.forEach(reg => {
                csv += `${formatarDataParaExibicao(reg.data)};${reg.nome};${reg.entrada1 || ''};`;
                csv += `${reg.saidaAlmoco || ''};${reg.retornoAlmoco || ''};`;
                csv += `${reg.saida2 || ''};${reg.horasTrabalhadas}\n`;
            });

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `registros_ponto_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            
            // Limpeza após o download
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 100);
            
        } catch (error) {
            console.error('Erro:', error);
            mostrarMensagemErro('Erro ao exportar registros');
        }
    }

    /**
     * Busca as datas mínima e máxima disponíveis no banco
     */
    async function buscarDatasDisponiveis() {
        try {
            const response = await fetch('http://localhost:3000/registros/datas', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao carregar datas disponíveis');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro:', error);
            return { minDate: null, maxDate: null };
        }
    }

    /**
     * Mostra mensagem de erro na tabela
     */
    function mostrarMensagemErro(mensagem) {
        registrosBody.innerHTML = `
            <tr>
                <td colspan="7" class="sem-registros">${mensagem}</td>
            </tr>
        `;
    }
});