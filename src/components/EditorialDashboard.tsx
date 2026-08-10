'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  BookOpen,
  Folder,
  Share2,
  Search,
  ExternalLink,
  Clock,
  Sparkles,
  Copy,
  Check,
  Tag,
  Layers,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  LayoutGrid,
  Table as TableIcon,
  Instagram,
  Linkedin,
  Facebook,
  MessageCircle,
  Download,
  FileSpreadsheet,
  FileCode,
  ClipboardCheck,
} from 'lucide-react';
import type { Article } from '@/data/articulos';
import type { Instruccion } from '@/data/instrucciones';
import EditorialHeader from '@/components/EditorialHeader';
import Footer from '@/components/Footer';

interface EditorialDashboardProps {
  articulos: Article[];
  instrucciones: Instruccion[];
}

type SortField = 'createdAt' | 'publishedAt' | 'title' | 'category' | 'status';
type SortOrder = 'asc' | 'desc';

const driveFolderMap: Record<string, string> = {
  'inicio-tratamiento-alineadores-keepsmiling': 'G:\\Mi unidad\\laburo\\Pau\\odonto\\web\\subir\\ortodoncia_invisible\\caso-03',
  'evolucion-alineadores-etapa-inicial': 'G:\\Mi unidad\\laburo\\Pau\\odonto\\web\\subir\\ortodoncia_invisible\\caso-04',
  'evolucion-tratamiento-ortodoncia': 'G:\\Mi unidad\\laburo\\Pau\\odonto\\web\\subir\\ortodoncia_invisible\\caso-01',
  'registro-clinico-ortodoncia-invisible': 'G:\\Mi unidad\\laburo\\Pau\\odonto\\web\\subir\\ortodoncia_invisible\\caso-02',
  'adaptacion-y-cuidado-pediatrico': 'G:\\Mi unidad\\laburo\\Pau\\odonto\\web\\subir\\odontologia_pediatrica\\caso-03',
  'atencion-odontologica-pediatrica': 'G:\\Mi unidad\\laburo\\Pau\\odonto\\web\\subir\\odontologia_pediatrica\\caso-01',
  'aprendizaje-higiene-oral-infancia': 'G:\\Mi unidad\\laburo\\Pau\\odonto\\web\\subir\\odontologia_pediatrica\\caso-02',
  'blanqueamiento-dentario-tecnica-ambulatoria': 'G:\\Mi unidad\\laburo\\Pau\\odonto\\web\\subir\\estetica_dental\\caso-01',
  'resina-mano-alzada-pieza-11': 'G:\\Mi unidad\\laburo\\Pau\\odonto\\web\\subir\\estetica_dental\\caso-02',
  'registro-clinico-estetica-dental-caso-04': 'G:\\Mi unidad\\laburo\\Pau\\odonto\\web\\subir\\estetica_dental\\caso-04',
  'tratamiento-endodontico-necrosis-pulpar': 'G:\\Mi unidad\\laburo\\Pau\\odonto\\web\\subir\\endodoncia\\caso-01',
  'rehabilitacion-sector-anterosuperior': 'G:\\Mi unidad\\laburo\\Pau\\odonto\\web\\subir\\Rehabilitacion\\caso-01',
  'indicaciones-alineadores-keepsmiling': 'G:\\Mi unidad\\laburo\\Pau\\odonto\\web\\subir\\instrucciones\\keep',
};

const statusLabels: Record<string, string> = {
  published: 'Publicado',
  approved: 'Aprobado',
  technical_review: 'Revisión Técnica',
  clinical_review: 'Revisión Clínica',
  draft: 'Borrador',
};

const categoryBadgeColors: Record<string, string> = {
  ortodoncia: 'dashboard__badge--teal',
  'ortodoncia-invisible': 'dashboard__badge--teal',
  pediatria: 'dashboard__badge--amber',
  estetica: 'dashboard__badge--rose',
  endodoncia: 'dashboard__badge--blue',
  rehabilitacion: 'dashboard__badge--purple',
  blanqueamiento: 'dashboard__badge--cyan',
  cirugia: 'dashboard__badge--orange',
};

const ITEMS_PER_PAGE = 6;

// Format real ISO date-time string to Date & Time object
const formatTimestamp = (dateStr?: string) => {
  if (!dateStr) return { date: '-', time: '-' };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return { date: `${parts[2]}/${parts[1]}/${parts[0]}`, time: '09:00 hs' };
    }
    return { date: dateStr, time: '-' };
  }
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');

  return {
    date: `${day}/${month}/${year}`,
    time: `${hours}:${minutes} hs`,
  };
};

export default function EditorialDashboard({ articulos, instrucciones }: EditorialDashboardProps) {
  type TabType = 'inventory' | 'drive' | 'social';
  const [activeTab, setActiveTab] = useState<TabType>('inventory');

  // View mode per tab (cards or table)
  const [viewModeConfig, setViewModeConfig] = useState<Record<TabType, 'grid' | 'table'>>({
    inventory: 'grid',
    drive: 'grid',
    social: 'grid',
  });
  const viewMode = viewModeConfig[activeTab];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sorting state per tab (default: newest creation date first)
  const [sortConfig, setSortConfig] = useState<Record<TabType, { field: SortField; order: SortOrder }>>({
    inventory: { field: 'createdAt', order: 'desc' },
    drive: { field: 'createdAt', order: 'desc' },
    social: { field: 'createdAt', order: 'desc' },
  });

  // Resizing state per tab
  const [colWidths, setColWidths] = useState<Record<TabType, Record<string, number>>>({
    inventory: {},
    drive: {},
    social: {},
  });

  // Export dropdown state
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);

  // Table scroll overflow detection states
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollOverflow = () => {
    const el = tableContainerRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 5);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScrollOverflow();
    window.addEventListener('resize', checkScrollOverflow);
    return () => window.removeEventListener('resize', checkScrollOverflow);
  }, [activeTab, viewMode, currentPage, searchQuery, selectedStatus, selectedCategory, sortConfig]);

  // Close export dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setIsExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Combine items for unified list with real timestamps
  const combinedItems = useMemo(() => {
    const artList = articulos.map(a => ({
      itemType: 'articulo' as const,
      id: a.id,
      slug: a.slug,
      title: a.title,
      category: a.category,
      categoryLabel: a.categoryLabel,
      status: a.status,
      createdAt: a.createdAt || '2026-06-15T09:30:00-03:00',
      publishedAt: a.publishedAt || (a.status === 'published' || a.status === 'approved' ? a.updatedAt : undefined),
      updatedAt: a.updatedAt,
      tags: a.tags,
      excerpt: a.excerpt,
      href: `/articulos/${a.slug}`,
      driveFolder: driveFolderMap[a.slug] || 'Asignada en repositorio',
      sourcePath: a.sourcePath,
      heroImage: a.heroImage?.src,
    }));

    const instList = instrucciones.map(i => ({
      itemType: 'instruccion' as const,
      id: i.id,
      slug: i.slug,
      title: i.title,
      category: i.category,
      categoryLabel: i.categoryLabel,
      status: i.status,
      createdAt: i.createdAt || '2026-06-10T10:00:00-03:00',
      publishedAt: i.publishedAt || (i.status === 'published' || i.status === 'approved' ? i.updatedAt : undefined),
      updatedAt: i.updatedAt,
      tags: i.tags,
      excerpt: i.excerpt,
      href: `/instrucciones/${i.category}/${i.slug}`,
      driveFolder: driveFolderMap[i.slug] || 'Asignada en repositorio',
      sourcePath: i.sourcePath,
      heroImage: i.resourceImage?.src,
    }));

    return [...artList, ...instList];
  }, [articulos, instrucciones]);

  // Statistics
  const stats = useMemo(() => {
    const totalArt = articulos.length;
    const totalInst = instrucciones.length;
    const published = combinedItems.filter(i => i.status === 'published' || i.status === 'approved').length;
    const review = combinedItems.filter(i => i.status === 'technical_review' || i.status === 'clinical_review').length;
    const draft = combinedItems.filter(i => i.status === 'draft').length;
    return { totalArt, totalInst, total: totalArt + totalInst, published, review, draft };
  }, [articulos, instrucciones, combinedItems]);

  // Handle column sort toggle
  const handleSort = (field: SortField) => {
    setSortConfig(prev => {
      const current = prev[activeTab];
      if (current.field === field) {
        return { ...prev, [activeTab]: { field, order: current.order === 'desc' ? 'asc' : 'desc' } };
      }
      return { ...prev, [activeTab]: { field, order: 'desc' } };
    });
  };

  // Filtered and Sorted items (Default: newest creation date first)
  const filteredItems = useMemo(() => {
    const items = combinedItems.filter(item => {
      const matchesSearch =
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.driveFolder.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory || (selectedCategory === 'ortodoncia' && item.category === 'ortodoncia-invisible');

      return matchesSearch && matchesStatus && matchesCategory;
    });

    return items.sort((a, b) => {
      let valA: number | string = 0;
      let valB: number | string = 0;
      const currentSort = sortConfig[activeTab];

      if (currentSort.field === 'createdAt') {
        valA = new Date(a.createdAt).getTime() || 0;
        valB = new Date(b.createdAt).getTime() || 0;
      } else if (currentSort.field === 'publishedAt') {
        valA = new Date(a.publishedAt || 0).getTime() || 0;
        valB = new Date(b.publishedAt || 0).getTime() || 0;
      } else if (currentSort.field === 'title') {
        valA = a.title;
        valB = b.title;
      } else if (currentSort.field === 'category') {
        valA = a.categoryLabel;
        valB = b.categoryLabel;
      } else if (currentSort.field === 'status') {
        valA = statusLabels[a.status] || a.status;
        valB = statusLabels[b.status] || b.status;
      }

      if (typeof valA === 'number' && typeof valB === 'number') {
        return currentSort.order === 'desc' ? valB - valA : valA - valB;
      }
      return currentSort.order === 'desc'
        ? String(valB).localeCompare(String(valA))
        : String(valA).localeCompare(String(valB));
    });
  }, [combinedItems, searchQuery, selectedStatus, selectedCategory, sortConfig, activeTab]);

  // Paginated items
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const scrollTable = (direction: 'left' | 'right') => {
    if (tableContainerRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      tableContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScrollOverflow, 350);
    }
  };

  // Render Chevron Arrow positioned right next to column title with smooth rotation
  const renderSortChevron = (field: SortField) => {
    const currentSort = sortConfig[activeTab];
    const isActive = currentSort.field === field;
    const isUp = isActive && currentSort.order === 'asc';

    return (
      <ChevronDown
        className={`dashboard__sort-chevron ${
          isActive ? 'dashboard__sort-chevron--active' : 'dashboard__sort-chevron--idle'
        } ${isUp ? 'dashboard__sort-chevron--up' : ''}`}
      />
    );
  };

  const handleResizeStart = (e: React.MouseEvent, colId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.pageX;
    const th = (e.target as HTMLElement).closest('th');
    const startWidth = th ? th.getBoundingClientRect().width : (colWidths[activeTab][colId] || 150);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(60, startWidth + (moveEvent.pageX - startX));
      setColWidths(prev => ({
        ...prev,
        [activeTab]: { ...prev[activeTab], [colId]: newWidth }
      }));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const renderTh = (id: string, label: string, sortField?: SortField, center: boolean = false, className: string = '') => {
    const isSortable = !!sortField;
    const isResizing = colWidths[activeTab][id] !== undefined;
    const currentWidth = colWidths[activeTab][id];

    return (
      <th
        key={id}
        onClick={isSortable ? () => handleSort(sortField) : undefined}
        className={`dashboard__th--resizable ${isSortable ? 'dashboard__th--sortable' : ''} ${center ? 'dashboard__th--center' : ''} ${className}`}
        title={isSortable ? `Ordenar por ${label}` : undefined}
        style={isResizing ? { width: currentWidth, minWidth: currentWidth, maxWidth: currentWidth } : undefined}
      >
        <div className={`dashboard__th-content ${center ? 'dashboard__th-content--center' : ''}`}>
          <span>{label}</span>
          {isSortable && renderSortChevron(sortField)}
        </div>
        <div className="dashboard__resizer" onClick={e => e.stopPropagation()} onMouseDown={(e) => handleResizeStart(e, id)} />
      </th>
    );
  };

  // Export handlers (CSV, Excel, Sheets)
  const exportToCSV = () => {
    const headers = ['ID', 'Fecha Creacion', 'Hora Creacion', 'Estado', 'Fecha Aprobacion/Produccion', 'Hora Aprobacion/Produccion', 'Titulo', 'Slug', 'Tipo', 'Categoria', 'Carpeta Drive', 'Ruta JSON', 'URL'];
    const rows = filteredItems.map(item => {
      const cDt = formatTimestamp(item.createdAt);
      const pDt = formatTimestamp(item.publishedAt);
      return [
        `"${item.id}"`,
        `"${cDt.date}"`,
        `"${cDt.time}"`,
        `"${statusLabels[item.status] || item.status}"`,
        `"${pDt.date}"`,
        `"${pDt.time}"`,
        `"${item.title.replace(/"/g, '""')}"`,
        `"${item.slug}"`,
        `"${item.itemType}"`,
        `"${item.categoryLabel}"`,
        `"${item.driveFolder.replace(/"/g, '""')}"`,
        `"${item.sourcePath}"`,
        `"https://paulagualtieri.com${item.href}"`,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `editorial_trazabilidad_${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setIsExportOpen(false);
    triggerExportMessage('¡Archivo CSV descargado con éxito!');
  };

  const exportToExcel = () => {
    const headers = ['ID', 'Fecha Creación', 'Hora Creación', 'Estado', 'Fecha Aprobación', 'Hora Aprobación', 'Título', 'Slug', 'Tipo', 'Categoría', 'Carpeta Drive', 'Ruta JSON', 'URL'];
    const rowsHtml = filteredItems.map(item => {
      const cDt = formatTimestamp(item.createdAt);
      const pDt = formatTimestamp(item.publishedAt);
      return `<tr>
        <td>${item.id}</td>
        <td>${cDt.date}</td>
        <td>${cDt.time}</td>
        <td>${statusLabels[item.status] || item.status}</td>
        <td>${pDt.date}</td>
        <td>${pDt.time}</td>
        <td>${item.title}</td>
        <td>${item.slug}</td>
        <td>${item.itemType}</td>
        <td>${item.categoryLabel}</td>
        <td>${item.driveFolder}</td>
        <td>${item.sourcePath}</td>
        <td>https://paulagualtieri.com${item.href}</td>
      </tr>`;
    }).join('');

    const tableHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="utf-8"/></head><body>
    <table border="1"><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
    <tbody>${rowsHtml}</tbody></table></body></html>`;

    const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `editorial_trazabilidad_${activeTab}_${new Date().toISOString().slice(0, 10)}.xls`;
    link.click();
    URL.revokeObjectURL(url);
    setIsExportOpen(false);
    triggerExportMessage('¡Archivo Excel descargado con éxito!');
  };

  const copyForGoogleSheets = () => {
    const headers = ['ID\tFecha Creación\tHora Creación\tEstado\tFecha Aprobación\tHora Aprobación\tTítulo\tSlug\tTipo\tCategoría\tCarpeta Drive\tRuta JSON\tURL'];
    const rows = filteredItems.map(item => {
      const cDt = formatTimestamp(item.createdAt);
      const pDt = formatTimestamp(item.publishedAt);
      return [
        item.id,
        cDt.date,
        cDt.time,
        statusLabels[item.status] || item.status,
        pDt.date,
        pDt.time,
        item.title,
        item.slug,
        item.itemType,
        item.categoryLabel,
        item.driveFolder,
        item.sourcePath,
        `https://paulagualtieri.com${item.href}`,
      ].join('\t');
    });

    const tsvContent = [headers.join('\t'), ...rows].join('\n');
    navigator.clipboard.writeText(tsvContent);
    setIsExportOpen(false);
    triggerExportMessage('¡Copiado! Pegalo directamente con Ctrl+V en tu planilla de Google Sheets');
  };

  const triggerExportMessage = (msg: string) => {
    setExportMessage(msg);
    setTimeout(() => setExportMessage(null), 3000);
  };

  return (
    <div className="dashboard-page">
      <EditorialHeader showLogout={true} />

      <main className="dashboard">
        <header className="dashboard__header">
          <div className="dashboard__header-badge">
            <Sparkles className="dashboard__header-badge-icon" />
            <span>Panel de Gestión Editorial & Trazabilidad</span>
          </div>

          <h1 className="dashboard__title">Dashboard Editorial</h1>
          <p className="dashboard__subtitle">
            Control en vivo de artículos clínicos, guías para pacientes, sincronización con Google Drive y difusión en Redes Sociales.
          </p>
        </header>

        {/* Export Success Toast Notification */}
        {exportMessage && (
          <div className="dashboard__toast" role="alert">
            <ClipboardCheck className="dashboard__toast-icon" />
            <span>{exportMessage}</span>
          </div>
        )}

        {/* Stats Grid */}
        <section className="dashboard__stats">
          <div className="dashboard__stat-card">
            <div className="dashboard__stat-icon-wrap dashboard__stat-icon-wrap--primary">
              <FileText className="dashboard__stat-icon" />
            </div>
            <div>
              <span className="dashboard__stat-number">{stats.totalArt}</span>
              <span className="dashboard__stat-label">Artículos Clínicos</span>
            </div>
          </div>

          <div className="dashboard__stat-card">
            <div className="dashboard__stat-icon-wrap dashboard__stat-icon-wrap--amber">
              <BookOpen className="dashboard__stat-icon" />
            </div>
            <div>
              <span className="dashboard__stat-number">{stats.totalInst}</span>
              <span className="dashboard__stat-label">Guías de Pacientes</span>
            </div>
          </div>

          <div className="dashboard__stat-card">
            <div className="dashboard__stat-icon-wrap dashboard__stat-icon-wrap--emerald">
              <Clock className="dashboard__stat-icon" />
            </div>
            <div>
              <span className="dashboard__stat-number">{stats.review}</span>
              <span className="dashboard__stat-label">En Revisión Técnica</span>
            </div>
          </div>

          <div className="dashboard__stat-card">
            <div className="dashboard__stat-icon-wrap dashboard__stat-icon-wrap--purple">
              <Folder className="dashboard__stat-icon" />
            </div>
            <div>
              <span className="dashboard__stat-number">{stats.total}</span>
              <span className="dashboard__stat-label">Total de Piezas</span>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <nav className="dashboard__tabs-nav" aria-label="Secciones del Dashboard">
          <button
            onClick={() => { setActiveTab('inventory'); setCurrentPage(1); }}
            className={`dashboard__tab-btn ${activeTab === 'inventory' ? 'dashboard__tab-btn--active' : ''}`}
          >
            <Layers className="dashboard__tab-icon" />
            <span>Inventario & Contenidos</span>
            <span className="dashboard__tab-count">{stats.total}</span>
          </button>

          <button
            onClick={() => { setActiveTab('drive'); setCurrentPage(1); }}
            className={`dashboard__tab-btn ${activeTab === 'drive' ? 'dashboard__tab-btn--active' : ''}`}
          >
            <Folder className="dashboard__tab-icon" />
            <span>Trazabilidad Google Drive</span>
          </button>

          <button
            onClick={() => { setActiveTab('social'); setCurrentPage(1); }}
            className={`dashboard__tab-btn ${activeTab === 'social' ? 'dashboard__tab-btn--active' : ''}`}
          >
            <Share2 className="dashboard__tab-icon" />
            <span>Redes Sociales & Difusión</span>
            <span className="dashboard__tab-badge">Preparado</span>
          </button>
        </nav>

        {/* Filters Bar, Export Dropdown & View Mode Switcher */}
        <div className="dashboard__filters">
          <div className="dashboard__search-wrap">
            <Search className="dashboard__search-icon" />
            <input
              type="text"
              placeholder="Buscar por título, slug, etiqueta o carpeta..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="dashboard__search-input"
            />
            {searchQuery && (
              <button
                className="dashboard__search-clear"
                onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                title="Limpiar búsqueda"
              >
                <X className="dashboard__search-clear-icon" />
              </button>
            )}
          </div>

          <div className="dashboard__filter-controls">
            <div className="dashboard__filter-group">
              <div className="dashboard__select-wrap">
                <select
                  value={selectedStatus}
                  onChange={e => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                  className="dashboard__select"
                >
                  <option value="all">Todos los estados</option>
                  <option value="technical_review">En Revisión Técnica</option>
                  <option value="published">Publicados</option>
                  <option value="approved">Aprobados</option>
                  <option value="draft">Borradores</option>
                </select>
                <ChevronDown className="dashboard__select-chevron" />
              </div>

              <div className="dashboard__select-wrap">
                <select
                  value={selectedCategory}
                  onChange={e => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                  className="dashboard__select"
                >
                  <option value="all">Todas las especialidades</option>
                  <option value="ortodoncia">Ortodoncia Invisible</option>
                  <option value="pediatria">Odontología Pediátrica</option>
                  <option value="estetica">Estética Dental</option>
                  <option value="endodoncia">Endodoncia</option>
                  <option value="rehabilitacion">Rehabilitación Oral</option>
                  <option value="blanqueamiento">Blanqueamiento</option>
                  <option value="cirugia">Cirugía</option>
                </select>
                <ChevronDown className="dashboard__select-chevron" />
              </div>
            </div>

            {/* Export Dropdown Feature Button */}
            <div className="dashboard__export-dropdown-wrap" ref={exportRef}>
              <button
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="dashboard__export-btn"
                title="Exportar datos de la tabla"
              >
                <Download className="dashboard__export-icon" />
                <span>Exportar</span>
              </button>

              {isExportOpen && (
                <div className="dashboard__export-menu">
                  <button onClick={exportToCSV} className="dashboard__export-item">
                    <FileCode className="dashboard__export-item-icon" />
                    <span>Exportar a CSV (.csv)</span>
                  </button>
                  <button onClick={exportToExcel} className="dashboard__export-item">
                    <FileSpreadsheet className="dashboard__export-item-icon" />
                    <span>Exportar a Excel (.xls)</span>
                  </button>
                  <button onClick={copyForGoogleSheets} className="dashboard__export-item">
                    <ClipboardCheck className="dashboard__export-item-icon" />
                    <span>Copiar para Google Sheets</span>
                  </button>
                </div>
              )}
            </div>

            {/* View Mode Toggle Switcher (Cards vs Table) */}
            <div className="dashboard__view-switcher" role="radiogroup" aria-label="Modo de visualización">
              <button
                onClick={() => setViewModeConfig(prev => ({ ...prev, [activeTab]: 'grid' }))}
                className={`dashboard__view-btn ${viewMode === 'grid' ? 'dashboard__view-btn--active' : ''}`}
                title="Vista de Tarjetas (Cards)"
              >
                <LayoutGrid className="dashboard__view-btn-icon" />
                <span>Tarjetas</span>
              </button>
              <button
                onClick={() => setViewModeConfig(prev => ({ ...prev, [activeTab]: 'table' }))}
                className={`dashboard__view-btn ${viewMode === 'table' ? 'dashboard__view-btn--active' : ''}`}
                title="Vista de Tabla"
              >
                <TableIcon className="dashboard__view-btn-icon" />
                <span>Tabla</span>
              </button>
            </div>
          </div>
        </div>

        {/* TAB 1: INVENTARIO DE CONTENIDOS */}
        {activeTab === 'inventory' && (
          <section className="dashboard__section">
            {viewMode === 'grid' ? (
              /* Cards View */
              <div className="dashboard__grid">
                {paginatedItems.map(item => {
                  const cDt = formatTimestamp(item.createdAt);
                  const pDt = formatTimestamp(item.publishedAt);
                  return (
                    <article key={item.id} className="dashboard__item-card">
                      <div className="dashboard__item-header">
                        <span className={`dashboard__badge ${categoryBadgeColors[item.category] || 'dashboard__badge--gray'}`}>
                          {item.categoryLabel}
                        </span>

                        <div className="dashboard__status-wrap">
                          <span className={`dashboard__status-tag dashboard__status-tag--${item.status}`}>
                            {statusLabels[item.status] || item.status}
                          </span>
                          <span className="dashboard__date-label">
                            Subido: {cDt.date} {cDt.time}
                          </span>
                        </div>
                      </div>

                      <h2 className="dashboard__item-title">{item.title}</h2>
                      <p className="dashboard__item-excerpt">{item.excerpt}</p>

                      <div className="dashboard__item-tags">
                        {item.tags.map((t: string) => (
                          <span key={t} className="dashboard__tag">
                            <Tag className="dashboard__tag-icon" />
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="dashboard__item-tracking-box">
                        <div className="dashboard__tracking-row">
                          <span className="dashboard__tracking-label">📅 Creación / Subida:</span>
                          <span className="dashboard__tracking-value">{cDt.date} • {cDt.time}</span>
                        </div>
                        <div className="dashboard__tracking-row">
                          <span className="dashboard__tracking-label">✅ Aprobación / Publicación:</span>
                          <span className="dashboard__tracking-value">
                            {item.publishedAt ? `${pDt.date} • ${pDt.time}` : 'En revisión'}
                          </span>
                        </div>
                      </div>

                      <div className="dashboard__item-footer">
                        <span className="dashboard__item-type">
                          {item.itemType === 'articulo' ? '📄 Artículo clínico' : '📋 Guía de paciente'}
                        </span>
                        <Link href={item.href} className="dashboard__item-link" target="_blank">
                          Ver vista previa
                          <ExternalLink className="dashboard__item-link-icon" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* Table View */
              <div className="dashboard__table-rel-wrap">
                {/* Floating 50% Vertical Height Table Edge Scroll Buttons */}
                {canScrollLeft && (
                  <button
                    onClick={() => scrollTable('left')}
                    className="dashboard__table-edge-scroll-btn dashboard__table-edge-scroll-btn--left"
                    title="Desplazar tabla a la izquierda"
                  >
                    <ChevronLeft className="dashboard__table-edge-icon" />
                  </button>
                )}

                {canScrollRight && (
                  <button
                    onClick={() => scrollTable('right')}
                    className="dashboard__table-edge-scroll-btn dashboard__table-edge-scroll-btn--right"
                    title="Desplazar tabla a la derecha"
                  >
                    <ChevronRight className="dashboard__table-edge-icon" />
                  </button>
                )}

                <div ref={tableContainerRef} onScroll={checkScrollOverflow} className="dashboard__table-container">
                  <table className="dashboard__table">
                    <thead>
                      <tr>
                        {renderTh('col-createdAt', 'Creación / Subida', 'createdAt')}
                        {renderTh('col-title', 'Pieza Editorial', 'title')}
                        {renderTh('col-type', 'Tipo')}
                        {renderTh('col-category', 'Categoría', 'category')}
                        {renderTh('col-publishedAt', 'Estado & Aprobación', 'publishedAt', true)}
                        {renderTh('col-action', 'Acción')}
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedItems.map(item => {
                        const cDt = formatTimestamp(item.createdAt);
                        const pDt = formatTimestamp(item.publishedAt);
                        return (
                          <tr key={item.id}>
                            <td>
                              <div className="dashboard__table-date-wrap">
                                <span className="dashboard__table-date">{cDt.date}</span>
                                <span className="dashboard__table-time">{cDt.time}</span>
                              </div>
                            </td>
                            <td>
                              <Link href={item.href} target="_blank" className="dashboard__table-title-link">
                                <strong>{item.title}</strong>
                                <span className="dashboard__table-slug">{item.slug}</span>
                              </Link>
                            </td>
                            <td>
                              <span className="dashboard__table-type">
                                {item.itemType === 'articulo' ? 'Artículo' : 'Instrucción'}
                              </span>
                            </td>
                            <td>
                              <span className={`dashboard__badge ${categoryBadgeColors[item.category] || 'dashboard__badge--gray'}`}>
                                {item.categoryLabel}
                              </span>
                            </td>
                            <td>
                              <div className="dashboard__status-cell">
                                <span className={`dashboard__status-tag dashboard__status-tag--${item.status}`}>
                                  {statusLabels[item.status] || item.status}
                                </span>
                                <span className="dashboard__table-subdate">
                                  {item.publishedAt ? `${pDt.date} ${pDt.time}` : 'En revisión'}
                                </span>
                              </div>
                            </td>
                            <td>
                              <Link href={item.href} target="_blank" className="dashboard__item-link">
                                Ver vista previa
                                <ExternalLink className="dashboard__item-link-icon" />
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Enhanced Pagination Controls Footer */}
            {totalPages > 1 && (
              <div className="dashboard__pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="dashboard__pagination-btn"
                >
                  <ChevronLeft className="dashboard__pagination-icon" />
                  Anterior
                </button>

                <div className="dashboard__pagination-info">
                  <span>Página</span>
                  <span className="dashboard__page-num">{currentPage}</span>
                  <span>de</span>
                  <span className="dashboard__page-num">{totalPages}</span>
                  <span className="dashboard__page-total">({filteredItems.length} piezas cargadas)</span>
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="dashboard__pagination-btn"
                >
                  Siguiente
                  <ChevronRight className="dashboard__pagination-icon" />
                </button>
              </div>
            )}
          </section>
        )}

        {/* TAB 2: TRAZABILIDAD GOOGLE DRIVE */}
        {activeTab === 'drive' && (
          <section className="dashboard__section">
            {viewMode === 'grid' ? (
              /* Drive Cards View */
              <div className="dashboard__grid">
                {paginatedItems.map(item => {
                  const cDt = formatTimestamp(item.createdAt);
                  return (
                    <article key={item.id} className="dashboard__item-card">
                      <div className="dashboard__item-header">
                        <span className={`dashboard__badge ${categoryBadgeColors[item.category] || 'dashboard__badge--gray'}`}>
                          {item.categoryLabel}
                        </span>
                        <div className="dashboard__status-wrap">
                          <span className={`dashboard__status-tag dashboard__status-tag--${item.status}`}>
                            {statusLabels[item.status] || item.status}
                          </span>
                          <span className="dashboard__date-label">
                            Subido: {cDt.date} {cDt.time}
                          </span>
                        </div>
                      </div>

                      <h2 className="dashboard__item-title">{item.title}</h2>

                      <div className="dashboard__drive-card-box">
                        <span className="dashboard__drive-card-label">Carpeta Origen en Google Drive:</span>
                        <div className="dashboard__drive-code-wrap">
                          <code className="dashboard__drive-code">
                            <Folder className="dashboard__drive-icon" />
                            {item.driveFolder}
                          </code>
                        </div>

                        <span className="dashboard__drive-card-label dashboard__drive-card-label--sub">Ruta de Código (JSON):</span>
                        <div className="dashboard__drive-code-wrap">
                          <code className="dashboard__source-code">{item.sourcePath}</code>
                        </div>
                      </div>

                      <div className="dashboard__item-footer">
                        <span className="dashboard__item-type">
                          {item.itemType === 'articulo' ? '📄 Artículo clínico' : '📋 Guía de paciente'}
                        </span>
                        <Link href={item.href} className="dashboard__item-link" target="_blank">
                          Ver vista previa
                          <ExternalLink className="dashboard__item-link-icon" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* Drive Table View */
              <div className="dashboard__table-rel-wrap">
                {/* Floating 50% Vertical Height Table Edge Scroll Buttons */}
                {canScrollLeft && (
                  <button
                    onClick={() => scrollTable('left')}
                    className="dashboard__table-edge-scroll-btn dashboard__table-edge-scroll-btn--left"
                    title="Desplazar tabla a la izquierda"
                  >
                    <ChevronLeft className="dashboard__table-edge-icon" />
                  </button>
                )}

                {canScrollRight && (
                  <button
                    onClick={() => scrollTable('right')}
                    className="dashboard__table-edge-scroll-btn dashboard__table-edge-scroll-btn--right"
                    title="Desplazar tabla a la derecha"
                  >
                    <ChevronRight className="dashboard__table-edge-icon" />
                  </button>
                )}

                <div ref={tableContainerRef} onScroll={checkScrollOverflow} className="dashboard__table-container">
                  <table className="dashboard__table">
                    <thead>
                      <tr>
                        {renderTh('col-createdAt', 'Creación / Subida', 'createdAt')}
                        {renderTh('col-title', 'Pieza Editorial', 'title')}
                        {renderTh('col-type', 'Tipo')}
                        {renderTh('col-category', 'Categoría', 'category')}
                        {renderTh('col-publishedAt', 'Estado & Aprobación', 'publishedAt', true)}
                        {renderTh('col-drive', 'Carpeta Origen en Google Drive')}
                        {renderTh('col-json', 'Ruta de Código (JSON)')}
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedItems.map(item => {
                        const cDt = formatTimestamp(item.createdAt);
                        const pDt = formatTimestamp(item.publishedAt);
                        return (
                          <tr key={item.id}>
                            <td>
                              <div className="dashboard__table-date-wrap">
                                <span className="dashboard__table-date">{cDt.date}</span>
                                <span className="dashboard__table-time">{cDt.time}</span>
                              </div>
                            </td>
                            <td>
                              <Link href={item.href} target="_blank" className="dashboard__table-title-link">
                                <strong>{item.title}</strong>
                                <span className="dashboard__table-slug">{item.slug}</span>
                              </Link>
                            </td>
                            <td>
                              <span className="dashboard__table-type">
                                {item.itemType === 'articulo' ? 'Artículo' : 'Instrucción'}
                              </span>
                            </td>
                            <td>
                              <span className={`dashboard__badge ${categoryBadgeColors[item.category] || 'dashboard__badge--gray'}`}>
                                {item.categoryLabel}
                              </span>
                            </td>
                            <td>
                              <div className="dashboard__status-cell">
                                <span className={`dashboard__status-tag dashboard__status-tag--${item.status}`}>
                                  {statusLabels[item.status] || item.status}
                                </span>
                                <span className="dashboard__table-subdate">
                                  {item.publishedAt ? `${pDt.date} ${pDt.time}` : 'En revisión'}
                                </span>
                              </div>
                            </td>
                            <td>
                              <code className="dashboard__drive-code">
                                <Folder className="dashboard__drive-icon" />
                                {item.driveFolder}
                              </code>
                            </td>
                            <td>
                              <code className="dashboard__source-code">{item.sourcePath}</code>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Enhanced Pagination Controls Footer */}
            {totalPages > 1 && (
              <div className="dashboard__pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="dashboard__pagination-btn"
                >
                  <ChevronLeft className="dashboard__pagination-icon" />
                  Anterior
                </button>

                <div className="dashboard__pagination-info">
                  <span>Página</span>
                  <span className="dashboard__page-num">{currentPage}</span>
                  <span>de</span>
                  <span className="dashboard__page-num">{totalPages}</span>
                  <span className="dashboard__page-total">({filteredItems.length} piezas cargadas)</span>
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="dashboard__pagination-btn"
                >
                  Siguiente
                  <ChevronRight className="dashboard__pagination-icon" />
                </button>
              </div>
            )}
          </section>
        )}

        {/* TAB 3: REDES SOCIALES & DIFUSIÓN */}
        {activeTab === 'social' && (
          <section className="dashboard__section">
            <div className="dashboard__social-header">
              <div>
                <h2 className="dashboard__social-title">Estrategia y Copys para Redes Sociales</h2>
                <p className="dashboard__social-desc">
                  Generador de adaptaciones para Instagram, LinkedIn, Facebook y WhatsApp.
                </p>
              </div>
            </div>

            {viewMode === 'grid' ? (
              /* Social Cards View */
              <div className="dashboard__social-grid">
                {paginatedItems.map(item => {
                  const cDt = formatTimestamp(item.createdAt);
                  const pDt = formatTimestamp(item.publishedAt);
                  const socialCopy = `✨ ${item.title}\n\n${item.excerpt}\n\n👉 Leé el caso completo en nuestro sitio web: https://paulagualtieri.com${item.href}\n\n#Odontologia #PaulaGualtieri #${item.categoryLabel.replace(/\s+/g, '')} #BuenosAires`;

                  return (
                    <article key={item.id} className="dashboard__social-card">
                      <div className="dashboard__social-card-header">
                        <div>
                          <span className={`dashboard__badge ${categoryBadgeColors[item.category] || 'dashboard__badge--gray'}`}>
                            {item.categoryLabel}
                          </span>
                          <h3 className="dashboard__social-card-title">{item.title}</h3>
                        </div>

                        <div className="dashboard__status-cell">
                          <span className="dashboard__social-card-status">Listo para difusión</span>
                          <span className="dashboard__table-subdate">{item.publishedAt ? `${pDt.date} ${pDt.time}` : `${cDt.date} ${cDt.time}`}</span>
                        </div>
                      </div>

                      {/* Social Network Platforms Target Icons */}
                      <div className="dashboard__social-platforms">
                        <span className="dashboard__platforms-label">Canales de destino:</span>
                        <div className="dashboard__platforms-icons-list">
                          <span className="dashboard__icon-chip dashboard__icon-chip--instagram" title="Instagram">
                            <Instagram className="dashboard__platform-icon" />
                          </span>
                          <span className="dashboard__icon-chip dashboard__icon-chip--linkedin" title="LinkedIn">
                            <Linkedin className="dashboard__platform-icon" />
                          </span>
                          <span className="dashboard__icon-chip dashboard__icon-chip--facebook" title="Facebook">
                            <Facebook className="dashboard__platform-icon" />
                          </span>
                          <span className="dashboard__icon-chip dashboard__icon-chip--whatsapp" title="WhatsApp">
                            <MessageCircle className="dashboard__platform-icon" />
                          </span>
                        </div>
                      </div>

                      {/* Social Text Container with Subtle Icon-Only Floating Copy Button */}
                      <div className="dashboard__social-box">
                        <button
                          onClick={() => copyToClipboard(socialCopy, item.id)}
                          className="dashboard__social-copy-subtle-btn"
                          title={copiedId === item.id ? '¡Copiado al portapapeles!' : 'Copiar texto para redes'}
                        >
                          {copiedId === item.id ? (
                            <Check className="dashboard__social-btn-icon dashboard__social-btn-icon--copied" />
                          ) : (
                            <Copy className="dashboard__social-btn-icon" />
                          )}
                        </button>
                        <pre className="dashboard__social-copy">{socialCopy}</pre>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* Social Table View */
              <div className="dashboard__table-rel-wrap">
                {/* Floating 50% Vertical Height Table Edge Scroll Buttons */}
                {canScrollLeft && (
                  <button
                    onClick={() => scrollTable('left')}
                    className="dashboard__table-edge-scroll-btn dashboard__table-edge-scroll-btn--left"
                    title="Desplazar tabla a la izquierda"
                  >
                    <ChevronLeft className="dashboard__table-edge-icon" />
                  </button>
                )}

                {canScrollRight && (
                  <button
                    onClick={() => scrollTable('right')}
                    className="dashboard__table-edge-scroll-btn dashboard__table-edge-scroll-btn--right"
                    title="Desplazar tabla a la derecha"
                  >
                    <ChevronRight className="dashboard__table-edge-icon" />
                  </button>
                )}

                <div ref={tableContainerRef} onScroll={checkScrollOverflow} className="dashboard__table-container">
                  <table className="dashboard__table">
                    <thead>
                      <tr>
                        {renderTh('col-createdAt', 'Creación / Subida', 'createdAt')}
                        {renderTh('col-title', 'Pieza Editorial', 'title')}
                        {renderTh('col-category', 'Categoría', 'category')}
                        {renderTh('col-canales', 'Canales Destino', undefined, true)}
                        {renderTh('col-texto', 'Texto Sugerido para Redes')}
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedItems.map(item => {
                        const cDt = formatTimestamp(item.createdAt);
                        const socialCopy = `✨ ${item.title}\n\n${item.excerpt}\n\n👉 Leé el caso completo en nuestro sitio web: https://paulagualtieri.com${item.href}\n\n#Odontologia #PaulaGualtieri #${item.categoryLabel.replace(/\s+/g, '')} #BuenosAires`;

                        return (
                          <tr key={item.id}>
                            <td>
                              <div className="dashboard__table-date-wrap">
                                <span className="dashboard__table-date">{cDt.date}</span>
                                <span className="dashboard__table-time">{cDt.time}</span>
                              </div>
                            </td>
                            <td>
                              <Link href={item.href} target="_blank" className="dashboard__table-title-link">
                                <strong>{item.title}</strong>
                                <span className="dashboard__table-slug">{item.slug}</span>
                              </Link>
                            </td>
                            <td>
                              <span className={`dashboard__badge ${categoryBadgeColors[item.category] || 'dashboard__badge--gray'}`}>
                                {item.categoryLabel}
                              </span>
                            </td>
                            <td>
                              <div className="dashboard__platforms-icons-list dashboard__platforms-icons-list--center">
                                <span className="dashboard__icon-chip dashboard__icon-chip--instagram" title="Instagram">
                                  <Instagram className="dashboard__platform-icon" />
                                </span>
                                <span className="dashboard__icon-chip dashboard__icon-chip--linkedin" title="LinkedIn">
                                  <Linkedin className="dashboard__platform-icon" />
                                </span>
                                <span className="dashboard__icon-chip dashboard__icon-chip--facebook" title="Facebook">
                                  <Facebook className="dashboard__platform-icon" />
                                </span>
                                <span className="dashboard__icon-chip dashboard__icon-chip--whatsapp" title="WhatsApp">
                                  <MessageCircle className="dashboard__platform-icon" />
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className="dashboard__social-box dashboard__social-box--table">
                                <button
                                  onClick={() => copyToClipboard(socialCopy, item.id)}
                                  className="dashboard__social-copy-subtle-btn"
                                  title={copiedId === item.id ? '¡Copiado al portapapeles!' : 'Copiar texto para redes'}
                                >
                                  {copiedId === item.id ? (
                                    <Check className="dashboard__social-btn-icon dashboard__social-btn-icon--copied" />
                                  ) : (
                                    <Copy className="dashboard__social-btn-icon" />
                                  )}
                                </button>
                                <pre className="dashboard__social-copy">{socialCopy}</pre>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Enhanced Pagination Controls Footer */}
            {totalPages > 1 && (
              <div className="dashboard__pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="dashboard__pagination-btn"
                >
                  <ChevronLeft className="dashboard__pagination-icon" />
                  Anterior
                </button>

                <div className="dashboard__pagination-info">
                  <span>Página</span>
                  <span className="dashboard__page-num">{currentPage}</span>
                  <span>de</span>
                  <span className="dashboard__page-num">{totalPages}</span>
                  <span className="dashboard__page-total">({filteredItems.length} piezas cargadas)</span>
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="dashboard__pagination-btn"
                >
                  Siguiente
                  <ChevronRight className="dashboard__pagination-icon" />
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
