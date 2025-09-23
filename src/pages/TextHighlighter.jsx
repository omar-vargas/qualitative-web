// components/TextHighlighter.jsx
import React from 'react';

// Mapa de colores predefinido por código
const codeColors = [
  "#d1e7dd", // verde
  "#cff4fc", // azul
  "#f8d7da", // rojo
  "#fff3cd", // amarillo
  "#e2e3e5", // gris claro
  "#f0d1e7", // rosado
  "#d6d8d9", // gris oscuro
];

const getColorByCode = (code, codeMap) => {
  if (!codeMap[code]) {
    codeMap[code] = codeColors[Object.keys(codeMap).length % codeColors.length];
  }
  return codeMap[code];
};

function TextHighlighter() {
  const textoOriginal = `
  La inteligencia artificial ha transformado la educación. Muchos estudiantes ahora dependen de herramientas como ChatGPT para hacer sus tareas. 
  Aunque esto acelera el trabajo, también puede afectar su pensamiento crítico. Algunos profesores ya están adaptando sus métodos para fomentar el análisis profundo.
  `;

  const frasesEtiquetadas = [
    {
      texto: "La inteligencia artificial ha transformado la educación.",
      codigo: "impacto tecnológico"
    },
    {
      texto: "Muchos estudiantes ahora dependen de herramientas como ChatGPT para hacer sus tareas.",
      codigo: "uso de IA"
    },
    {
      texto: "puede afectar su pensamiento crítico",
      codigo: "preocupación pedagógica"
    },
    {
      texto: "fomentar el análisis profundo",
      codigo: "estrategias docentes"
    }
  ];

  // Mapeo de código → color
  const codeMap = {};

  // Resaltar frases en el texto original
  let highlightedText = textoOriginal;

  frasesEtiquetadas.forEach(({ texto, codigo }) => {
    const color = getColorByCode(codigo, codeMap);
    const span = `<span style="background-color: ${color}; padding: 2px 4px; border-radius: 4px;">${texto}</span>`;
    const regex = new RegExp(texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'); // escape
    highlightedText = highlightedText.replace(regex, span);
  });

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📚 Texto resaltado por códigos</h2>
      <div
        dangerouslySetInnerHTML={{ __html: highlightedText }}
        style={{
          backgroundColor: "#f9f9f9",
          padding: "1.5rem",
          borderRadius: "8px",
          lineHeight: "1.6",
          fontSize: "16px"
        }}
      />

      <h3 style={{ marginTop: "2rem" }}>🎯 Leyenda de códigos:</h3>
      <ul>
        {Object.entries(codeMap).map(([codigo, color]) => (
          <li key={codigo} style={{ marginBottom: "8px" }}>
            <span
              style={{
                backgroundColor: color,
                padding: "4px 8px",
                borderRadius: "4px",
                fontWeight: "bold"
              }}
            >
              {codigo}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TextHighlighter;
