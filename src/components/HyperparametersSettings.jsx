import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Box,
  Slider,
  FormControlLabel,
  Switch,
  Tooltip,
  IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';

const HyperparametersSettings = ({ onChange, initialValues = {} }) => {
  const [expanded, setExpanded] = useState(false);
  const [values, setValues] = useState({
    temperature: initialValues.temperature || 0.7,
    maxTokens: initialValues.maxTokens || 1000,
    topP: initialValues.topP || 1.0,
    frequencyPenalty: initialValues.frequencyPenalty || 0.0,
    presencePenalty: initialValues.presencePenalty || 0.0,
    numCodes: initialValues.numCodes || undefined,
    ...initialValues
  });

  const handleChange = (field, value) => {
    const newValues = { ...values, [field]: value };
    setValues(newValues);
    if (onChange) {
      onChange(newValues);
    }
  };

  const handleSliderChange = (field) => (event, newValue) => {
    handleChange(field, newValue);
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.type === 'number' ? parseFloat(event.target.value) : event.target.value;
    handleChange(field, value);
  };

  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SettingsIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Configuración Avanzada de IA (Opcional)</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Ajusta los parámetros del modelo de IA para personalizar la generación de respuestas.
          Los valores por defecto son óptimos para la mayoría de los casos.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Temperature */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2">Temperatura</Typography>
              <Tooltip title="Controla la creatividad de las respuestas. Valores bajos (0.1-0.3) para respuestas precisas y consistentes. Valores altos (0.7-1.0) para respuestas más creativas y variadas.">
                <IconButton size="small">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Slider
                value={values.temperature}
                onChange={handleSliderChange('temperature')}
                min={0}
                max={2}
                step={0.1}
                marks={[
                  { value: 0, label: '0' },
                  { value: 0.7, label: '0.7' },
                  { value: 1, label: '1' },
                  { value: 2, label: '2' }
                ]}
                valueLabelDisplay="auto"
                sx={{ flexGrow: 1 }}
              />
              <TextField
                type="number"
                value={values.temperature}
                onChange={handleInputChange('temperature')}
                inputProps={{ min: 0, max: 2, step: 0.1 }}
                size="small"
                sx={{ width: 80 }}
              />
            </Box>
          </Box>

          {/* Max Tokens */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2">Máximo de Tokens</Typography>
              <Tooltip title="Límite máximo de tokens en la respuesta. Más tokens = respuestas más largas. Recomendado: 500-2000.">
                <IconButton size="small">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Slider
                value={values.maxTokens}
                onChange={handleSliderChange('maxTokens')}
                min={100}
                max={4000}
                step={100}
                marks={[
                  { value: 500, label: '500' },
                  { value: 1000, label: '1000' },
                  { value: 2000, label: '2000' },
                  { value: 4000, label: '4000' }
                ]}
                valueLabelDisplay="auto"
                sx={{ flexGrow: 1 }}
              />
              <TextField
                type="number"
                value={values.maxTokens}
                onChange={handleInputChange('maxTokens')}
                inputProps={{ min: 100, max: 4000, step: 100 }}
                size="small"
                sx={{ width: 80 }}
              />
            </Box>
          </Box>

          {/* Top P */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2">Top P (Núcleo)</Typography>
              <Tooltip title="Controla la diversidad considerando solo las palabras más probables. Valores más bajos = respuestas más enfocadas.">
                <IconButton size="small">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Slider
                value={values.topP}
                onChange={handleSliderChange('topP')}
                min={0}
                max={1}
                step={0.1}
                marks={[
                  { value: 0, label: '0' },
                  { value: 0.5, label: '0.5' },
                  { value: 1, label: '1' }
                ]}
                valueLabelDisplay="auto"
                sx={{ flexGrow: 1 }}
              />
              <TextField
                type="number"
                value={values.topP}
                onChange={handleInputChange('topP')}
                inputProps={{ min: 0, max: 1, step: 0.1 }}
                size="small"
                sx={{ width: 80 }}
              />
            </Box>
          </Box>

          {/* Frequency Penalty */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2">Penalización de Frecuencia</Typography>
              <Tooltip title="Reduce la repetición de palabras ya usadas. Valores positivos ayudan a evitar repeticiones.">
                <IconButton size="small">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Slider
                value={values.frequencyPenalty}
                onChange={handleSliderChange('frequencyPenalty')}
                min={-2}
                max={2}
                step={0.1}
                marks={[
                  { value: -2, label: '-2' },
                  { value: 0, label: '0' },
                  { value: 2, label: '2' }
                ]}
                valueLabelDisplay="auto"
                sx={{ flexGrow: 1 }}
              />
              <TextField
                type="number"
                value={values.frequencyPenalty}
                onChange={handleInputChange('frequencyPenalty')}
                inputProps={{ min: -2, max: 2, step: 0.1 }}
                size="small"
                sx={{ width: 80 }}
              />
            </Box>
          </Box>

          {/* Presence Penalty */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2">Penalización de Presencia</Typography>
              <Tooltip title="Reduce la repetición de temas ya mencionados. Valores positivos fomentan la introducción de nuevos temas.">
                <IconButton size="small">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Slider
                value={values.presencePenalty}
                onChange={handleSliderChange('presencePenalty')}
                min={-2}
                max={2}
                step={0.1}
                marks={[
                  { value: -2, label: '-2' },
                  { value: 0, label: '0' },
                  { value: 2, label: '2' }
                ]}
                valueLabelDisplay="auto"
                sx={{ flexGrow: 1 }}
              />
              <TextField
                type="number"
                value={values.presencePenalty}
                onChange={handleInputChange('presencePenalty')}
                inputProps={{ min: -2, max: 2, step: 0.1 }}
                size="small"
                sx={{ width: 80 }}
              />
            </Box>
          </Box>

          {/* Num Codes */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2">Número de Códigos (Opcional)</Typography>
              <Tooltip title="Especifica el número exacto de códigos que debe generar la IA. Si no se especifica, la IA generará la cantidad relevante basada en los datos.">
                <IconButton size="small">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <TextField
              type="number"
              value={values.numCodes || ''}
              onChange={handleInputChange('numCodes')}
              placeholder="Ej: 10"
              inputProps={{ min: 1, max: 50 }}
              size="small"
              sx={{ width: 120 }}
              helperText="Deja vacío para automático"
            />
          </Box>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          💡 Los cambios se aplicarán automáticamente a las próximas solicitudes de IA.
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default HyperparametersSettings;