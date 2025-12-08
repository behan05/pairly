import {
    Modal,
    Box,
    Typography,
    IconButton,
    Divider,
    Stack
} from '@/MUI/MuiComponents';

import CloseIcon from '@mui/icons-material/Close';
import BadgeIcon from '@mui/icons-material/Badge';
import CategoryIcon from '@mui/icons-material/Category';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import LabelIcon from '@mui/icons-material/Label';

function TicketDetailsModal({ open, onClose, ticket }) {
    if (!ticket) return null;
    
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: {
                        xs: "90%",
                        sm: "450px"
                    },
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 3,
                }}
            >
                {/* Header */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight={600}>
                        Ticket Details
                    </Typography>

                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={2}>

                    {/* ID */}
                    <Box display="flex" alignItems="center" gap={1}>
                        <BadgeIcon color="primary" />
                        <Typography><strong>Ticket Id:</strong> {ticket._id}</Typography>
                    </Box>

                    {/* Full Name */}
                    <Box display="flex" alignItems="center" gap={1}>
                        <PersonIcon color="primary" />
                        <Typography><strong>Name:</strong> {ticket.fullName}</Typography>
                    </Box>

                    {/* Email */}
                    <Box display="flex" alignItems="center" gap={1}>
                        <EmailIcon color="primary" />
                        <Typography><strong>Email:</strong> {ticket.email}</Typography>
                    </Box>

                    {/* Category */}
                    <Box display="flex" alignItems="center" gap={1}>
                        <CategoryIcon color="primary" />
                        <Typography><strong>Category:</strong> {ticket.category}</Typography>
                    </Box>

                    {/* Status */}
                    <Box display="flex" alignItems="center" gap={1}>
                        <LabelIcon color="primary" />
                        <Typography>
                            <strong>Status:</strong>{" "}
                            <span style={{
                                textTransform: "capitalize",
                                color:
                                    ticket.status === "pending" ? "orange" :
                                        ticket.status === "in-progress" ? "blue" :
                                            "green"
                            }}>
                                {ticket.status}
                            </span>
                        </Typography>
                    </Box>

                    {/* Subject */}
                    <Box display="flex" alignItems="center" gap={1}>
                        <MessageIcon color="primary" />
                        <Typography><strong>Subject:</strong> {ticket.subject}</Typography>
                    </Box>

                    {/* Message */}
                    <Box>
                        <Typography fontWeight={600} mb={1}>Message:</Typography>
                        <Typography
                            sx={{
                                p: 1.5,
                                borderRadius: 2,
                                bgcolor: "background.default",
                                fontSize: "0.95rem"
                            }}
                        >
                            {ticket.message}
                        </Typography>
                    </Box>

                </Stack>
            </Box>
        </Modal>
    );
}

export default TicketDetailsModal;
