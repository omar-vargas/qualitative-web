import React from "react";
import '../App.css'
import HomeIcon from '@mui/icons-material/Home';
import DatasetIcon from '@mui/icons-material/Dataset';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import UploadIcon from '@mui/icons-material/Upload';
import EditIcon from '@mui/icons-material/Edit';
import HelpIcon from '@mui/icons-material/Help';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import PollIcon from '@mui/icons-material/Poll';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CompareIcon from '@mui/icons-material/Compare';
import LogoutIcon from '@mui/icons-material/Logout';

export const SidebarData = [
    {
        title: "Inicio",
        icon: <HomeIcon />,
        link: "/home",
        description: "Página principal"
    },
    {
        title: "Subir Archivos",
        icon: <UploadIcon />,
        link: "/step1",
        description: "Cargar documentos y hipótesis"
    },
    {
        title: "Generar Códigos",
        icon: <SmartToyIcon />,
        link: "/step2",
        description: "IA genera códigos iniciales"
    },
    {
        title: "Editar Códigos",
        icon: <EditIcon />,
        link: "/step3",
        description: "Refinar y dar feedback"
    },
    {
        title: "Gestionar Datos",
        icon: <DatasetIcon />,
        link: "/data",
        description: "Ver documentos cargados"
    },
    {
        title: "Etiquetas y Códigos",
        icon: <BookmarkIcon />,
        link: "/label",
        description: "Explorar códigos aplicados"
    },
    {
        title: "Tutorial",
        icon: <HelpIcon />,
        link: "/tutorial",
        description: "Guía de uso"
    },
    {
        title: "Resumen",
        icon: <AssessmentIcon />,
        link: "/summary",
        description: "Resultados finales"
    },
    {
        title: "Embeddings",
        icon: <ScatterPlotIcon />,
        link: "/embeddings",
        description: "Visualización semántica"
    },
    {
        title: "Taxonomía",
        icon: <AccountTreeIcon />,
        link: "/taxonomy",
        description: "Familias de códigos"
    },
    {
        title: "Comparación Clustering",
        icon: <CompareIcon />,
        link: "/clustering-comparison",
        description: "Comparar métodos de familias"
    },
    {
        title: "Encuesta",
        icon: <PollIcon />,
        link: "/survey",
        description: "Evaluación de la herramienta"
    },
    {
        title: "Cerrar Sesión",
        icon: <LogoutIcon />,
        link: "/logout",
        description: "Salir de la aplicación"
    }
];