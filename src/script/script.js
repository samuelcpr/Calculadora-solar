class CalculadoraSolar {
  constructor(estado, cidade, consumo) {
    this.estado = estado;
    this.cidade = cidade;
    this.consumo = consumo;
  }

  calcularValorEstimado() {
    const tarifaMediaKWh = 0.5; // Valor médio da tarifa em reais por kWh
    return this.consumo * tarifaMediaKWh;
  }

  calcularPotenciaSistema() {
    const fatorPotencia = 1.2; // Fator de potência recomendado
    return this.consumo / fatorPotencia;
  }

  calcularGeracaoMensal() {
    const fatorGeracao = 30; // Fator de geração mensal média
    return this.consumo * fatorGeracao;
  }

  calcularQuantidadePaineis() {
    const potenciaPainel = 360; // Potência de um painel em watts
    const potenciaSistema = this.calcularPotenciaSistema();
    return Math.ceil(potenciaSistema / potenciaPainel);
  }

  calcularAreaOcupada() {
    const areaPainel = 1.6; // Área de um painel em metros quadrados
    const quantidadePaineis = this.calcularQuantidadePaineis();
    return quantidadePaineis * areaPainel;
  }
}

function formatarValorMonetario(valor) {
  return "R$ " + valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatarValorPotencia(potencia) {
  return potencia.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " kWp";
}

function formatarValorEnergia(energia) {
  return energia.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " kWh";
}

function formatarQuantidadePaineis(quantidade) {
  return quantidade + " placas de 360W";
}

function atualizarCamposDeResultado(valorEstimado, potenciaSistema, geracaoMensal, quantidadePaineis, areaOcupada) {
  document.getElementById("input-valor-instalacao").value = formatarValorMonetario(valorEstimado);
  document.getElementById("input-potencia-sistema").value = formatarValorPotencia(potenciaSistema);
  document.getElementById("input-geracao-mensal").value = formatarValorEnergia(geracaoMensal);
  document.getElementById("input-quant-paineis").value = formatarQuantidadePaineis(quantidadePaineis);
  document.getElementById("input-area-ocupada").value = areaOcupada.toFixed(2);
}

async function buscarCidadesPorEstado(estado) {
  const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const cidadeSelect = document.getElementById("cidade");
    cidadeSelect.innerHTML = "";

    for (const cidade of data) {
      const option = document.createElement("option");
      option.value = cidade.nome.toLowerCase().replace(" ", "_");
      option.textContent = cidade.nome;
      cidadeSelect.appendChild(option);
    }
  } catch (error) {
    console.error("Erro ao buscar cidades:", error);
  }
}

document.getElementById("estado").addEventListener("change", function () {
  const estadoSelecionado = this.value;
  buscarCidadesPorEstado(estadoSelecionado);
});

function calcular() {
  const estado = document.getElementById("estado").value;
  const cidade = document.getElementById("cidade").value;
  const consumo = parseFloat(document.getElementById("consumo").value);

  const calculadora = new CalculadoraSolar(estado, cidade, consumo);

  const valorEstimado = calculadora.calcularValorEstimado();
  const potenciaSistema = calculadora.calcularPotenciaSistema();
  const geracaoMensal = calculadora.calcularGeracaoMensal();
  const quantidadePaineis = calculadora.calcularQuantidadePaineis();
  const areaOcupada = calculadora.calcularAreaOcupada();

  atualizarCamposDeResultado(valorEstimado, potenciaSistema, geracaoMensal, quantidadePaineis, areaOcupada);
}

// Função para buscar estados utilizando a API do IBGE
async function buscarEstados() {
  const url = "https://servicodados.ibge.gov.br/api/v1/localidades/estados";

  try {
    const response = await fetch(url);
    const data = await response.json();

    const estadoSelect = document.getElementById("estado");

    for (const estado of data) {
      const option = document.createElement("option");
      option.value = estado.sigla;
      option.textContent = estado.nome;
      estadoSelect.appendChild(option);
    }
  } catch (error) {
    console.error("Erro ao buscar estados:", error);
  }
}

buscarEstados();
