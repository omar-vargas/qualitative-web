import mammoth from 'mammoth';
import * as XLSX from 'xlsx';

/**
 * Process different file types and extract text content
 * @param {File} file - The file to process
 * @returns {Promise<string>} - Extracted text content
 */
export const processFile = async (file) => {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  try {
    // PDF files - temporarily disabled due to library compatibility issues
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return `[PDF File: ${file.name}]\n\nPDF processing is currently unavailable. Please convert your PDF to DOCX or TXT format for text extraction, or use the file as-is for reference.\n\nTo convert: Use online PDF to DOCX converters or save as text from your PDF reader.`;
    }

    // Word documents
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        fileName.endsWith('.docx')) {
      return await processDOCXFile(file);
    }

    if (fileType === 'application/msword' || fileName.endsWith('.doc')) {
      throw new Error('DOC files are not supported. Please convert to DOCX format.');
    }

    // Excel files
    if (fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        fileType === 'application/vnd.ms-excel' ||
        fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      return await processExcelFile(file);
    }

    // Text files (including .txt)
    if (fileType === 'text/plain' || fileName.endsWith('.txt') ||
        fileType === 'text/markdown' || fileName.endsWith('.md')) {
      return await processTextFile(file);
    }

    // CSV files
    if (fileType === 'text/csv' || fileName.endsWith('.csv')) {
      return await processCSVFile(file);
    }

    // Default to text processing for unknown types
    console.warn(`Unknown file type: ${fileType}, attempting text extraction`);
    return await processTextFile(file);

  } catch (error) {
    console.error(`Error processing file ${file.name}:`, error);
    throw new Error(`Failed to process ${file.name}: ${error.message}`);
  }
};


/**
 * Process DOCX files
 */
const processDOCXFile = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

/**
 * Process Excel files
 */
const processExcelFile = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });

  let content = '';

  // Process each worksheet
  workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    content += `\n\n--- ${sheetName} ---\n\n`;

    sheetData.forEach((row, index) => {
      if (row && row.length > 0) {
        // Convert row array to tab-separated values
        content += row.map(cell => cell || '').join('\t') + '\n';
      }
    });
  });

  return content;
};

/**
 * Process text files
 */
const processTextFile = async (file) => {
  return await file.text();
};

/**
 * Process CSV files
 */
const processCSVFile = async (file) => {
  const text = await file.text();
  // CSV is already text, just return it
  return text;
};

/**
 * Get supported file types for input accept attribute
 */
export const getSupportedFileTypes = () => {
  return '.docx,.xlsx,.xls,.txt,.md,.csv';
};

/**
 * Get file type description
 */
export const getFileTypeDescription = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase();

  const typeMap = {
    'pdf': 'PDF Document (temporarily unavailable)',
    'docx': 'Word Document',
    'doc': 'Word Document (convert to DOCX)',
    'xlsx': 'Excel Spreadsheet',
    'xls': 'Excel Spreadsheet',
    'txt': 'Text File',
    'md': 'Markdown File',
    'csv': 'CSV File'
  };

  return typeMap[extension] || 'Unknown File Type';
};

/**
 * Validate file before processing
 */
export const validateFile = (file) => {
  const maxSize = 50 * 1024 * 1024; // 50MB
  const supportedTypes = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/plain',
    'text/markdown',
    'text/csv'
  ];

  const supportedExtensions = ['.docx', '.doc', '.xlsx', '.xls', '.txt', '.md', '.csv'];

  if (file.size > maxSize) {
    throw new Error(`File ${file.name} is too large. Maximum size is 50MB.`);
  }

  const fileName = file.name.toLowerCase();
  const hasSupportedExtension = supportedExtensions.some(ext => fileName.endsWith(ext));
  const hasSupportedType = supportedTypes.includes(file.type);

  if (!hasSupportedExtension && !hasSupportedType) {
    throw new Error(`File type not supported: ${file.name}. Supported formats: DOCX, XLSX, XLS, TXT, MD, CSV (PDF temporarily unavailable)`);
  }

  return true;
};