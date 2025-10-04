import React, { useEffect, useState } from "react";
import { useSession } from "../context/SessionContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
  InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import HyperparametersSettings from '../components/HyperparametersSettings';

const colorMap = ["#00cc66", "#3399ff", "#ff9933", "#cc33cc", "#ff6666"];

const Step3Feedback = () => {
  const { session } = useSession();
  const navigate = useNavigate();

  const [codes, setCodes] = useState([]); // Will be array of {text, source}
  const [codesSinHipotesis, setCodesSinHipotesis] = useState([]);
  const [preguntas, setPreguntas] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [feedbackHistory, setFeedbackHistory] = useState({});
  const [feedbackRound, setFeedbackRound] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [hyperparams, setHyperparams] = useState({});
  const API_URL = process.env.REACT_APP_API_BASE;
  useEffect(() => {
    const storedPreguntas = localStorage.getItem("preguntas");
    const preguntasExist = storedPreguntas && JSON.parse(storedPreguntas).length > 0;

    const stored = localStorage.getItem("codigos");
    if (stored) {
      const parsedCodes = JSON.parse(stored);
      // Convert to objects with correct source based on whether hypotheses were provided
      const codesWithSource = parsedCodes.map(code => ({
        text: code,
        source: preguntasExist ? 'with_hypotheses' : 'without_hypotheses'
      }));
      setCodes(codesWithSource);
    }

    const storedSinHipotesis = localStorage.getItem("codigos_sin_hipotesis");
    if (storedSinHipotesis) {
      setCodesSinHipotesis(JSON.parse(storedSinHipotesis));
    }

    if (storedPreguntas) {
      setPreguntas(JSON.parse(storedPreguntas));
    }

    const hist = localStorage.getItem("feedback_history");
    if (hist) setFeedbackHistory(JSON.parse(hist));

    const round = localStorage.getItem("feedback_round");
    if (round) setFeedbackRound(parseInt(round));
  }, []);

  const handleCodeChange = (index, newValue) => {
    const updatedCodes = [...codes];
    updatedCodes[index] = { ...updatedCodes[index], text: newValue };
    setCodes(updatedCodes);
  };

  const handleAddCode = () => {
    setCodes([...codes, { text: '', source: 'manual' }]);
  };

  const handleRemoveCode = (index) => {
    setCodes(codes.filter((_, i) => i !== index));
  };

  const handleAddCodeFromSource = (codeText, source) => {
    if (!codes.some(c => c.text === codeText)) {
      setCodes([...codes, { text: codeText, source }]);
    }
  };

  const enviarFeedback = async () => {
    if (!feedback.trim()) {
      alert("Por favor, proporciona feedback antes de enviar.");
      return;
    }

    setLoading(true);
    setSuccess('');

    try {
      const payload = {
        aprobado: false,
        nuevos_codigos: codes.map(c => c.text),
        feedback,
        session_id: session.session_id,
        temperature: hyperparams.temperature || 0.7,
        max_tokens: hyperparams.maxTokens || 1000,
        top_p: hyperparams.topP || 1.0,
        frequency_penalty: hyperparams.frequencyPenalty || 0.0,
        presence_penalty: hyperparams.presencePenalty || 0.0
      };

      const response = await fetch(`${API_URL}/validar/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const newCodigosRaw = await response.json();
        const newCodigos = newCodigosRaw
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean);

        // Actualizar feedback round
        const label = `Iteración ${feedbackRound}`;
        const newHistory = {
          ...feedbackHistory,
          [label]: newCodigos,
        };

        setFeedbackHistory(newHistory);
        setFeedbackRound((prev) => prev + 1);
        setFeedback("");

        const allCodes = Array.from(new Set([...codes.map(c => c.text), ...newCodigos])).map(text => ({ text, source: 'ai_feedback' }));
        setCodes(allCodes);

        // Guardar localmente
        localStorage.setItem("codigos", JSON.stringify(allCodes.map(c => c.text)));
        localStorage.setItem("feedback_history", JSON.stringify(newHistory));
        localStorage.setItem("feedback_round", feedbackRound + 1);

        setSuccess("✅ Feedback enviado con éxito. Se han generado nuevos códigos.");
      } else {
        alert("❌ Error en el servidor.");
      }
    } catch (error) {
      console.error(error);
      alert("❌ No se pudo enviar el feedback.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizar = () => {
    localStorage.setItem("final_codes", JSON.stringify(codes.map(c => c.text)));
    navigate("/summary");
  };

  return (
    <Box sx={{ maxWidth: 1000, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        <EditIcon sx={{ mr: 1, fontSize: '2rem' }} />
        Paso 3: Edición y Feedback de Códigos
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        Revisa, edita y refina los códigos generados. Proporciona feedback al agente IA para mejorar los resultados.
      </Typography>

      <HyperparametersSettings onChange={setHyperparams} />

      <Grid container spacing={3}>
        {preguntas.length > 0 ? (
          // Two columns when hypotheses were provided
          <>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>
                    🎯 Códigos con Hipótesis
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Generados considerando tus hipótesis de investigación.
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {codes.map((code, i) => (
                      <Chip
                        key={i}
                        label={code.text}
                        color="primary"
                        variant="outlined"
                        onClick={() => handleAddCodeFromSource(code.text, 'with_hypotheses')}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Haz clic en un código para agregarlo al área de edición
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: '#ff9800' }}>
                    🔍 Códigos sin Hipótesis
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Generados de forma exploratoria sin guía específica.
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {codesSinHipotesis.map((code, i) => (
                      <Chip
                        key={i}
                        label={code}
                        color="warning"
                        variant="outlined"
                        onClick={() => handleAddCodeFromSource(code, 'with_hypotheses')}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Haz clic en un código para agregarlo al área de edición
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    🗂️ Editar Códigos Seleccionados
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Combina códigos de ambas columnas, edítalos o agrega nuevos. Cada código debe ser único y descriptivo.
                  </Typography>
                  <List>
                    {codes.map((code, index) => (
                      <ListItem key={index} sx={{ px: 0, flexDirection: 'column', alignItems: 'stretch' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Chip
                            size="small"
                            label={
                              code.source === 'with_hypotheses' ? 'Con hipótesis' :
                              code.source === 'without_hypotheses' ? 'Sin hipótesis' :
                              'Manual'
                            }
                            color={
                              code.source === 'with_hypotheses' ? 'primary' :
                              code.source === 'without_hypotheses' ? 'warning' :
                              'default'
                            }
                            variant="outlined"
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="caption" sx={{ flexGrow: 1 }}>
                            Origen: {
                              code.source === 'with_hypotheses' ? 'Generado con hipótesis' :
                              code.source === 'without_hypotheses' ? 'Generado sin hipótesis' :
                              'Agregado manualmente'
                            }
                          </Typography>
                        </Box>
                        <TextField
                          fullWidth
                          value={code.text}
                          onChange={(e) => handleCodeChange(index, e.target.value)}
                          placeholder="Escribe un código..."
                          variant="outlined"
                          size="small"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => handleRemoveCode(index)}
                                  color="error"
                                  size="small"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={handleAddCode}
                    variant="outlined"
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    Agregar Código
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </>
        ) : (
          // Single column when no hypotheses were provided
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🗂️ Editar Códigos
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Edita los códigos existentes o agrega nuevos. Cada código debe ser único y descriptivo.
                </Typography>
                <List>
                  {codes.map((code, index) => (
                    <ListItem key={index} sx={{ px: 0, flexDirection: 'column', alignItems: 'stretch' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Chip
                          size="small"
                          label={
                            code.source === 'with_hypotheses' ? 'Con hipótesis' :
                            code.source === 'without_hypotheses' ? 'Sin hipótesis' :
                            code.source === 'ai_feedback' ? 'IA (feedback)' :
                            'Manual'
                          }
                          color={
                            code.source === 'with_hypotheses' ? 'primary' :
                            code.source === 'without_hypotheses' ? 'warning' :
                            code.source === 'ai_feedback' ? 'secondary' :
                            'default'
                          }
                          variant="outlined"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="caption" sx={{ flexGrow: 1 }}>
                          Origen: {
                            code.source === 'with_hypotheses' ? 'Generado con hipótesis' :
                            code.source === 'without_hypotheses' ? 'Generado sin hipótesis' :
                            code.source === 'ai_feedback' ? 'Generado por feedback a IA' :
                            'Agregado manualmente'
                          }
                        </Typography>
                      </Box>
                      <TextField
                        fullWidth
                        value={code.text}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        placeholder="Escribe un código..."
                        variant="outlined"
                        size="small"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => handleRemoveCode(index)}
                                color="error"
                                size="small"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddCode}
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                >
                  Agregar Código
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <FeedbackIcon sx={{ mr: 1 }} />
                Proporcionar Feedback
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                placeholder="Ejemplo: Falta énfasis en temas emocionales, o necesito códigos más específicos sobre metodología..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                variant="outlined"
              />
              <Button
                fullWidth
                variant="contained"
                onClick={enviarFeedback}
                disabled={loading || !feedback.trim()}
                startIcon={<SendIcon />}
                sx={{ mt: 2 }}
              >
                {loading ? 'Enviando...' : 'Enviar Feedback'}
              </Button>
              {loading && <LinearProgress sx={{ mt: 1 }} />}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

      {Object.keys(feedbackHistory).length > 0 && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🎨 Historial de Iteraciones
            </Typography>
            {Object.entries(feedbackHistory).map(([etiqueta, codigos], idx) => (
              <Accordion key={etiqueta} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">{etiqueta}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {codigos.map((tag, i) => (
                      <Chip
                        key={i}
                        label={tag}
                        sx={{
                          backgroundColor: colorMap[idx % colorMap.length],
                          color: 'white'
                        }}
                      />
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>
      )}

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
        <Button variant="outlined" onClick={() => navigate("/step2")}>
          ⬅ Volver a Generar Códigos
        </Button>
        <Typography variant="body2" color="text.secondary">
          Paso 3 de 4
        </Typography>
        <Button
          variant="contained"
          onClick={handleFinalizar}
          startIcon={<CheckCircleIcon />}
          size="large"
        >
          Finalizar y Ver Resumen ➡
        </Button>
      </Box>
    </Box>
  );
};

export default Step3Feedback;
