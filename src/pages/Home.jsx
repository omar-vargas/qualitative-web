import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Button, Grid, Box, Chip } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import EditIcon from '@mui/icons-material/Edit';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BookIcon from '@mui/icons-material/Book';
import HelpIcon from '@mui/icons-material/Help';

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Subir Documentos',
      description: 'Carga tus archivos de texto y define hipótesis de investigación para iniciar el análisis cualitativo.',
      icon: <UploadFileIcon fontSize="large" color="primary" />,
      path: '/step1',
      color: '#e3f2fd'
    },
    {
      title: 'Generar Códigos con Agente',
      description: 'Utiliza IA para generar códigos iniciales basados en tus hipótesis y documentos.',
      icon: <SmartToyIcon fontSize="large" color="secondary" />,
      path: '/step2',
      color: '#f3e5f5'
    },
    {
      title: 'Codificar y Editar',
      description: 'Revisa, edita y refina los códigos generados. Proporciona feedback al agente para iteraciones.',
      icon: <EditIcon fontSize="large" color="success" />,
      path: '/step3',
      color: '#e8f5e8'
    },
    {
      title: 'Gestionar Datos',
      description: 'Visualiza y administra tus documentos cargados y códigos aplicados.',
      icon: <BookIcon fontSize="large" color="info" />,
      path: '/data',
      color: '#e0f2f1'
    },
    {
      title: 'Ver Etiquetas y Códigos',
      description: 'Explora los segmentos de texto codificados y gestiona tus códigos.',
      icon: <AssessmentIcon fontSize="large" color="warning" />,
      path: '/label',
      color: '#fff3e0'
    },
    {
      title: 'Tutorial Interactivo',
      description: 'Aprende a usar la aplicación con guías paso a paso.',
      icon: <HelpIcon fontSize="large" color="action" />,
      path: '/tutorial',
      color: '#fce4ec'
    }
  ];

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#1976d2', marginBottom: 4 }}>
        🧪 Evaluación Cualitativa Asistida por Agentes
      </Typography>
      <Typography variant="h6" align="center" sx={{ marginBottom: 4, color: '#555' }}>
        Una herramienta  para análisis cualitativo de datos textuales, potenciada por Agentes
      </Typography>

      <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
        <Chip label="Para Científicos Sociales" color="primary" variant="outlined" sx={{ fontSize: '1rem', padding: 1 }} />
      </Box>

      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: feature.color, borderRadius: 2, boxShadow: 3 }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                {feature.icon}
                <Typography variant="h5" component="div" sx={{ marginTop: 2, fontWeight: 'bold' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                  {feature.description}
                </Typography>
              </CardContent>
              <Box sx={{ padding: 2 }}>
                <Button variant="contained" fullWidth onClick={() => navigate(feature.path)}>
                  Ir a {feature.title}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ marginTop: 6, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ color: '#777' }}>
          Comienza tu análisis cualitativo seleccionando una de las opciones arriba. La aplicación te guía a través de un proceso intuitivo similar al de herramientas profesionales como Atlas Ti.
        </Typography>
      </Box>
    </Box>
  );
}

export default Home;