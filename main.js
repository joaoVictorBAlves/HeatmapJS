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

    const parsedData = Papa.parse(data, { header: true, delimiter: ";" });

    const alunos = parsedData.data.map((row) => row["Alunos"]);

    const questoes = Object.keys(parsedData.data[0]).slice(1);

    const aluno_questao = [];

    parsedData.data.forEach((row) => {
      const alunoRespostas = Object.values(row).slice(1).map(Number);
      aluno_questao.push(alunoRespostas);
    });
    /**
     * Copy the orinal data
     */
    data_aluno_questao = JSON.parse(JSON.stringify(aluno_questao));
    data_alunos = JSON.parse(JSON.stringify(alunos));
    data_questoes = JSON.parse(JSON.stringify(questoes));
    /**
     * Render
     */
    drawHeatmap(aluno_questao, alunos, questoes);
  };

  reader.readAsText(file);
});

// Draw function
const canvas = document.getElementById("heatmap");
const ctx = canvas.getContext("2d");

function drawHeatmap(matrix, alunos, questoes, clustered = false) {
  canvas.style.border = "none";
  canvas.style.boxShadow = "none";
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const numRows = matrix.length;
  const numCols = matrix[0].length;

  const labelWidthAlunos = calculateLabelWidth(alunos);
  const labelHeightQuestoes = 20; // Altura dos rótulos das questões

  const cellWidth = (canvas.width - labelWidthAlunos) / numCols;
  const cellHeight = (canvas.height - labelHeightQuestoes) / numRows;

  // Loop para desenhar os rótulos das questões na parte superior

  ctx.textAlign = "center";
  for (let i = 0; i < numCols; i++) {
    const x = labelWidthAlunos + i * cellWidth + cellWidth / 2;
    ctx.fillStyle = "black";
    if (clustered == "y" || clustered == false)
      ctx.fillText(questoes[i], x, labelHeightQuestoes / 1.5);
  }

  // Ajuste da posição do heatmap para acomodar os rótulos das questões
  ctx.translate(labelWidthAlunos, labelHeightQuestoes);

  // Loop para desenhar os rótulos dos alunos e o heatmap
  for (let i = 0; i < numRows; i++) {
    // Desenha o texto do rótulo do aluno
    ctx.fillStyle = "black";
    if (clustered == "x" || clustered == false)
      ctx.fillText(alunos[i], 0 - 15, i * cellHeight + (cellHeight / 1.5));
    for (let j = 0; j < numCols; j++) {
      const x = j * cellWidth;
      const y = i * cellHeight;

      if (matrix[i][j] === 0) {
        ctx.fillStyle = "rgb(255, 0, 0)";
      } else if (matrix[i][j] === 1) {
        ctx.fillStyle = "rgb(255, 255, 0)";
      } else if (matrix[i][j] === 2) {
        ctx.fillStyle = "rgb(0, 255, 0)";
      }

      // Desenha o quadrado com o contorno preto
      ctx.fillRect(x, y, cellWidth, cellHeight);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 0.2;
      ctx.strokeRect(x, y, cellWidth, cellHeight);
    }
  }

  // Resetar a transformação para evitar problemas futuros
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

// Função auxiliar para calcular a largura total dos rótulos dos alunos
function calculateLabelWidth(labels) {
  let width = 0;
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.font = "12px Arial"; // Defina a fonte e o tamanho dos rótulos dos alunos

  labels.forEach(label => {
    const labelWidth = ctx.measureText(label).width;
    if (labelWidth > width) {
      width = labelWidth;
    }
  });

  return width;
}

// Sort and restore public functions
function sortAndHighlight() {
  document.getElementById("btn-sort").style.width = "145px";
  document.getElementById("btn-restore").style.width = "145px";
  document.getElementById("btn-restore").style.display = "block";

  const highlightValue = document.getElementById("highlightSelect").value;
  const orderValue = document.getElementById("orderSelect").value;

  const isBest = highlightValue === "best";
  const isRows = orderValue === "rows";

  // Copiar os dados originais para uma nova matriz antes de aplicar as operações
  const newData = JSON.parse(JSON.stringify(data_aluno_questao));
  const newAlunos = JSON.parse(JSON.stringify(data_alunos));
  const newQuestoes = JSON.parse(JSON.stringify(data_questoes));

  console.log(newData)
  let clustered = false;
  if (isRows === true) {
    sortAndGroupedLines(newData, newAlunos, isBest);
    clustered = "x";
  } else {
    sortAndGroupedColumns(newData, newQuestoes, isBest);
    clustered = "y";
  }

  drawHeatmap(newData, newAlunos, newQuestoes, clustered);
}

function restore() {
  document.getElementById("btn-sort").style.width = "100%";
  document.getElementById("btn-restore").style.display = "none";

  const aluno_questao = JSON.parse(JSON.stringify(data_aluno_questao));
  const alunos = JSON.parse(JSON.stringify(data_alunos));
  const questoes = JSON.parse(JSON.stringify(data_questoes));

  drawHeatmap(aluno_questao, alunos, questoes, false);
}

// Private functions
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

function sortMatrixVertical(matrix, vector, factor) {
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
        const tempItem = vector[j];
        matrix[j] = matrix[j + 1];
        matrix[j + 1] = tempRow;
        vector[j] = vector[j + 1];
        vector[j + 1] = tempItem;

        // Troca de contagem
        const tempCount = count[j];
        count[j] = count[j + 1];
        count[j + 1] = tempCount;
      }
    }
  }
}

function sortMatrixHorizontal(matrix, vector, factor) {
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
          const tempItem = vector[j];
          matrix[k][j] = matrix[k][j + 1];
          matrix[k][j + 1] = temp;
          vector[j] = vector[j + 1];
          vector[j + 1] = tempItem;
        }

        // Troca de contagem
        const tempCount = count[j];
        count[j] = count[j + 1];
        count[j + 1] = tempCount;
      }
    }
  }
}

function sortAndGroupedLines(dataset, vector, best) {
  if (best) {
    sortMatrixLines(dataset, false);
    sortMatrixVertical(dataset, vector, 0);
    sortMatrixVertical(dataset, vector, 1);
    sortMatrixVertical(dataset, vector, 2);
  } else {
    sortMatrixLines(dataset, true);
    sortMatrixVertical(dataset, vector, 2);
    sortMatrixVertical(dataset, vector, 1);
    sortMatrixVertical(dataset, vector, 0);
  }
}

function sortAndGroupedColumns(dataset, vector, best) {
  if (best) {
    sortMatrixColumns(dataset, false);
    sortMatrixHorizontal(dataset, vector, 0);
    sortMatrixHorizontal(dataset, vector, 1);
    sortMatrixHorizontal(dataset, vector, 2);
  } else {
    sortMatrixColumns(dataset, true);
    sortMatrixHorizontal(dataset, vector, 2);
    sortMatrixHorizontal(dataset, vector, 1);
    sortMatrixHorizontal(dataset, vector, 0);
  }
}