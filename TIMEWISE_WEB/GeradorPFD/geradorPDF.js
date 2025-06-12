document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("btnGerarPDF").addEventListener("click", gerarPDF);
});

function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToHours(totalMinutes) {
  return totalMinutes / 60;
}

function calcularHoras(entrada, saida) {
  if (!entrada || !saida) return 0;

  const entradaMinutos = timeToMinutes(entrada);
  const saidaMinutos = timeToMinutes(saida);

  let diffMinutos = saidaMinutos - entradaMinutos;
  if (diffMinutos < 0) {
    // Assume que a saída é no dia seguinte
    diffMinutos += 24 * 60;
  }
  return minutesToHours(diffMinutos);
}

function calcularTotalHorasPorDia(registrosDoDia) {
  let totalMinutosDia = 0;
  let entradaManha = null;
  let saidaManha = null;
  let entradaTarde = null;
  let saidaTarde = null;

  registrosDoDia.forEach(reg => {
    if (reg.ENTRADA01) entradaManha = reg.ENTRADA01;
    if (reg.SAIDA01) saidaManha = reg.SAIDA01;
    if (reg.ENTRADA02) entradaTarde = reg.ENTRADA02;
    if (reg.SAIDA02) saidaTarde = reg.SAIDA02;
  });

  if (entradaManha && saidaManha) {
    totalMinutosDia += timeToMinutes(saidaManha) - timeToMinutes(entradaManha);
  }
  if (entradaTarde && saidaTarde) {
    totalMinutosDia += timeToMinutes(saidaTarde) - timeToMinutes(entradaTarde);
  }

  return minutesToHours(totalMinutosDia);
}

function calcularTotalHoras(registros) {
  const registrosPorData = {};

  registros.forEach(reg => {
    if (!registrosPorData[reg.DATA]) {
      registrosPorData[reg.DATA] = [];
    }
    registrosPorData[reg.DATA].push(reg);
  });

  let totalHorasPeriodo = 0;
  Object.values(registrosPorData).forEach(regsDoDia => {
    totalHorasPeriodo += calcularTotalHorasPorDia(regsDoDia);
  });

  return totalHorasPeriodo;
}

// Função para formatar data no padrão dd/mm/aaaa
function formatarData(data) {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

function formatarDataISO(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function obterPeriodoSelecionado() {
  const dataInicio = document.getElementById('dataInicio').value;
  const dataFim = document.getElementById('dataFim').value;

  // Formatar para exibição no relatório
  let mesAno = '';
  if (dataInicio && dataFim) {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    mesAno = `${inicio.toLocaleDateString('pt-BR')} até ${fim.toLocaleDateString('pt-BR')}`;
  }

  return {
    dataInicio,
    dataFim,
    mesAno
  };
}

// Função para obter dados do banco de dados
async function obterDadosDoPonto() {
  try {
    const periodo = obterPeriodoSelecionado();
    console.log('Buscando registros para o período:', periodo);
    
    // Pegue o CPF do funcionário logado
    const cpf = localStorage.getItem('func_cpf');
    if (!cpf) {
      alert('CPF do funcionário não encontrado. Faça login novamente.');
      return { dados: [], periodo };
    }

    // Envie o CPF na URL
    const url = `http://localhost:3000/registros?cpf=${cpf}`;
    console.log('URL da requisição:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include'
    });
    
    console.log('Status da resposta:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resposta do servidor:', errorText);
      throw new Error(`Erro na requisição: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Dados recebidos:', data);
    
    if (!Array.isArray(data)) {
      console.error('Formato de dados inválido:', data);
      throw new Error('Formato de dados inválido retornado pelo servidor');
    }
    
    return { dados: data, periodo };
  } catch (error) {
    console.error("Erro detalhado ao obter dados:", {
      mensagem: error.message,
      stack: error.stack,
      tipo: error.name
    });
    
    let mensagemErro = 'Erro ao buscar registros. ';
    if (error.message.includes('Failed to fetch')) {
      mensagemErro += 'Não foi possível conectar ao servidor. Verifique sua conexão.';
    } else if (error.message.includes('401')) {
      mensagemErro += 'Sessão expirada. Por favor, faça login novamente.';
    } else if (error.message.includes('403')) {
      mensagemErro += 'Acesso negado. Verifique suas permissões.';
    } else if (error.message.includes('404')) {
      mensagemErro += 'Serviço não encontrado. Verifique se o servidor está online.';
    } else {
      mensagemErro += 'Por favor, tente novamente mais tarde.';
    }
    
    alert(mensagemErro);
    return { dados: [], periodo: '' };
  }
}

// Agrupar registros por data e montar estrutura esperada
function agruparRegistrosPorDia(registros) {
  const dias = {};
  registros.forEach(reg => {
    // Converter data para yyyy-mm-dd para facilitar comparação
    const partes = reg.data.split('/'); // dd/mm/yyyy
    const dataISO = `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
    if (!dias[dataISO]) {
      dias[dataISO] = {
        DATA: dataISO, // para comparação
        DATA_ORIGINAL: reg.data, // para exibição
        ENTRADA01: '',
        SAIDA01: '',
        ENTRADA02: '',
        SAIDA02: '',
        NOME: reg.nome || '',
      };
    }
    if (reg.tipo === 'entrada1') dias[dataISO].ENTRADA01 = reg.hora;
    if (reg.tipo === 'saida1') dias[dataISO].SAIDA01 = reg.hora;
    if (reg.tipo === 'entrada2') dias[dataISO].ENTRADA02 = reg.hora;
    if (reg.tipo === 'saida2') dias[dataISO].SAIDA02 = reg.hora;
  });
  // Retornar array ordenado por data
  return Object.values(dias).sort((a, b) => a.DATA.localeCompare(b.DATA));
}

async function gerarPDF() {
  try {
    // Obter dados reais do ponto do banco de dados
    const { dados: dadosDoPonto, periodo } = await obterDadosDoPonto();
    
    if (!dadosDoPonto || dadosDoPonto.length === 0) {
      alert('Nenhum registro encontrado para o período selecionado.');
      return;
    }

    // Agrupar os dados recebidos
    const registrosAgrupados = agruparRegistrosPorDia(dadosDoPonto);

    // Criar instância do jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configurações
    doc.setFontSize(16);
    doc.text("Relatório de Ponto Eletrônico", 105, 15, null, null, "center");
    doc.setFontSize(12);

    // Nome do funcionário
    let nomeFuncionario = (registrosAgrupados.length > 0 && registrosAgrupados[0].NOME) ? registrosAgrupados[0].NOME : '';
    doc.text(`Funcionário: ${nomeFuncionario}`, 15, 25);
    // Período no formato yyyy-mm-dd a yyyy-mm-dd
    doc.text(`Período: ${periodo.dataInicio} a ${periodo.dataFim}`, 15, 32);

    // Cabeçalho
    doc.setFont(undefined, "bold");
    const headers = [
      "Data",
      "Entrada 1",
      "Saída 1",
      "Entrada 2",
      "Saída 2",
      "Total",
    ];
    const positions = [15, 50, 80, 110, 140, 170];

    headers.forEach((header, index) => {
      doc.text(header, positions[index], 45);
    });

    doc.setLineWidth(0.5);
    doc.line(10, 48, 200, 48);

    let yPos = 55;
    doc.setFont(undefined, "normal");

    let totalHorasPeriodo = 0;

    // Filtrar registros do período selecionado
    const registrosFiltrados = registrosAgrupados.filter(registro => {
      if (!registro.DATA) return false;
      const dataRegistro = new Date(registro.DATA);
      const dataInicio = new Date(periodo.dataInicio);
      const dataFim = new Date(periodo.dataFim);
      // Considerar datas no intervalo (inclusive)
      return dataRegistro >= dataInicio && dataRegistro <= dataFim;
    });

    registrosFiltrados.forEach((registro) => {
      // Exibir data original (dd/mm/aaaa)
      let dataFormatada = registro.DATA_ORIGINAL || '';
      const horasManha = calcularHoras(registro.ENTRADA01, registro.SAIDA01);
      const horasTarde = calcularHoras(registro.ENTRADA02, registro.SAIDA02);
      const totalHoras = horasManha + horasTarde;
      totalHorasPeriodo += totalHoras;

      // Adicionar dados
      const values = [
        dataFormatada,
        registro.ENTRADA01 || '',
        registro.SAIDA01 || '',
        registro.ENTRADA02 || '',
        registro.SAIDA02 || '',
        `${formatarHorasDecimais(totalHoras)} horas`,
      ];

      values.forEach((value, index) => {
        doc.text(String(value), positions[index], yPos);
      });

      doc.line(10, yPos + 3, 200, yPos + 3);
      yPos += 10;
    });

    // Totalizador
    if (registrosFiltrados.length > 0) {
      doc.setFont(undefined, "bold");
      doc.text("TOTAL HORAS : ", 135, yPos + 5);
      doc.text(
        formatarHorasDecimais(totalHorasPeriodo) + " horas",
        170,
        yPos + 5
      );
    }

    // Assinatura
    doc.setFont(undefined, "normal");
    doc.text(
      "________________________________________",
      105,
      yPos + 20,
      null,
      null,
      "center"
    );
    doc.text("Assinatura do Funcionário", 105, yPos + 27, null, null, "center");

    // Rodapé
    doc.setFontSize(10);
    doc.text("Gerado em: " + new Date().toLocaleDateString(), 15, 280);
    doc.text(
      "Time Wise - Sistema de Ponto Eletrônico",
      105,
      280,
      null,
      null,
      "center"
    );

    // Salvar PDF
    doc.save("relatorio_ponto.pdf");
  } catch (error) {
    console.error("Erro ao gerar o PDF:", error);
    alert('Erro ao gerar o PDF. Por favor, tente novamente mais tarde.');
  }
}

function formatarHorasDecimais(decimal) {
  const horas = Math.floor(decimal);
  const minutos = Math.round((decimal - horas) * 60);
  return `${horas}:${minutos.toString().padStart(2, '0')}`;
}


