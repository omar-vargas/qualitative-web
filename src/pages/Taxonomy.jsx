import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  Divider,
} from '@mui/material';
import { useSession } from '../context/SessionContext';
import * as XLSX from 'xlsx';
import DownloadIcon from '@mui/icons-material/Download';

const Taxonomy = () => {
  const { session } = useSession();
  const [familias, setFamilias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const API_URL = process.env.REACT_APP_API_BASE;

  const loadFamilias = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      if (!session || !session.session_id) {
        setError('Sesión inválida. Vuelve a iniciar sesión.');
        setLoading(false);
        return;
      }

      // First get the final codes from session data
      const sessionResponse = await fetch(`${API_URL}/historial/${session.session_id}`);
      if (!sessionResponse.ok) {
        throw new Error('No se pudieron obtener los códigos finales');
      }

      const sessionData = await sessionResponse.json();
      const finalCodes = sessionData.codigos || [];

      if (finalCodes.length === 0) {
        setError('No hay códigos finales disponibles. Complete los pasos anteriores.');
        return;
      }

      // Generate families using the backend
      const familiasResponse = await fetch(`${API_URL}/familias/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          codigos_aprobados: finalCodes,
          temperature: 0.7,
          max_tokens: null,
          top_p: 1.0,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
        }),
      });

      if (!familiasResponse.ok) {
        throw new Error('Error al generar las familias');
      }

      const familiasData = await familiasResponse.json();
      setFamilias(familiasData.familias || []);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error inesperado al generar las familias.'
      );
    } finally {
      setLoading(false);
    }
  }, [session, API_URL]);

  useEffect(() => {
    if (session && session.session_id) {
      loadFamilias();
    }
  }, [session, loadFamilias]);

  const exportToExcel = () => {
    if (familias.length === 0) {
      alert('No hay familias para exportar. Genere la taxonomía primero.');
      return;
    }

    // Prepare data for Excel export
    const excelData = [];

    // Add header
    excelData.push(['Taxonomía de Códigos - QualiCode']);
    excelData.push(['Generado el:', new Date().toLocaleString('es-ES')]);
    excelData.push(['']);
    excelData.push(['Familia', 'Descripción', 'Códigos', 'Cantidad de Códigos']);

    // Add family data
    familias.forEach((familia) => {
      excelData.push([
        familia.familia,
        familia.descripcion || 'Sin descripción',
        (familia.codigos || []).join('; '),
        (familia.codigos || []).length,
      ]);
    });

    // Add summary
    excelData.push(['']);
    excelData.push(['RESUMEN']);
    excelData.push(['Total de Familias:', familias.length]);
    excelData.push([
      'Total de Códigos:',
      familias.reduce(
        (sum, familia) => sum + (familia.codigos ? familia.codigos.length : 0),
        0
      ),
    ]);

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(excelData);

    // Set column widths
    ws['!cols'] = [
      { wch: 30 }, // Familia
      { wch: 50 }, // Descripción
      { wch: 60 }, // Códigos
      { wch: 20 }, // Cantidad
    ];

    // Style the header rows (puede que algunos viewers no respeten estilos)
    if (ws['A1']) ws['A1'].s = { font: { bold: true, sz: 14 } };
    if (ws['A4']) ws['A4'].s = { font: { bold: true }, fill: { fgColor: { rgb: 'E3F2FD' } } };
    if (ws['B4']) ws['B4'].s = { font: { bold: true }, fill: { fgColor: { rgb: 'E3F2FD' } } };
    if (ws['C4']) ws['C4'].s = { font: { bold: true }, fill: { fgColor: { rgb: 'E3F2FD' } } };
    if (ws['D4']) ws['D4'].s = { font: { bold: true }, fill: { fgColor: { rgb: 'E3F2FD' } } };

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Taxonomía');

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `taxonomia_qualicode_${timestamp}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);
  };

  if (!session) {
    return <Alert severity="error">❌ Sesión no iniciada. Vuelve al login.</Alert>;
  }

  return (
    <Box sx={{ maxWidth: 1000, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        🌳 Taxonomía de Códigos
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        Visualización jerárquica de las familias temáticas generadas a partir de los códigos finales.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                Familias Generadas
              </Typography>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress />
                </Box>
              ) : familias.length > 0 ? (
                familias.map((familia) => (
                  <Box key={familia.familia} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                      {familia.familia}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                      {familia.descripcion}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(familia.codigos || []).map((codigo) => (
                        <Chip
                          key={codigo}
                          label={codigo}
                          size="small"
                          sx={{ backgroundColor: '#e3f2fd', color: '#1976d2' }}
                        />
                      ))}
                    </Box>
                    <Divider sx={{ mt: 2 }} />
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No hay familias disponibles. Genere códigos finales primero.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                Grafo de Taxonomía
              </Typography>
              {familias.length > 0 ? (
                <Box
                  sx={{
                    minHeight: 400,
                    padding: 2,
                    backgroundColor: '#f9f9f9',
                    borderRadius: 2,
                    border: '1px solid #e0e0e0',
                  }}
                >
                  {/* Root Node */}
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Box
                      sx={{
                        display: 'inline-block',
                        backgroundColor: '#1976d2',
                        color: 'white',
                        padding: '15px 30px',
                        borderRadius: '50px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                      }}
                    >
                      🌳 Taxonomía
                    </Box>
                  </Box>

                  {/* Families Grid */}
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 3,
                      justifyContent: 'center',
                    }}
                  >
                    {familias.map((familia) => (
                      <Box key={familia.familia} sx={{ flex: '1 1 300px', maxWidth: '400px' }}>
                        {/* Family Header */}
                        <Box
                          sx={{
                            backgroundColor: '#ff9800',
                            color: 'white',
                            padding: 2,
                            borderRadius: '10px 10px 0 0',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          }}
                        >
                          <Typography variant="h6" sx={{ mb: familia.descripcion ? 1 : 0 }}>
                            📁 {familia.familia}
                          </Typography>
                          {familia.descripcion && (
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 'normal',
                                opacity: 0.9,
                                fontSize: '0.875rem',
                              }}
                            >
                              {familia.descripcion}
                            </Typography>
                          )}
                        </Box>

                        {/* Codes Container */}
                        <Box
                          sx={{
                            backgroundColor: 'white',
                            border: '1px solid #e0e0e0',
                            borderRadius: '0 0 10px 10px',
                            padding: 2,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              mb: 2,
                              color: '#666',
                              fontWeight: 'bold',
                            }}
                          >
                            🏷️ Códigos:
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: 1,
                            }}
                          >
                            {(familia.codigos || []).map((codigo) => (
                              <Chip
                                key={codigo}
                                label={codigo}
                                sx={{
                                  backgroundColor: '#4caf50',
                                  color: 'white',
                                  borderRadius: '15px',
                                  fontSize: '0.75rem',
                                  height: 'auto',
                                  padding: '4px 8px',
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    height: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed #e0e0e0',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    El grafo se generará automáticamente cuando haya familias disponibles
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
        <Button
          variant="contained"
          onClick={loadFamilias}
          disabled={loading}
          sx={{ backgroundColor: '#1976d2' }}
        >
          {loading ? <CircularProgress size={20} /> : '🔄'} Regenerar Taxonomía
        </Button>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={exportToExcel}
          disabled={familias.length === 0}
          sx={{ borderColor: '#1976d2', color: '#1976d2' }}
        >
          📊 Exportar a Excel
        </Button>
      </Box>
    </Box>
  );
};

export default Taxonomy;
