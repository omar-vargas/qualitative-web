import React, { useEffect, useState } from 'react';
import { useSession } from '../context/SessionContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Chip,
  CircularProgress,
  Button,
  Alert,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  LinearProgress
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PsychologyIcon from '@mui/icons-material/Psychology';
import HyperparametersSettings from '../components/HyperparametersSettings';

function Step2Generar() {
  const { session } = useSession();
  const navigate = useNavigate();
  const [preguntas, setPreguntas] = useState([]);
  const [codigos, setCodigos] = useState([]);
  const [codigosSinHipotesis, setCodigosSinHipotesis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [hyperparams, setHyperparams] = useState({});
  const API_URL = process.env.REACT_APP_API_BASE;
  useEffect(() => {
    const stored = localStorage.getItem('preguntas');
    if (stored) {
      setPreguntas(JSON.parse(stored));
    } else {
      setError('❌ No se encontraron preguntas. Vuelve al paso 1.');
    }

    // Check if codes are already generated
    const storedCodigos = localStorage.getItem('codigos');
    if (storedCodigos) {
      setCodigos(JSON.parse(storedCodigos));
    }

    const storedCodigosSinHipotesis = localStorage.getItem('codigos_sin_hipotesis');
    if (storedCodigosSinHipotesis) {
      setCodigosSinHipotesis(JSON.parse(storedCodigosSinHipotesis));
    }
  }, []);

  useEffect(() => {
    const fetchCodigos = async () => {
      if (!session || preguntas.length === 0) return;

      // Only fetch if codes are not already loaded
      const storedCodigos = localStorage.getItem('codigos');
      if (storedCodigos) {
        setCodigos(JSON.parse(storedCodigos));
        return;
      }

      setLoading(true);
      setProgress(0);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      try {
        const response = await fetch(`${API_URL}/generar/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            preguntas: preguntas.join(", "),
            session_id: session.session_id,
            temperature: hyperparams.temperature || 0.7,
            max_tokens: hyperparams.maxTokens || 1000,
            top_p: hyperparams.topP || 1.0,
            frequency_penalty: hyperparams.frequencyPenalty || 0.0,
            presence_penalty: hyperparams.presencePenalty || 0.0
          })
        });

        clearInterval(progressInterval);
        setProgress(100);

        if (response.ok) {
          const json = await response.json();
          const raw = json[0];
          const safeString = raw.replace(/'/g, '"');
          const parsed = JSON.parse(safeString);
          const lista = parsed[0].split(',').map(c => c.trim()).filter(Boolean);

          setCodigos(lista);
          localStorage.setItem('codigos', JSON.stringify(lista));

          // Check if backend also returned codes without hypotheses
          if (json.length > 1 && json[1]) {
            const rawSinHipotesis = json[1];
            const safeStringSinHipotesis = rawSinHipotesis.replace(/'/g, '"');
            const parsedSinHipotesis = JSON.parse(safeStringSinHipotesis);
            const listaSinHipotesis = parsedSinHipotesis[0].split(',').map(c => c.trim()).filter(Boolean);

            setCodigosSinHipotesis(listaSinHipotesis);
            localStorage.setItem('codigos_sin_hipotesis', JSON.stringify(listaSinHipotesis));
          }
        } else {
          setError('❌ Error al generar códigos.');
        }
      } catch (e) {
        console.error(e);
        setError('❌ Error de conexión con el servidor.');
      } finally {
        setLoading(false);
        setTimeout(() => setProgress(0), 1000);
      }
    };

    fetchCodigos();
  }, [preguntas, session]);

  const handleSiguiente = () => navigate("/step3");
  const handleAnterior = () => navigate("/step1");
  const handleRegenerar = () => {
    setCodigos([]);
    setError('');
    // Re-trigger the effect
    setPreguntas([...preguntas]);
  };

  if (!session) return <Alert severity="error">❌ Sesión no iniciada.</Alert>;

  return (
    <Box sx={{ maxWidth: 1000, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        <SmartToyIcon sx={{ mr: 1, fontSize: '2rem' }} />
        Paso 2: Generación de Códigos con IA
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        Basándonos en tus hipótesis, el agente de IA ha generado códigos iniciales para tu análisis cualitativo.
      </Typography>

      <HyperparametersSettings onChange={setHyperparams} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <PsychologyIcon sx={{ mr: 1 }} />
                Hipótesis Definidas
              </Typography>
              <List dense>
                {preguntas.map((p, i) => (
                  <ListItem key={i}>
                    <ListItemText primary={p} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🤖 Códigos Generados
              </Typography>

              {loading && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Generando códigos con IA...
                  </Typography>
                  <LinearProgress variant="determinate" value={progress} />
                </Box>
              )}

              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              {!loading && codigos.length > 0 && (
                <>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Se generaron {codigos.length} códigos basados en tus hipótesis:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {codigos.map((codigo, i) => (
                      <Chip
                        key={i}
                        label={codigo}
                        color="primary"
                        variant="outlined"
                        sx={{ fontSize: '0.9rem' }}
                      />
                    ))}
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleRegenerar}
                    sx={{ mt: 2 }}
                  >
                    🔄 Regenerar Códigos
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
        <Button variant="outlined" onClick={handleAnterior}>
          ⬅ Volver a Subir Archivos
        </Button>
        <Typography variant="body2" color="text.secondary">
          Paso 2 de 4
        </Typography>
        <Button
          variant="contained"
          onClick={handleSiguiente}
          disabled={codigos.length === 0}
        >
          Siguiente: Editar Códigos ➡
        </Button>
      </Box>
    </Box>
  );
}

export default Step2Generar;
