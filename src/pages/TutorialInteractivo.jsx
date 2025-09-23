import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import captura1 from "../tutorial/captura1.png";
import captura2 from "../tutorial/captura2.png";
import captura0 from "../tutorial/captura0.png";
import captura3 from "../tutorial/captura3.png";

import captura5 from "../tutorial/captura5.png";
import captura6 from "../tutorial/captura6.png";

const pasos = [
  {
    titulo: "Bienvenido a la plataforma",
    descripcion: "Este sitio te permite analizar entrevistas de forma cualitativa, generar códigos asistidos por agentes y organizarlos eficientemente.",
    imagen: captura0,
  },
  {
    titulo: "Paso 1: Importar archivos",
    descripcion: "Sube tus entrevistas en formato .txt o .pdf. Dirígete a la sección 'Importar datos' para comenzar o arrastra los archivos. Despues si lo consideras necesario añade las preguntas o hipotesis de tu investigación",
    imagen: captura1,
  },
  {
    titulo: "Paso 2: Codificacion basada en Agente",
    descripcion: "Por favor Espera a que el agente genere los codigos una vez generado puedes ir al siguiente Paso",
    imagen: captura3,
  },
    {
    titulo: "Paso 3: Codificación en conjunto con el Agente ",
    descripcion: "En esta parte puedes eliminar los códigos que consideres no se Ajustan y darle feedback al Agente para que genere nuevos códigos cuando estes conforme dale click a siguiente",
    imagen: captura2,
    },
  {
    titulo: "Paso 3: Codificación en conjunto con el Agente",
    descripcion: " Puedes Añadir feedback al agente o Agregar tus propios codigos",
    imagen: captura5,
  },
  {
    titulo: "Paso 4: Exportar resultados",
    descripcion: "Puedes descargar un resumen o exportar los fragmentos codificados en CSV desde la página final del proceso.",
    imagen: captura6,
  }
];

function TutorialInteractivo() {
  const [paso, setPaso] = useState(0);
  const [mostrar, setMostrar] = useState(() => {
    return localStorage.getItem("tutorial_oculto") !== "true";
  });

  const total = pasos.length;
  const navigate = useNavigate();

  const cerrarTutorial = () => {
    localStorage.setItem("tutorial_oculto", "true");
    setMostrar(false);
  };

  if (!mostrar) return null;

  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "1.5rem",
      maxWidth: "650px",
      margin: "1.5rem auto",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
    }}>
      <h2>{pasos[paso].titulo}</h2>
      <p>{pasos[paso].descripcion}</p>
      <img
        src={pasos[paso].imagen}
        alt={`Paso ${paso + 1}`}
        style={{
          width: "100%",
          maxHeight: "300px",
          objectFit: "contain",
          marginTop: "1rem",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      />

      <div style={{
        marginTop: "1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <button
          onClick={() => setPaso(Math.max(paso - 1, 0))}
          disabled={paso === 0}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: paso === 0 ? "#ccc" : "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: paso === 0 ? "not-allowed" : "pointer"
          }}
        >
          ← Anterior
        </button>

        <div>
          {pasos.map((_, i) => (
            <span
              key={i}
              style={{
                height: "10px",
                width: "10px",
                margin: "0 4px",
                display: "inline-block",
                borderRadius: "50%",
                backgroundColor: i === paso ? "#007bff" : "#ccc"
              }}
            ></span>
          ))}
        </div>

        {paso < total - 1 ? (
          <button
            onClick={() => setPaso(Math.min(paso + 1, total - 1))}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Siguiente →
          </button>
        ) : (
          <button
            onClick={() => navigate("/data")}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Ir a la plataforma →
          </button>
        )}
      </div>

      <div style={{ marginTop: "1rem", textAlign: "right" }}>
        <label>
          <input type="checkbox" onChange={cerrarTutorial} /> No volver a mostrar
        </label>
      </div>
    </div>
  );
}

export default TutorialInteractivo;
