import * as React from 'react';
import {
    Box,
    Typography,
    Stack,
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableBody,
    Chip,
    useTheme,
    useMediaQuery
} from '@/MUI/MuiComponents';
import {
    InfoIcon
} from '@/MUI/MuiIcons';
import NavigateWithArrow from '@/components/private/NavigateWithArrow';
import StyledButton from '@/components/common/StyledButton';
import { SETTINGS_API } from '@/api/config';
import axios from 'axios';
import { getAuthHeaders } from '@/utils/authHeaders';
import TicketDetailsModal from './TicketDetailsModal';

function MyTickets() {
    const [tickets, setTickets] = React.useState([]);
    const [detailsModal, setDetailsModal] = React.useState(null);
    const [openModal, setOpenModal] = React.useState(false);
    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.down('md'));

    React.useEffect(() => {
        document.title = 'Pairly - My Tickets';
    }, []);

    React.useEffect(() => {
        const fetchTickets = async () => {
            try {
                const headers = getAuthHeaders();
                const response = await axios.get(`${SETTINGS_API}/contact-support`, { headers });

                if (response.data?.tickets) {
                    setTickets(response.data?.tickets);
                }
            } catch (error) {
                toast.error(error.response?.data?.error || 'Something went wrong.');
            }
        };

        fetchTickets();
    }, []);


    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            overflowX: 'hidden'
        }}>
            <Stack mb={2}>
                <NavigateWithArrow redirectTo="/pairly/settings/help" text="My Tickets" />
            </Stack>

            <Stack
                my={2}
            >
                <Typography variant="body2" color="text.secondary">
                    Track your submitted support tickets. You’ll be notified when an update is available.
                </Typography>
            </Stack>

            {/* If no tickets */}
            {tickets.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary" fontWeight={500}>
                        No tickets found
                    </Typography>
                    <Typography variant="body2" color="text.disabled">
                        You haven't created any support tickets yet.
                    </Typography>
                </Box>
            ) : (
                <>
                    {/* MOBILE VIEW → CARD LIST */}
                    {isMd ? (
                        <Stack
                            gap={2}
                            flexWrap={'wrap'}
                            direction='row'
                            justifyContent='center'
                            mt={2}
                            sx={{
                                border: `1px dashed ${theme.palette.divider}`,
                                p: 1,
                                borderRadius: 1
                            }}
                        >
                            {
                                tickets.map((ticket) => (
                                    <Box
                                        key={ticket._id}
                                        sx={{
                                            p: 2,
                                            borderRadius: 0.5,
                                            border: "1px solid",
                                            borderColor: "divider",
                                            background: "background.paper",
                                            minWidth: 280
                                        }}
                                    >
                                        <Typography fontWeight={600} mb={1}>
                                            {ticket.category}
                                        </Typography>

                                        <Chip
                                            label={ticket.status}
                                            color={
                                                ticket.status === "pending"
                                                    ? "warning"
                                                    : ticket.status === "in-progress"
                                                        ? "info"
                                                        : "success"
                                            }
                                            size="small"
                                            sx={{ mb: 1 }}
                                        />

                                        <Typography variant="body2" color="text.secondary" mb={1}>
                                            Created: {new Date(ticket.createdAt).toLocaleDateString()}
                                        </Typography>

                                        <StyledButton
                                            onClick={() => {
                                                setDetailsModal(ticket);
                                                setOpenModal(true);
                                            }}
                                            variant="outlined"
                                            text="View"
                                            fullWidth
                                        />
                                    </Box>
                                ))
                            }
                        </Stack>
                    ) : (
                        /* DESKTOP VIEW → TABLE */
                        <TableContainer
                            sx={{
                                overflowX: "auto",
                                maxWidth: "100%",
                                borderRadius: 2,
                                boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
                            }}
                        >
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow
                                        sx={{
                                            background: theme.palette.action.hover,
                                        }}
                                    >
                                        <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {tickets.map((ticket, index) => (
                                        <TableRow
                                            key={ticket._id}
                                            sx={{
                                                "&:nth-of-type(odd)": {
                                                    backgroundColor: theme.palette.action.hover,
                                                },
                                                "&:hover": {
                                                    backgroundColor: theme.palette.action.selected,
                                                    cursor: "pointer",
                                                },
                                                transition: "0.2s ease",
                                            }}
                                        >
                                            <TableCell sx={{ py: 2, fontWeight: 500 }}>
                                                {ticket.category}
                                            </TableCell>

                                            <TableCell sx={{ py: 2 }}>
                                                <Chip
                                                    label={ticket.status}
                                                    color={
                                                        ticket.status === "pending"
                                                            ? "warning"
                                                            : ticket.status === "in-progress"
                                                                ? "info"
                                                                : "success"
                                                    }
                                                    size="small"
                                                />
                                            </TableCell>

                                            <TableCell sx={{ whiteSpace: "nowrap", py: 2 }}>
                                                {new Date(ticket.createdAt).toLocaleDateString()}
                                            </TableCell>

                                            <TableCell sx={{ py: 2 }}>
                                                <StyledButton
                                                    onClick={() => {
                                                        setDetailsModal(ticket);
                                                        setOpenModal(true);
                                                    }}
                                                    variant="outlined"
                                                    text="View"
                                                    sx={{
                                                        p: 0.5
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                    )}
                </>
            )
            }

            <TicketDetailsModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                ticket={detailsModal}
            />
        </Box >
    );

}

export default MyTickets;
