import React, { useState } from 'react';
import { useSession } from '../context/SessionContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  Alert,
  Card,
  CardContent,
  Grid,
  IconButton,
  LinearProgress
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { processFile, getSupportedFileTypes, getFileTypeDescription, validateFile } from '../utils/fileProcessor';

function Step1Upload() {
  const { session } = useSession();
  const [files, setFiles] = useState([]);
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_BASE;
  if (!session) {
    return <Alert severity="error">❌ Sesión no iniciada. Vuelve al login.</Alert>;
  }

  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Validate files
    const invalidFiles = [];
    selectedFiles.forEach(file => {
      try {
        validateFile(file);
      } catch (error) {
        invalidFiles.push(`${file.name}: ${error.message}`);
      }
    });

    if (invalidFiles.length > 0) {
      setError(`❌ Archivos inválidos:\n${invalidFiles.join('\n')}`);
      return;
    }

    setFiles(selectedFiles);
    setError('');
  };

  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      setTags([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!files.length) {
      setError("❗ Sube al menos un archivo de texto (PDF, DOCX, XLSX, TXT, etc.).");
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Limpiar datos de análisis anterior para nueva sesión
      localStorage.removeItem("codigos");
      localStorage.removeItem("codigos_sin_hipotesis");
      localStorage.removeItem("feedback_history");
      localStorage.removeItem("feedback_round");
      localStorage.removeItem("final_codes");

      // Consolidar archivos localmente
      let contenidoConsolidado = '';
      for (let i = 0; i < files.length; i++) {
        try {
          const text = await processFile(files[i]);
          contenidoConsolidado += `\n\n-- Inicio del archivo ${i + 1}: ${files[i].name} --\n\n${text}\n\n-- Fin del archivo ${i + 1}: ${files[i].name} --\n\n`;
        } catch (error) {
          throw new Error(`Error procesando ${files[i].name}: ${error.message}`);
        }
      }

      // Guardar consolidado en el backend
      const res = await fetch(`${API_URL}/guardar_docs/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: contenidoConsolidado,
          session_id: session.session_id
        })
      });

      if (!res.ok) {
        throw new Error("Error al guardar el consolidado.");
      }

      localStorage.setItem("preguntas", JSON.stringify(tags));

      setSuccessMessage("✅ Consolidado enviado con éxito. Pasando al paso 2...");
      setTimeout(() => navigate("/step2"), 1500);
    } catch (err) {
      setError(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        📌 Paso 1: Subir archivos y definir objetivos
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        Comienza cargando tus documentos de texto y definiendo las hipótesis o objetivos de tu investigación cualitativa.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <UploadFileIcon sx={{ mr: 1 }} />
                Archivos de Documentos
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                Formatos soportados: DOCX, XLSX, XLS, TXT, MD, CSV (máx. 50MB por archivo)
                <br />
                <em>Nota: PDF no disponible temporalmente - convierta a DOCX o TXT</em>
              </Typography>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ marginBottom: 2 }}
              >
                Seleccionar archivos
                <input
                  type="file"
                  accept={getSupportedFileTypes()}
                  multiple
                  hidden
                  onChange={handleFilesChange}
                />
              </Button>
              {files.length > 0 && (
                <Box sx={{
                  maxHeight: 300,
                  overflow: 'auto',
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  mt: 1
                }}>
                  <List dense>
                    {files.map((file, i) => (
                      <ListItem
                        key={i}
                        secondaryAction={
                          <IconButton edge="end" onClick={() => handleRemoveFile(i)} size="small">
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={file.name}
                          secondary={`${getFileTypeDescription(file.name)} • ${(file.size / 1024).toFixed(2)} KB`}
                          primaryTypographyProps={{ variant: 'body2' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🎯 Hipótesis u Objetivos de Investigación (Opcional)
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                Puedes añadir hipótesis u objetivos para guiar la generación de códigos, o dejar vacío para un análisis más abierto.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, marginBottom: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Escribe una hipótesis y presiona Enter o el botón +"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                />
                <Button variant="contained" onClick={handleAddTag} disabled={!inputValue.trim()}>
                  <AddIcon />
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}

      {loading && <LinearProgress sx={{ mt: 2 }} />}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={loading}
        >
          ➡️ Siguiente: Generar Códigos
        </Button>
      </Box>
    </Box>
  );
}

export default Step1Upload;
