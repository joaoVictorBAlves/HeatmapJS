function createMatrix(n, m) {
  let matrix = [];

  for (let i = 0; i < n; i++) {
    let row = [];
    for (let j = 0; j < m; j++) {
      row.push(null);
    }
    matrix.push(row);
  }
  return matrix;
}

function fillMatrixWithRandom(matrix, min, max) {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
      matrix[i][j] = randomValue;
    }
  }
}

function sortMatrixLines(matrix, ascending = true) {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length - 1; j++) {
      for (let k = 0; k < matrix[i].length - j - 1; k++) {
        if (ascending) {
          if (matrix[i][k] > matrix[i][k + 1]) {
            let temp = matrix[i][k];
            matrix[i][k] = matrix[i][k + 1];
            matrix[i][k + 1] = temp;
          }
        } else {
          if (matrix[i][k] < matrix[i][k + 1]) {
            let temp = matrix[i][k];
            matrix[i][k] = matrix[i][k + 1];
            matrix[i][k + 1] = temp;
          }
        }
      }
    }
  }
}

function sortMatrixColumns(matrix, ascending = true) {
  for (let j = 0; j < matrix[0].length; j++) {
    for (let i = 0; i < matrix.length - 1; i++) {
      for (let k = 0; k < matrix.length - i - 1; k++) {
        if (ascending) {
          if (matrix[k][j] > matrix[k + 1][j]) {
            let temp = matrix[k][j];
            matrix[k][j] = matrix[k + 1][j];
            matrix[k + 1][j] = temp;
          }
        } else {
          if (matrix[k][j] < matrix[k + 1][j]) {
            let temp = matrix[k][j];
            matrix[k][j] = matrix[k + 1][j];
            matrix[k + 1][j] = temp;
          }
        }
      }
    }
  }
}

function sortMatrixVertical(matrix, factor) {
  // Contar a quantidade do fator em cada linha
  const count = new Array(matrix.length).fill(0);

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === factor) {
        count[i]++;
      }
    }
  }

  // Ordenar a matriz com base na contagem
  for (let i = 0; i < matrix.length - 1; i++) {
    for (let j = 0; j < matrix.length - i - 1; j++) {
      if (count[j] > count[j + 1]) {
        // Troca de linhas na matriz
        const tempRow = matrix[j];
        matrix[j] = matrix[j + 1];
        matrix[j + 1] = tempRow;

        // Troca de contagem
        const tempCount = count[j];
        count[j] = count[j + 1];
        count[j + 1] = tempCount;
      }
    }
  }
}

function sortMatrixHorizontal(matrix, factor) {
  // Contar a quantidade do fator em cada coluna
  const count = new Array(matrix[0].length).fill(0);

  for (let j = 0; j < matrix[0].length; j++) {
    for (let i = 0; i < matrix.length; i++) {
      if (matrix[i][j] === factor) {
        count[j]++;
      }
    }
  }

  // Ordenar a matriz com base na contagem
  for (let i = 0; i < matrix[0].length - 1; i++) {
    for (let j = 0; j < matrix[0].length - i - 1; j++) {
      if (count[j] > count[j + 1]) {
        // Troca de colunas na matriz
        for (let k = 0; k < matrix.length; k++) {
          const temp = matrix[k][j];
          matrix[k][j] = matrix[k][j + 1];
          matrix[k][j + 1] = temp;
        }

        // Troca de contagem
        const tempCount = count[j];
        count[j] = count[j + 1];
        count[j + 1] = tempCount;
      }
    }
  }
}

function sortAndGroupedLines(dataset, best) {
  if (best) {
    sortMatrixLines(dataset, false);
    sortMatrixVertical(dataset, 0);
    sortMatrixVertical(dataset, 1);
    sortMatrixVertical(dataset, 2);
  } else {
    sortMatrixLines(dataset, true);
    sortMatrixVertical(dataset, 2);
    sortMatrixVertical(dataset, 1);
    sortMatrixVertical(dataset, 0);
  }
}

function sortAndGroupedColumns(dataset, best) {
  if (best) {
    sortMatrixColumns(dataset, false);
    sortMatrixHorizontal(dataset, 0);
    sortMatrixHorizontal(dataset, 1);
    sortMatrixHorizontal(dataset, 2);
  } else {
    sortMatrixColumns(dataset, true);
    sortMatrixHorizontal(dataset, 2);
    sortMatrixHorizontal(dataset, 1);
    sortMatrixHorizontal(dataset, 0);
  }
}

// Draw
const canvas = document.getElementById("heatmap");
const ctx = canvas.getContext("2d");

function drawHeatmap(matrix) {
  const numRows = matrix.length;
  const numCols = matrix[0].length;

  const cellWidth = canvas.width / numCols;
  const cellHeight = canvas.height / numRows;

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      const x = j * cellWidth;
      const y = i * cellHeight;

      if (matrix[i][j] === 0) {
        ctx.fillStyle = "rgb(255, 0, 0)"; // Vermelho
      } else if (matrix[i][j] === 1) {
        ctx.fillStyle = "rgb(255, 255, 0)"; // Amarelo
      } else if (matrix[i][j] === 2) {
        ctx.fillStyle = "rgb(0, 255, 0)"; // Verde
      }

      // Desenha o quadrado com o contorno preto
      ctx.fillRect(x, y, cellWidth, cellHeight);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 0.2;
      ctx.strokeRect(x, y, cellWidth, cellHeight);
    }
  }
}

// const dataset = createMatrix(10, 15);
// fillMatrixWithRandom(dataset, 0, 2);
// sortAndGroupedColumns(dataset, true);
// console.log(dataset);
// drawHeatmap(dataset);
let origin_data_alunos;
let origin_data_questoes;
let origin_data_aluno_questao;
let data_alunos;
let data_questoes;
let data_aluno_questao;
const fileInput = document.getElementById("fileInput");
const fileLabel = document.getElementById("fileLabel");

document.getElementById("fileInput").addEventListener("change", function (e) {
  const file = e.target.files[0];

  if (fileInput.files.length > 0) {
    fileLabel.textContent = fileInput.files[0].name;
  } else {
    fileLabel.textContent = "Nenhum arquivo escolhido";
  }

  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const data = e.target.result;

    // Parse do CSV usando Papa
    const parsedData = Papa.parse(data, { header: true, delimiter: ";" });

    // Vetor de alunos e questões
    const alunos = parsedData.data.map((row) => row["ALUNOS"]);

    // Extraindo as questões do cabeçalho
    const questoes = Object.keys(parsedData.data[0]).slice(1);

    // Matriz aluno_questao
    const aluno_questao = [];

    parsedData.data.forEach((row) => {
      const alunoRespostas = Object.values(row).slice(1).map(Number);
      aluno_questao.push(alunoRespostas);
    });

    data_alunos = alunos;
    data_questoes = questoes;
    data_aluno_questao = aluno_questao;
    origin_data_aluno_questao = aluno_questao;
    drawHeatmap(data_aluno_questao);
  };

  reader.readAsText(file);
});

function sortAndHighlight() {
  const highlightValue = document.getElementById("highlightSelect").value;
  const orderValue = document.getElementById("orderSelect").value;

  const isBest = highlightValue === "best";
  const isRows = orderValue === "rows";

  // Copiar os dados originais para uma nova matriz antes de aplicar as operações
  const newData = JSON.parse(JSON.stringify(origin_data_aluno_questao));

  if (isRows === true) {
    sortAndGroupedLines(newData, isBest);
  } else {
    sortAndGroupedColumns(newData, isBest);
  }

  drawHeatmap(newData);
}
