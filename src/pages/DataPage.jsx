import React, { useState, useEffect } from 'react';
import { useSession } from '../context/SessionContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DescriptionIcon from '@mui/icons-material/Description';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';

function DataPage() {
  const { session } = useSession();
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [expandedDocument, setExpandedDocument] = useState(null);

  const API_URL = process.env.REACT_APP_API_BASE;

  useEffect(() => {
    if (session) {
      loadSessionData();
    }
  }, [session]);

  const loadSessionData = async () => {
    if (!session) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/historial/${session.session_id}`);
      if (response.ok) {
        const data = await response.json();
        setSessionData(data);
      } else {
        setError('No se encontraron datos para esta sesión.');
      }
    } catch (err) {
      console.error('Error loading session data:', err);
      setError('Error al cargar los datos de la sesión.');
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentSelect = (documentId) => {
    setSelectedDocuments(prev =>
      prev.includes(documentId)
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  const handleSelectAll = () => {
    if (sessionData && sessionData.texto_consolidado) {
      // For now, we only have one consolidated document
      setSelectedDocuments(['consolidated']);
    }
  };

  const handleStartCodeGeneration = () => {
    if (selectedDocuments.length === 0) {
      setError('Por favor selecciona al menos un documento.');
      return;
    }

    // Store selected documents in localStorage for the next steps
    localStorage.setItem('selected_documents', JSON.stringify(selectedDocuments));

    // Navigate to step 2 (code generation)
    navigate('/step2');
  };

  const handleUploadNew = () => {
    navigate('/step1');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDocumentPreview = (content) => {
    if (!content) return 'Sin contenido disponible';
    return content.length > 200 ? content.substring(0, 200) + '...' : content;
  };

  if (!session) {
    return <Alert severity="error">Sesión no iniciada.</Alert>;
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        <DescriptionIcon sx={{ mr: 1, fontSize: '2rem' }} />
        Gestión de Datos
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        Revisa tus documentos subidos y selecciona cuáles usar para generar códigos de análisis cualitativo.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* Session Info */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Información de la Sesión
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip label={`Sesión: ${session.session_id}`} color="primary" />
                <Chip label={`Usuario: ${session.username}`} color="secondary" />
                {sessionData && (
                  <Chip label={`Última actualización: ${formatDate(sessionData.timestamp)}`} variant="outlined" />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Documents List */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Documentos Disponibles
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleSelectAll}
                    disabled={!sessionData?.texto_consolidado}
                  >
                    Seleccionar Todo
                  </Button>
                  <IconButton onClick={loadSessionData} size="small">
                    <RefreshIcon />
                  </IconButton>
                </Box>
              </Box>

              {sessionData?.texto_consolidado ? (
                <List>
                  <ListItem
                    sx={{
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      mb: 1,
                      backgroundColor: selectedDocuments.includes('consolidated') ? '#e3f2fd' : 'transparent'
                    }}
                  >
                    <ListItemIcon>
                      <Checkbox
                        checked={selectedDocuments.includes('consolidated')}
                        onChange={() => handleDocumentSelect('consolidated')}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary="Documento Consolidado"
                      secondary={`Tamaño: ${sessionData.texto_consolidado.length} caracteres • Tipo: Texto procesado`}
                    />
                    <IconButton
                      onClick={() => setExpandedDocument(
                        expandedDocument === 'consolidated' ? null : 'consolidated'
                      )}
                    >
                      <ExpandMoreIcon
                        sx={{
                          transform: expandedDocument === 'consolidated' ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s'
                        }}
                      />
                    </IconButton>
                  </ListItem>

                  {expandedDocument === 'consolidated' && (
                    <Paper sx={{ p: 2, mt: 1, backgroundColor: '#f5f5f5' }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Vista previa del contenido:
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                        {getDocumentPreview(sessionData.texto_consolidado)}
                      </Typography>
                    </Paper>
                  )}
                </List>
              ) : (
                <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
                  <UploadFileIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No hay documentos subidos
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Sube documentos en el Paso 1 para comenzar el análisis.
                  </Typography>
                  <Button variant="contained" onClick={handleUploadNew}>
                    Subir Documentos
                  </Button>
                </Paper>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Actions Panel */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Acciones
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleStartCodeGeneration}
                  disabled={selectedDocuments.length === 0}
                  startIcon={<PlayArrowIcon />}
                  size="large"
                >
                  Generar Códigos
                  {selectedDocuments.length > 0 && ` (${selectedDocuments.length})`}
                </Button>

                <Divider />

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleUploadNew}
                  startIcon={<UploadFileIcon />}
                >
                  Subir Más Documentos
                </Button>

                <Button
                  variant="text"
                  fullWidth
                  onClick={() => navigate('/step2')}
                  disabled={!sessionData?.texto_consolidado}
                >
                  Continuar con Datos Existentes
                </Button>
              </Box>

              {selectedDocuments.length > 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  {selectedDocuments.length} documento(s) seleccionado(s) para análisis.
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Session Statistics */}
          {sessionData && (
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Estadísticas de la Sesión
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2">
                    <strong>Códigos generados:</strong> {sessionData.codigos?.length || 0}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Feedback aplicado:</strong> {sessionData.feedback ? 'Sí' : 'No'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Hipótesis definidas:</strong> {sessionData.preguntas?.length || 0}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default DataPage;
