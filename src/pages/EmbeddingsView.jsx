import React, { useState, useEffect } from 'react';
import { useSession } from '../context/SessionContext';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Alert,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Divider,
  LinearProgress
} from '@mui/material';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';

// Mock data for demonstration
const generateMockEmbeddings = () => {
  const codes = ['uso docente IA', 'resistencia docente', 'beneficios pedagógicos', 'preocupaciones éticas', 'formación docente'];
  const segments = [];

  for (let i = 0; i < 25; i++) {
    segments.push({
      id: i + 1,
      text: `Segmento de texto ${i + 1} sobre el uso de inteligencia artificial en educación...`,
      codes: codes.slice(0, Math.floor(Math.random() * 3) + 1),
      embedding: {
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
        cluster: Math.floor(Math.random() * 3)
      },
      similarity: Math.random()
    });
  }

  return segments;
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`embeddings-tabpanel-${index}`}
      aria-labelledby={`embeddings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function EmbeddingsView() {
  const { session } = useSession();
  const [embeddingsData, setEmbeddingsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSegment, setSelectedSegment] = useState(null);

  useEffect(() => {
    if (session) {
      loadEmbeddingsData();
    }
  }, [session]);

  const loadEmbeddingsData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockData = generateMockEmbeddings();
      setEmbeddingsData(mockData);
      setLoading(false);
    }, 1500);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredSegments = embeddingsData.filter(segment =>
    segment.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    segment.codes.some(code => code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!session) {
    return <Alert severity="error">Sesión no iniciada.</Alert>;
  }

  return (
    <Box sx={{ maxWidth: 1400, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        <ScatterPlotIcon sx={{ mr: 1, fontSize: '2rem' }} />
        Visualización de Embeddings
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        Análisis semántico avanzado de los segmentos codificados basado en embeddings vectoriales.
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="embeddings tabs">
          <Tab label="Mapa de Embeddings" />
          <Tab label="Análisis de Clusters" />
          <Tab label="Búsqueda Semántica" />
          <Tab label="Estadísticas" />
        </Tabs>
      </Box>

      {loading && <LinearProgress sx={{ mb: 3 }} />}

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Mapa 2D de Embeddings
                </Typography>
                <Box
                  sx={{
                    height: 400,
                    backgroundColor: '#f5f5f5',
                    border: '2px dashed #ccc',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                >
                  <Typography variant="h6" color="text.secondary">
                    📊 Visualización Interactiva de Embeddings
                  </Typography>
                  {/* Mock scatter plot points */}
                  {embeddingsData.slice(0, 15).map((segment, index) => (
                    <Box
                      key={segment.id}
                      sx={{
                        position: 'absolute',
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: ['#1976d2', '#dc004e', '#4caf50'][segment.embedding.cluster],
                        left: `${50 + segment.embedding.x}%`,
                        top: `${50 + segment.embedding.y}%`,
                        cursor: 'pointer',
                        '&:hover': { width: 12, height: 12 }
                      }}
                      onClick={() => setSelectedSegment(segment)}
                      title={`Segmento ${segment.id}: ${segment.codes.join(', ')}`}
                    />
                  ))}
                </Box>
                <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label="Cluster 1" sx={{ backgroundColor: '#1976d2', color: 'white' }} />
                  <Chip label="Cluster 2" sx={{ backgroundColor: '#dc004e', color: 'white' }} />
                  <Chip label="Cluster 3" sx={{ backgroundColor: '#4caf50', color: 'white' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Segmento Seleccionado
                </Typography>
                {selectedSegment ? (
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, fontStyle: 'italic' }}>
                      "{selectedSegment.text}"
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                      {selectedSegment.codes.map((code, idx) => (
                        <Chip key={idx} label={code} size="small" color="primary" variant="outlined" />
                      ))}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Cluster: {selectedSegment.embedding.cluster + 1} | Similitud: {(selectedSegment.similarity * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Haz clic en un punto del mapa para ver detalles del segmento.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Distribución por Clusters
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[0, 1, 2].map(cluster => {
                    const count = embeddingsData.filter(s => s.embedding.cluster === cluster).length;
                    const percentage = (count / embeddingsData.length * 100).toFixed(1);
                    return (
                      <Box key={cluster} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: ['#1976d2', '#dc004e', '#4caf50'][cluster]
                          }}
                        />
                        <Typography variant="body2" sx={{ flexGrow: 1 }}>
                          Cluster {cluster + 1}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {count} segmentos ({percentage}%)
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Análisis de Códigos por Cluster
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Cluster 1: Uso docente IA"
                      secondary="Segmentos relacionados con implementación pedagógica"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Cluster 2: Preocupaciones éticas"
                      secondary="Contenido sobre riesgos y consideraciones morales"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Cluster 3: Beneficios pedagógicos"
                      secondary="Ventajas y oportunidades educativas"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Búsqueda Semántica en Embeddings
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <input
                type="text"
                placeholder="Buscar segmentos por contenido o códigos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flexGrow: 1,
                  padding: '8px 12px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
              <Button variant="contained" startIcon={<SearchIcon />}>
                Buscar
              </Button>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {filteredSegments.length} segmentos encontrados
            </Typography>
            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
              {filteredSegments.slice(0, 10).map((segment) => (
                <Paper key={segment.id} sx={{ p: 2, mb: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontStyle: 'italic' }}>
                    "{segment.text}"
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {segment.codes.map((code, idx) => (
                        <Chip key={idx} label={code} size="small" color="primary" variant="outlined" />
                      ))}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Similitud: {(segment.similarity * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Estadísticas Generales
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2">Total de segmentos: {embeddingsData.length}</Typography>
                  <Typography variant="body2">Códigos únicos: 5</Typography>
                  <Typography variant="body2">Clusters identificados: 3</Typography>
                  <Typography variant="body2">Dimensionalidad: 384</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Distribución de Códigos
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {['uso docente IA', 'resistencia docente', 'beneficios pedagógicos', 'preocupaciones éticas', 'formación docente'].map((code, idx) => {
                    const count = embeddingsData.filter(s => s.codes.includes(code)).length;
                    return (
                      <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">{code}</Typography>
                        <Typography variant="body2" color="text.secondary">{count}</Typography>
                      </Box>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Acciones
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button variant="outlined" startIcon={<DownloadIcon />} size="small">
                    Exportar Embeddings
                  </Button>
                  <Button variant="outlined" startIcon={<BubbleChartIcon />} size="small">
                    Generar Reporte
                  </Button>
                  <Button variant="outlined" startIcon={<ScatterPlotIcon />} size="small">
                    Análisis Avanzado
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <Box sx={{ mt: 4, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          🔬 Esta es una demostración de las visualizaciones que se generarían con embeddings reales.
          Incluye mapas 2D, clustering, búsqueda semántica y análisis estadístico.
        </Typography>
      </Box>
    </Box>
  );
}

export default EmbeddingsView;