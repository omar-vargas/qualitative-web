import React, { useEffect, useState } from 'react';
import { useSession } from '../context/SessionContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';

function Summary() {
  const { session } = useSession();
  const navigate = useNavigate();
  const [finalCodes, setFinalCodes] = useState([]);
  const [preguntas, setPreguntas] = useState([]);
  const [feedbackHistory, setFeedbackHistory] = useState({});

  useEffect(() => {
    const codes = localStorage.getItem("final_codes");
    if (codes) {
      setFinalCodes(JSON.parse(codes));
    }

    const preguntasStored = localStorage.getItem("preguntas");
    if (preguntasStored) {
      setPreguntas(JSON.parse(preguntasStored));
    }

    const hist = localStorage.getItem("feedback_history");
    if (hist) {
      setFeedbackHistory(JSON.parse(hist));
    }
  }, []);

  const handleDownloadCodes = () => {
    const csvContent = "Códigos\n" + finalCodes.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'codigos_finales.csv';
    a.click();
  };

  const handleDownloadPreguntas = () => {
    const txtContent = preguntas.join("\n");
    const blob = new Blob([txtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'preguntas_investigacion.txt';
    a.click();
  };

  const handleRestart = () => {
    // Clear localStorage
    localStorage.clear();
    navigate("/");
  };

  if (!session) {
    return <Alert severity="error">❌ Sesión no iniciada.</Alert>;
  }

  return (
    <Box sx={{ maxWidth: 1000, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        <AssessmentIcon sx={{ mr: 1, fontSize: '2rem' }} />
        Resumen Final del Análisis Cualitativo
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        Aquí tienes un resumen completo de tu proceso de codificación asistido por IA.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🎯 Hipótesis de Investigación
              </Typography>
              <List dense>
                {preguntas.map((p, i) => (
                  <ListItem key={i}>
                    <ListItemText primary={`${i + 1}. ${p}`} />
                  </ListItem>
                ))}
              </List>
              <Button
                startIcon={<DownloadIcon />}
                onClick={handleDownloadPreguntas}
                variant="outlined"
                size="small"
                sx={{ mt: 1 }}
              >
                Descargar Preguntas
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🏷️ Códigos Finales ({finalCodes.length})
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {finalCodes.map((code, i) => (
                  <Chip key={i} label={code} color="primary" variant="outlined" />
                ))}
              </Box>
              <Button
                startIcon={<DownloadIcon />}
                onClick={handleDownloadCodes}
                variant="outlined"
                size="small"
              >
                Descargar Códigos CSV
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {Object.keys(feedbackHistory).length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📊 Historial de Iteraciones
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Se realizaron {Object.keys(feedbackHistory).length} iteraciones de feedback con la IA.
                </Typography>
                {Object.entries(feedbackHistory).map(([iteration, codes], idx) => (
                  <Box key={idx} sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">{iteration} ({codes.length} códigos)</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, ml: 2 }}>
                      {codes.map((code, i) => (
                        <Chip key={i} label={code} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          ¿Qué deseas hacer ahora?
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRestart}
          >
            Iniciar Nuevo Análisis
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/label")}
          >
            Ver Textos Codificados
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/home")}
          >
            Volver al Inicio
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Summary;