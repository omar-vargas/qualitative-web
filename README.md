# Qualitative Web

A React frontend application for qualitative web data analysis. This tool allows uploading files, processing data, generating embeddings, visualizing information, comparing clustering, and managing taxonomies interactively.

## Installation

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository:**

   ```bash
   git clone <REPOSITORY_URL>
   cd qualitative-web
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables (optional):**

   Create a `.env` file in the project root if needed for specific configurations (e.g., backend API URLs).

4. **Start the application in development mode:**

   ```bash
   npm start
   ```

   The application will run at [http://localhost:3000](http://localhost:3000).

### Build for Production

To build the application for production:

```bash
npm run build
```

This creates a `build` folder with optimized files.

## Usage

The application is designed for a step-by-step workflow for qualitative analysis:

1. **Login:** Log in to the application.

2. **Home:** Main page with general navigation.

3. **Step 1 - File Upload (Step1Upload):** Upload data files (supports formats like XLSX, DOCX, etc., thanks to libraries like `xlsx` and `mammoth`).

4. **Step 2 - Generate (Step2Generar):** Process uploaded data to generate embeddings or initial analysis.

5. **Step 3 - Feedback (Step3Feedback):** Provide feedback on generated results.

6. **DataPage:** Visualize and explore processed data.

7. **EmbeddingsView:** Specific view for generated embeddings.

8. **ClusteringComparison:** Compare different clustering algorithms.

9. **Taxonomy:** Manage and visualize data taxonomies.

10. **Survey:** Conduct surveys related to the analysis.

11. **Summary:** Final summary of results.

### Navigation

- Use the sidebar (`Sidebar.js` or `SidebarData.js`) to navigate between sections.
- Configure hyperparameters in `HyperparametersSettings.jsx` as needed.

### Key Dependencies

- **React:** Main framework.
- **Material-UI (@mui/material):** UI components.
- **React Router:** Page navigation.
- **Recharts:** Charts and visualizations.
- **XLSX and Mammoth:** Excel and Word file processing.
- **React Tag Input:** Tag input.

## Available Scripts

- `npm start`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm test`: Runs tests.
- `npm run eject`: Ejects the configuration (irreversible).

## Contributing

1. Fork the project.
2. Create a branch for your feature (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a Pull Request.

## License

This project is under the MIT License. See the LICENSE file for details.

## Support

If you encounter issues, open an issue in the repository or contact the development team.

