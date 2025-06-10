document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btnGerarPDF').addEventListener('click', gerarPDF);
});

function gerarPDF() {
    // Obter dados reais do ponto (substitua por sua lógica real)
    const dadosDoPonto = obterDadosDoPonto(); 

    // Criar instância do jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configurações
    doc.setFontSize(16);
    doc.text("Relatório de Ponto Eletrônico", 105, 15, null, null, "center");
    doc.setFontSize(12);
    
    if(dadosDoPonto.length > 0) {
        doc.text(`Funcionário: ${dadosDoPonto[0].NOME}`, 15, 25);
        doc.text(
            `Período: ${dadosDoPonto[0].DATA} a ${dadosDoPonto[dadosDoPonto.length - 1].DATA}`,
            15,
            32
        );
    }

    // Cabeçalho
    doc.setFont(undefined, "bold");
    const headers = ["Data", "Entrada 1", "Saída 1", "Entrada 2", "Saída 2", "Total"];
    const positions = [15, 50, 80, 110, 140, 170];
    
    headers.forEach((header, index) => {
        doc.text(header, positions[index], 45);
    });

    doc.setLineWidth(0.5);
    doc.line(10, 48, 200, 48);

    let yPos = 55;
    doc.setFont(undefined, "normal");

    dadosDoPonto.forEach(registro => {
        const horasManha = calcularHoras(registro.ENTRADA01, registro.SAIDA01);
        const horasTarde = calcularHoras(registro.ENTRADA02, registro.SAIDA02);
        const totalHoras = horasManha + horasTarde;

        // Adicionar dados
        const values = [
            registro.DATA,
            registro.ENTRADA01,
            registro.SAIDA01,
            registro.ENTRADA02,
            registro.SAIDA02,
            `${totalHoras.toFixed(2)} horas`
        ];
        
        values.forEach((value, index) => {
            doc.text(value, positions[index], yPos);
        });

        doc.line(10, yPos + 3, 200, yPos + 3);
        yPos += 10;
    });

    // Totalizador
    if(dadosDoPonto.length > 0) {
        doc.setFont(undefined, 'bold');
        doc.text("TOTAL HORAS : ", 135, yPos + 5);
        doc.text(calcularTotalHoras(dadosDoPonto).toFixed(2) + " horas", 170, yPos + 5);
    }

    // Assinatura
    doc.setFont(undefined, 'normal');
    doc.text("________________________________________", 105, yPos + 20, null, null, 'center');
    doc.text("Assinatura do Funcionário", 105, yPos + 27, null, null, 'center');

    // Rodapé
    doc.setFontSize(10);
    doc.text("Gerado em: " + new Date().toLocaleDateString(), 15, 280);
    doc.text("Time Wise - Sistema de Ponto Eletrônico", 105, 280, null, null, 'center');

    // Salvar PDF
    doc.save("relatorio_ponto.pdf");
}

// Função para obter dados reais
function obterDadosDoPonto() {
    return [
    
          {
            NOME: "Tiago Gomez",
            DATA: "05/06/2025",
            ENTRADA01: "08:00",
            SAIDA01: "11:00",
            ENTRADA02: "13:00",
            SAIDA02: "17:45",
        },
          {
            NOME: "Tiago Gomez",
            DATA: "05/06/2025",
            ENTRADA01: "08:00",
            SAIDA01: "11:00",
            ENTRADA02: "13:00",
            SAIDA02: "18:00",
        },
          {
            NOME: "Tiago Gomez",
            DATA: "05/06/2025",
            ENTRADA01: "08:00",
            SAIDA01: "11:00",
            ENTRADA02: "13:00",
            SAIDA02: "18:00",
        },
          {
            NOME: "Tiago Gomez",
            DATA: "05/06/2025",
            ENTRADA01: "08:00",
            SAIDA01: "11:00",
            ENTRADA02: "13:00",
            SAIDA02: "18:00",
        },
          {
            NOME: "Tiago Gomez",
            DATA: "05/06/2025",
            ENTRADA01: "08:00",
            SAIDA01: "11:00",
            ENTRADA02: "13:00",
            SAIDA02: "18:00",
        },
        
    ];
}

//FUNCTION PARA PUXAR JSON DO BANCO
// async function obterDadosDoPonto() {
//     try {
//         const response = await fetch('/api/registros-ponto');
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error('Erro ao obter dados:', error);
//         return [];
//     }
// }
function calcularHoras(entrada, saida) {
    if(!entrada || !saida) return 0;
    
    const [horaEnt, minEnt] = entrada.split(':').map(Number);
    const [horaSai, minSai] = saida.split(':').map(Number);
    
    const totalMinutos = (horaSai * 60 + minSai) - (horaEnt * 60 + minEnt);
    return totalMinutos / 60;
}

function calcularTotalHoras(registros) {
    return registros.reduce((total, reg) => {
        const manha = calcularHoras(reg.ENTRADA01, reg.SAIDA01);
        const tarde = calcularHoras(reg.ENTRADA02, reg.SAIDA02);
        return total + manha + tarde;
    }, 0);
}