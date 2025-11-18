import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Divider,
  Paper,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';

const Survey = () => {
  const [responses, setResponses] = useState({});
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    'Ficha Demográfica',
    'Aceptación y Utilidad',
    'Usabilidad',
    'Esfuerzo y Frustración',
    'Comparación con Tradicionales',
    'Datos Sintéticos',
    'Preguntas Abiertas'
  ];

  const handleChange = (section, question, value) => {
    setResponses({
      ...responses,
      [section]: {
        ...responses[section],
        [question]: value,
      },
    });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = () => {
    const dataStr = JSON.stringify(responses, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `encuesta_qualicode_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    alert('Encuesta enviada. Gracias por tu participación. El archivo se ha descargado automáticamente.');
  };

  const likertOptions = [
    { value: 1, label: '1 = Totalmente en desacuerdo' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5 = Totalmente de acuerdo' },
  ];

  const effortOptions = [
    { value: 1, label: '1 = muy bajo' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5 = muy alto' },
  ];

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                👤 Sección Ficha Demográfica
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Rol principal</InputLabel>
                    <Select
                      value={responses.demografica?.rol || ''}
                      onChange={(e) => handleChange('demografica', 'rol', e.target.value)}
                    >
                      <MenuItem value="investigador">Investigador/a</MenuItem>
                      <MenuItem value="docente">Docente</MenuItem>
                      <MenuItem value="estudiante">Estudiante</MenuItem>
                      <MenuItem value="otro">Otro</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Cargo del investigador"
                    value={responses.demografica?.cargo || ''}
                    onChange={(e) => handleChange('demografica', 'cargo', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Años de experiencia en análisis cualitativo"
                    type="number"
                    value={responses.demografica?.experiencia || ''}
                    onChange={(e) => handleChange('demografica', 'experiencia', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Familiaridad con herramientas tradicionales (NVivo, ATLAS.ti, etc.)"
                    value={responses.demografica?.familiaridad || ''}
                    onChange={(e) => handleChange('demografica', 'familiaridad', e.target.value)}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );
      case 1:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                ✅ Sección A. Aceptación, confianza y utilidad percibida
              </Typography>
              {[
                'La herramienta mejoró mi productividad al realizar la codificación.',
                'Las sugerencias de códigos fueron relevantes y coherentes con los textos.',
                'Sentí que podía mantener el control sobre los resultados generados por la IA.',
                'Las opciones de edición y feedback me permitieron ajustar fácilmente los códigos.',
                'La visualización de agrupaciones y resúmenes fue útil para comprender el análisis.',
                'Siento confianza en los resultados obtenidos con la herramienta.',
                'Recomendaría esta herramienta a otros investigadores cualitativos.',
                'Que tanta similitud hay entre los códigos generador por la herramienta y en el análisis tradicional en la data del proyecto Wise',
              ].map((question, index) => (
                <FormControl component="fieldset" key={index} sx={{ mb: 3, width: '100%' }}>
                  <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'bold' }}>{question}</FormLabel>
                  <RadioGroup
                    row
                    value={responses.A?.[index] || ''}
                    onChange={(e) => handleChange('A', index, e.target.value)}
                  >
                    {likertOptions.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio />}
                        label={option.label}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              ))}
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                🖥️ Sección B. Usabilidad – Escala SUS
              </Typography>
              {[
                'Me gustaría usar esta herramienta con frecuencia.',
                'Me pareció fácil de usar.',
                'Las funciones de la herramienta me parecieron bien integradas.',
                'Imagino que la mayoría de las personas aprenderían a usar esta herramienta rápidamente.',
                'Me sentí muy seguro/a usando la herramienta.',
                'Necesité aprender muchas cosas antes de poder comenzar a usarla.',
              ].map((question, index) => (
                <FormControl component="fieldset" key={index} sx={{ mb: 3, width: '100%' }}>
                  <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'bold' }}>{question}</FormLabel>
                  <RadioGroup
                    row
                    value={responses.B?.[index] || ''}
                    onChange={(e) => handleChange('B', index, e.target.value)}
                  >
                    {likertOptions.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio />}
                        label={option.label}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              ))}
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                🧠 Sección C. Esfuerzo y Frustración
              </Typography>
              {[
                'El esfuerzo mental requerido fue…',
                'La presión de tiempo durante la tarea fue…',
                'Mi nivel de frustración o incomodidad fue…',
              ].map((question, index) => (
                <FormControl component="fieldset" key={index} sx={{ mb: 3, width: '100%' }}>
                  <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'bold' }}>{question}</FormLabel>
                  <RadioGroup
                    row
                    value={responses.C?.[index] || ''}
                    onChange={(e) => handleChange('C', index, e.target.value)}
                  >
                    {effortOptions.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio />}
                        label={option.label}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              ))}
            </CardContent>
          </Card>
        );
      case 4:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                ⚖️ Sección D. Comparación con métodos tradicionales de Evaluación Cualitativa
              </Typography>
              {[
                'Usar esta herramienta fue más rápido que usar NVivo / ATLAS.ti.',
                'La calidad de los códigos generados fue comparable o mejor que la obtenida con NVivo / ATLAS.ti.',
                'La herramienta me permitió concentrarme más en la interpretación que en las tareas técnicas.',
                'En general, considero que esta herramienta complementa o mejora el proceso tradicional.',
              ].map((question, index) => (
                <FormControl component="fieldset" key={index} sx={{ mb: 3, width: '100%' }}>
                  <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'bold' }}>{question}</FormLabel>
                  <RadioGroup
                    row
                    value={responses.D?.[index] || ''}
                    onChange={(e) => handleChange('D', index, e.target.value)}
                  >
                    {likertOptions.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio />}
                        label={option.label}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              ))}
            </CardContent>
          </Card>
        );
      case 5:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                🤖 Sección E. Percepción sobre los datos sintéticos
              </Typography>
              {[
                'Los textos sintéticos fueron comprensibles y coherentes.',
                'No noté diferencias importantes entre textos reales y sintéticos.',
                'Los textos reales me resultaron más ricos o matizados que los sintéticos.',
                'En general, considero que el uso de datos sintéticos es válido para pruebas de codificación cualitativa.',
                'Los códigos generados con la data sintética con el sistema de agentes son similares a los generados por la data real con el sistema de agentes',
                'Los códigos generados con la data sintética con el sistema de agentes son similares a los generados por la data real generado con las herramientas tradicionales de análisis cualitativos',
              ].map((question, index) => (
                <FormControl component="fieldset" key={index} sx={{ mb: 3, width: '100%' }}>
                  <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'bold' }}>{question}</FormLabel>
                  <RadioGroup
                    row
                    value={responses.E?.[index] || ''}
                    onChange={(e) => handleChange('E', index, e.target.value)}
                  >
                    {likertOptions.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio />}
                        label={option.label}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              ))}
            </CardContent>
          </Card>
        );
      case 6:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                💬 Sección F. Preguntas abiertas (respuestas libres)
              </Typography>
              {[
                '¿Qué fue lo más útil o valioso de la herramienta?',
                '¿Qué mejoras o nuevas funciones recomendaría para futuras versiones?',
                '¿Qué opina sobre la calidad de los textos sintéticos frente a los reales?',
                'Comentarios adicionales sobre su experiencia o percepciones generales.',
              ].map((question, index) => (
                <TextField
                  key={index}
                  fullWidth
                  multiline
                  rows={4}
                  label={question}
                  value={responses.F?.[index] || ''}
                  onChange={(e) => handleChange('F', index, e.target.value)}
                  sx={{ mb: 3 }}
                />
              ))}
            </CardContent>
          </Card>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        📊 Encuesta Post-Uso
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        El presente documento tiene como propósito exponer la encuesta post-uso del sistema QualiCode.
        Esta encuesta busca conocer tu experiencia al usar la herramienta de codificación cualitativa asistida por inteligencia artificial.
        Las respuestas son anónimas y se utilizarán únicamente con fines académicos para mejorar el sistema.
        Duración estimada: 8–10 minutos.
        Escala general: 1 = Totalmente en desacuerdo, 5 = Totalmente de acuerdo.
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 2, mb: 2 }}>
        {renderStepContent(activeStep)}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          variant="outlined"
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Anterior
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            sx={{ backgroundColor: '#1976d2' }}
          >
            📤 Enviar Encuesta
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{ backgroundColor: '#1976d2' }}
          >
            Siguiente ➡️
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Survey;