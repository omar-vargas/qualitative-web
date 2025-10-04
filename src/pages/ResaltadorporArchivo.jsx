import React, { useState, useEffect } from "react";
import { useSession } from "../context/SessionContext";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  LinearProgress,
  Paper,
  Pagination,
  Stack
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import CodeIcon from '@mui/icons-material/Code';

// Generate colors for codes dynamically
const generateColorPalette = (codes) => {
  const baseColors = [
    '#e3f2fd', '#f3e5f5', '#e8f5e8', '#fff3e0', '#fce4ec',
    '#f1f8e9', '#e0f2f1', '#f9fbe7', '#efebe9', '#fce8b2'
  ];
  const colorMap = {};
  codes.forEach((code, index) => {
    colorMap[code] = baseColors[index % baseColors.length];
  });
  return colorMap;
};



function ResaltadorPorArchivo() {
  const { session } = useSession();
  const [codedSegments, setCodedSegments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [colorMap, setColorMap] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSegments, setTotalSegments] = useState(0);
  const API_URL = process.env.REACT_APP_API_BASE;
  useEffect(() => {
    if (session) {
      loadCodedSegments();
    }
  }, [session]);

  const loadCodedSegments = async (page = 1) => {
    setLoading(true);
    setError('');

    try {
      // Get approved codes from localStorage
      const finalCodes = localStorage.getItem("final_codes");
      if (!finalCodes) {
        setError('No se encontraron códigos aprobados. Complete el paso 3 primero.');
        return;
      }

      const codes = JSON.parse(finalCodes);

      // Call backend to get coded segments (limited to 50 total)
      const response = await fetch(`${API_URL}:8000/etiquetar/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: session.session_id,
          codigos: codes,
          pagina: page,
          por_pagina: 10  // Show 10 per page for better UX with 50 total
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Error al cargar los segmentos codificados');
      }

      const data = await response.json();
      setCodedSegments(data.segmentos || []);
      setTotalPages(data.paginacion?.total_paginas || 1);
      setTotalSegments(data.paginacion?.total_segmentos || 0);
      setCurrentPage(page);

      // Generate color map for codes
      const uniqueCodes = [...new Set(data.segmentos?.flatMap(s => s.codigos) || [])];
      setColorMap(generateColorPalette(uniqueCodes));

    } catch (err) {
      console.error('Error loading coded segments:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const removeCodeFromSegment = (segmentIndex, codeToRemove) => {
    const updatedSegments = [...codedSegments];
    updatedSegments[segmentIndex].codigos = updatedSegments[segmentIndex].codigos.filter(
      code => code !== codeToRemove
    );
    setCodedSegments(updatedSegments);
  };

  if (!session) {
    return <Alert severity="error">Sesión no iniciada.</Alert>;
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        <CodeIcon sx={{ mr: 1, fontSize: '2rem' }} />
        Etiquetado Automático de Texto
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        Los segmentos de texto han sido automáticamente codificados con los códigos que aprobó.
        Se muestran hasta 50 segmentos representativos para análisis. Puede remover códigos de segmentos específicos si no son relevantes.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={loadCodedSegments}
          disabled={loading}
        >
          Recargar Etiquetado
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading && <LinearProgress sx={{ mb: 3 }} />}

      {!loading && codedSegments.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Segmentos Codificados (máx. 50 • {totalSegments} mostrados • Página {currentPage} de {totalPages})
          </Typography>

          {codedSegments.map((segment, index) => {
            const globalIndex = (currentPage - 1) * 10 + index + 1; // Calculate global segment number
            return (
              <Card key={index} sx={{ mb: 2, boxShadow: 2 }}>
                <CardContent>
                  {/* Segment Text */}
                  <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
                    "{segment.texto}"
                  </Typography>

                  {/* Codes */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {segment.codigos.map((codigo, codeIndex) => (
                      <Chip
                        key={codeIndex}
                        label={codigo}
                        sx={{
                          backgroundColor: colorMap[codigo] || '#e0e0e0',
                          color: '#000',
                          '& .MuiChip-deleteIcon': {
                            color: '#666'
                          }
                        }}
                        onDelete={(e) => {
                          e.stopPropagation();
                          removeCodeFromSegment(index, codigo);
                        }}
                        deleteIcon={<DeleteIcon />}
                      />
                    ))}
                  </Box>

                  {/* Metadata */}
                  <Typography variant="caption" color="text.secondary">
                    Segmento {globalIndex} • {segment.codigos.length} código(s) aplicado(s)
                  </Typography>
                </CardContent>
              </Card>
            );
          })}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Stack spacing={2} sx={{ mt: 4, alignItems: 'center' }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(e, page) => loadCodedSegments(page)}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
              <Typography variant="body2" color="text.secondary">
                {totalSegments} segmentos (máx. 50) • {totalPages} páginas
              </Typography>
            </Stack>
          )}
        </Box>
      )}

      {!loading && codedSegments.length === 0 && !error && (
        <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
          <CodeIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No hay segmentos codificados
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Complete los pasos anteriores para ver el etiquetado automático.
          </Typography>
        </Paper>
      )}
    </Box>
  );
}

export default ResaltadorPorArchivo;
