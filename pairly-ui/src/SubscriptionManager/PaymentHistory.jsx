import { useEffect, useState } from "react";
import { Table, TableCell, TableHead, TableRow, TableBody, useMediaQuery, Tooltip, IconButton } from "@mui/material";
import {
  Stack,
  Typography,
  Box,
  useTheme,
  Button
} from "../MUI/MuiComponents";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from 'axios';
import { RAZORPAY_PAYMENT_API } from '@/api/config';
import { getAuthHeaders } from '@/utils/authHeaders';
import Loading from '../components/common/Loading';

function PaymentHistory() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const { id: currentUserId, subscription } =
    useSelector((state) => state?.auth?.user) || {};

  const { plan, status } = subscription || {};
  const isPremiumUser = status === "active" && plan !== "free";
  const isFreeUser = !isPremiumUser

  const [paymentHistories, setPaymentHistories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId) return;

    const fetchInvoices = async () => {
      try {
        const headers = getAuthHeaders();
        const res = await axios.get(
          `${RAZORPAY_PAYMENT_API}/invoices`,
          { headers }
        );
        setPaymentHistories(res.data.invoices || []);
      } catch (err) {
        toast.error("Failed to load payment history");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [currentUserId]);

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Stack spacing={3} p={3}>
        {/* Header */}
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Payment history
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View and download your past invoices
          </Typography>
        </Box>

        {isFreeUser ? (
          <Typography variant="body2" color="text.secondary">
            You are currently on the <strong>Free plan</strong>. No invoices
            available.
          </Typography>
        ) : loading ? (
          <Stack alignItems="center" py={4}>
            <Loading />
          </Stack>
        ) : (
          <Table size={isSm ? "small" : "medium"}>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Invoice</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paymentHistories.length > 0 ? (
                paymentHistories.map((inv, index) => (
                  <TableRow
                    key={inv.id}
                    hover
                    sx={{
                      "&:last-child td": { borderBottom: 0 },
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>

                    <TableCell>
                      {new Date(inv.startDate).toLocaleDateString()}
                    </TableCell>

                    <TableCell sx={{ fontWeight: 500 }}>
                      ₹{inv.amount} {inv.currency}
                    </TableCell>

                    <TableCell
                      sx={{
                        textTransform: "capitalize",
                        color:
                          inv.status === "paid"
                            ? theme.palette.success.main
                            : theme.palette.text.secondary,
                        fontWeight: 500,
                      }}
                    >
                      {inv.status}
                    </TableCell>

                    <TableCell align="right">
                      {inv.invoice_pdf ? (
                        <Button
                          size="small"
                          variant="outlined"
                          component="a"
                          href={inv.invoice_pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download
                        </Button>
                      ) : (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          —
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No payment history found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Stack>
    </Box>
  );
}


export default PaymentHistory;