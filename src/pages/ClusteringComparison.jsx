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
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CompareIcon from '@mui/icons-material/Compare';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DownloadIcon from '@mui/icons-material/Download';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

function ClusteringComparison() {
  const { session } = useSession();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const API_URL = process.env.REACT_APP_API_BASE;

  useEffect(() => {
    if (!session) return;
    fetchComparison();
  }, [session]);

  const fetchComparison = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/comparar_familias/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: session.session_id,
          n_clusters: null, // Auto-determine
          method: "kmeans",
          temperature: 0.7,
          max_tokens: 1000,
          top_p: 1.0,
          frequency_penalty: 0.0,
          presence_penalty: 0.0
        })
      });

      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        setError('❌ Error al obtener comparación de familias.');
      }
    } catch (e) {
      console.error(e);
      setError('❌ Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = () => {
    if (!data) return { barData: [], pieData: [] };

    const barData = [
      {
        method: 'Método Tradicional',
        families: data.metodo_tradicional.total_familias,
        codes: data.total_codigos
      },
      {
        method: 'Método con Clustering',
        families: data.metodo_clustering.total_familias,
        codes: data.total_codigos
      }
    ];

    // Prepare pie data for each method
    const pieData = {
      traditional: data.metodo_tradicional.resultado.familias.map((fam, index) => ({
        name: fam.familia,
        value: fam.codigos.length,
        fill: COLORS[index % COLORS.length]
      })),
      clustering: data.metodo_clustering.resultado.familias.map((fam, index) => ({
        name: fam.familia,
        value: fam.codigos.length,
        fill: COLORS[index % COLORS.length]
      }))
    };

    return { barData, pieData };
  };

  const handleExportJSON = () => {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comparacion_clustering_${session.session_id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    let csvContent = 'Método,Familia,Descripción,Códigos,Cantidad Códigos,Información Cluster\n';

    // Add traditional method families
    data.metodo_tradicional.resultado.familias.forEach(fam => {
      csvContent += `"Método Tradicional","${fam.familia}","${fam.descripcion}","${fam.codigos.join('; ')}",${fam.codigos.length},""\n`;
    });

    // Add clustering method families
    data.metodo_clustering.resultado.familias.forEach(fam => {
      const clusterInfo = fam.cluster_id ? `Cluster ${fam.cluster_id}` : '';
      csvContent += `"Método con Clustering","${fam.familia}","${fam.descripcion}","${fam.codigos.join('; ')}",${fam.codigos.length},"${clusterInfo}"\n`;
    });

    // Add summary metrics
    csvContent += '\nMétricas Generales\n';
    csvContent += `Total Códigos,${data.total_codigos}\n`;
    csvContent += `Diferencia Familias,${data.comparacion.diferencia_familias}\n`;
    csvContent += `Embeddings Generados,${data.comparacion.embeddings_generados}\n`;
    csvContent += `Familias Método Tradicional,${data.metodo_tradicional.total_familias}\n`;
    csvContent += `Familias Método Clustering,${data.metodo_clustering.total_familias}\n`;
    csvContent += `Clusters Encontrados,${data.metodo_clustering.clustering_metrics.n_clusters}\n`;
    csvContent += `Score de Silueta,${data.metodo_clustering.clustering_metrics.silhouette_score}\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comparacion_clustering_${session.session_id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportClusterNames = () => {
    let namesContent = `Nombres de Familias Generadas por LLM - Sesión ${session.session_id}\n`;
    namesContent += `Generado: ${new Date().toLocaleString('es-ES')}\n\n`;

    namesContent += `MÉTODO TRADICIONAL (${data.metodo_tradicional.total_familias} familias):\n`;
    data.metodo_tradicional.resultado.familias.forEach((fam, index) => {
      namesContent += `${index + 1}. ${fam.familia}\n`;
      if (fam.descripcion) {
        namesContent += `   Descripción: ${fam.descripcion}\n`;
      }
      namesContent += `   Códigos: ${fam.codigos.length}\n\n`;
    });

    namesContent += `MÉTODO CON CLUSTERING (${data.metodo_clustering.total_familias} familias):\n`;
    data.metodo_clustering.resultado.familias.forEach((fam, index) => {
      namesContent += `${index + 1}. ${fam.familia}`;
      if (fam.cluster_id) {
        namesContent += ` (Cluster ${fam.cluster_id})`;
      }
      namesContent += '\n';
      if (fam.descripcion) {
        namesContent += `   Descripción: ${fam.descripcion}\n`;
      }
      namesContent += `   Códigos: ${fam.codigos.length}\n\n`;
    });

    const blob = new Blob([namesContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nombres_familias_${session.session_id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!session) return <Alert severity="error">❌ Sesión no iniciada.</Alert>;

  const { barData, pieData } = prepareChartData();

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        <CompareIcon sx={{ mr: 1, fontSize: '2rem' }} />
        Comparación de Métodos de Generación de Familias
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        Comparación visual entre el método tradicional (solo LLM) y el método con clustering semántico + LLM.
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Generando comparación...</Typography>
        </Box>
      )}

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {data && !loading && (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    📊 Estadísticas Generales
                  </Typography>
                  <Typography variant="body2">
                    Total de códigos: <strong>{data.total_codigos}</strong>
                  </Typography>
                  <Typography variant="body2">
                    Diferencia en familias: <strong>{data.comparacion.diferencia_familias}</strong>
                  </Typography>
                  <Typography variant="body2">
                    Embeddings generados: <strong>{data.comparacion.embeddings_generados}</strong>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    🤖 Método Tradicional
                  </Typography>
                  <Typography variant="body2">
                    Familias generadas: <strong>{data.metodo_tradicional.total_familias}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {data.metodo_tradicional.descripcion}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    🧠 Método con Clustering
                  </Typography>
                  <Typography variant="body2">
                    Familias generadas: <strong>{data.metodo_clustering.total_familias}</strong>
                  </Typography>
                  <Typography variant="body2">
                    Clusters encontrados: <strong>{data.metodo_clustering.clustering_metrics.n_clusters}</strong>
                  </Typography>
                  <Typography variant="body2">
                    Score de silueta: <strong>{data.metodo_clustering.clustering_metrics.silhouette_score.toFixed(3)}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {data.metodo_clustering.descripcion}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Comparación de Número de Familias
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="method" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="families" fill="#8884d8" name="Número de Familias" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Distribución de Códigos - Método Tradicional
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData.traditional}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.traditional.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Distribución de Códigos - Método con Clustering
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData.clustering}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.clustering.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Detailed Comparison */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    🤖 Familias - Método Tradicional
                  </Typography>
                  {data.metodo_tradicional.resultado.familias.map((familia, index) => (
                    <Accordion key={index} sx={{ mb: 1 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle1">{familia.familia}</Typography>
                        <Chip
                          size="small"
                          label={`${familia.codigos.length} códigos`}
                          sx={{ ml: 1 }}
                        />
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {familia.descripcion}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {familia.codigos.map((codigo, i) => (
                            <Chip
                              key={i}
                              label={codigo}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    🧠 Familias - Método con Clustering
                  </Typography>
                  {data.metodo_clustering.resultado.familias.map((familia, index) => (
                    <Accordion key={index} sx={{ mb: 1 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle1">
                          {familia.familia}
                          {familia.cluster_id && (
                            <Chip
                              size="small"
                              label={`Cluster ${familia.cluster_id}`}
                              variant="outlined"
                              sx={{ ml: 1, fontSize: '0.7rem' }}
                            />
                          )}
                        </Typography>
                        <Chip
                          size="small"
                          label={`${familia.codigos.length} códigos`}
                          sx={{ ml: 1 }}
                        />
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {familia.descripcion}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {familia.codigos.map((codigo, i) => (
                            <Chip
                              key={i}
                              label={codigo}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate("/summary")}>
              ⬅ Volver al Resumen
            </Button>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                onClick={handleExportJSON}
                startIcon={<DownloadIcon />}
                disabled={!data}
              >
                📄 Exportar JSON
              </Button>
              <Button
                variant="outlined"
                onClick={handleExportCSV}
                startIcon={<DownloadIcon />}
                disabled={!data}
              >
                📊 Exportar CSV
              </Button>
              <Button
                variant="outlined"
                onClick={handleExportClusterNames}
                startIcon={<DownloadIcon />}
                disabled={!data}
              >
                📝 Nombres Familias
              </Button>
              <Button
                variant="contained"
                onClick={fetchComparison}
                startIcon={<AnalyticsIcon />}
              >
                🔄 Regenerar Comparación
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}

export default ClusteringComparison;