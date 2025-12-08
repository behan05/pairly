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
} from '@/MUI/MuiComponents';
import NavigateWithArrow from '@/components/private/NavigateWithArrow';
import StyledButton from '../../../../../components/common/StyledButton';
import { SETTINGS_API } from '@/api/config';
import axios from 'axios';
import { getAuthHeaders } from '@/utils/authHeaders';
import TicketDetailsModal from './TicketDetailsModal';

function MyTickets() {
    const [tickets, setTickets] = React.useState([]);
    const [detailsModal, setDetailsModal] = React.useState(null);
    const [openModal, setOpenModal] = React.useState(false);

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

            {/* Table */}
            <TableContainer sx={{ overflowX: 'auto', maxWidth: '100%' }}>

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
                    <Table sx={{ minWidth: 600 }}>
                        <TableHead sx={(theme) => ({ background: theme.palette.divider })}>
                            <TableRow>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>Ticket ID</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Created</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {tickets.map((ticket) => (
                                <TableRow key={ticket._id}>
                                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{ticket._id}</TableCell>
                                    <TableCell>{ticket.category}</TableCell>
                                    <TableCell>
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
                                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                        {new Date(ticket.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <StyledButton
                                            onClick={() => {
                                                setDetailsModal(ticket)
                                                setOpenModal(true)
                                            }}
                                            variant="outlined"
                                            text={'View'}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            <TicketDetailsModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                ticket={detailsModal}
            />
        </Box>
    );
}

export default MyTickets;
