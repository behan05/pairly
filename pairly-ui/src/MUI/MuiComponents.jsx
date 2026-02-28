// ───────────────────────────────────────────────────────────
// MUI Components - Centralized Exports
// This file imports commonly used MUI components and re-exports
// them for cleaner, unified access across the app.
// ───────────────────────────────────────────────────────────

import {
  // ─── Layout & Structure ─────────────────────────────────
  AppBar, // Top navigation bar
  Box, // Generic layout container (div replacement)
  Container, // Centers page content with responsive padding
  Drawer, // Sidebar / navigation drawer
  Grid, // Responsive grid layout
  Paper, // Surface background for cards, sections
  Stack, // Vertical/horizontal layout spacing
  Toolbar, // AppBar content wrapper
  Divider, // Section separator
  Pagination,
  PaginationItem,
  Card,

  // ─── Typography & Text ──────────────────────────────────
  Typography, // Headings, paragraphs, and text
  FormLabel, // Label for form groups
  InputLabel, // Label for input fields
  FormHelperText, // Helper/error text below inputs

  // ─── Form Controls ──────────────────────────────────────
  TextField, // Input fields (text, email, password, etc.)
  InputBase, // Low-level custom input field
  InputAdornment, // Icons/text inside input fields
  Button, // Form or action buttons
  Switch, // Toggle switch
  Checkbox, // Checkbox field
  Slider, // Range/slider input
  Select, // Dropdown select
  FormGroup, // Groups of form fields
  FormControl, // Wraps inputs with label, error, etc.
  FormControlLabel, // Label paired with Switch/Checkbox/etc.

  // ─── Dialogs & Alerts ───────────────────────────────────
  Dialog, // Modal dialog
  DialogTitle, // Dialog header
  DialogContent, // Dialog body wrapper
  DialogContentText, // Dialog text block
  DialogActions, // Footer action buttons
  Snackbar, // Toast-style notifications

  // ─── Lists & Menus ──────────────────────────────────────
  List, // Container for list items
  ListItem, // Individual list item
  ListItemButton, // Clickable list item
  ListItemIcon, // Icon inside list item
  ListItemText, // Text label inside list item
  ListItemAvatar, // Avatar inside list item
  Menu, // Context or dropdown menu
  MenuItem, // Option inside a Menu
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  
  // ─── Media & Avatars ────────────────────────────────────
  Avatar, // User profile picture
  Badge, // Badge over icon (e.g., unread count)
  IconButton, // Button with icon only (e.g., close)
  Tooltip, // Hover popover hints
  Chip, // Small pill-style labels
  Fade,

  // ─── Expand/Collapse ────────────────────────────────────
  Accordion, // Collapsible container
  AccordionDetails, // Hidden content inside Accordion
  AccordionSummary, // Visible heading of Accordion

  // ─── Utils & Hooks ──────────────────────────────────────
  CircularProgress, // Loading spinner
  useMediaQuery, // Responsive breakpoint hook
  useTheme, // Access the current MUI theme

  // ─── Popup Model ──────────────────────────────────────
  Modal, // Popup Model

  // ─── Links ──────────────────────────────────────────────
  Link as MuiLink // Styled link from MUI (renamed to avoid conflict)
} from '@mui/material';

// ───────────────────────────────────────────────────────────
// Export all components for use across the app
// ───────────────────────────────────────────────────────────

export {
  // Layout
  AppBar,
  Box,
  Container,
  Drawer,
  Grid,
  Paper,
  Stack,
  Toolbar,
  Divider,

  // Popup Model
  Modal,

  // Typography
  Typography,
  FormLabel,
  InputLabel,
  FormHelperText,

  // Forms
  TextField,
  InputBase,
  InputAdornment,
  Button,
  Switch,
  Checkbox,
  Slider,
  Select,
  FormGroup,
  FormControl,
  FormControlLabel,

  // Dialogs & Alerts
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Pagination,
  PaginationItem,
  Card,

  // Lists & Menus
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Menu,
  MenuItem,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,

  // Media
  Avatar,
  Badge,
  IconButton,
  Tooltip,
  Chip,
  Fade,

  // Expandables
  Accordion,
  AccordionDetails,
  AccordionSummary,

  // Utils & Hooks
  CircularProgress,
  useMediaQuery,
  useTheme,

  // Links
  MuiLink
};
