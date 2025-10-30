import { useEffect, useState } from "react";
import { Table, TableCell, TableHead, TableRow, TableBody, useMediaQuery, Tooltip, IconButton } from "@mui/material";
import {
  Stack,
  Typography,
  Box,
  Divider,
  useTheme,
  Button
} from "../MUI/MuiComponents";
import DownloadIcon from '@mui/icons-material/Download';
import { useSelector } from "react-redux";
import { alpha } from "@mui/material/styles";
import { toast } from "react-toastify";
import axios from 'axios';
import { RAZORPAY_PAYMENT_API } from '@/api/config';
import { getAuthHeaders } from '@/utils/authHeaders';
import Loading from '../components/common/Loading';
import { Link } from "react-router-dom";

function PaymentHistory() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme => theme.breakpoints.down('sm'));

  const { id: currentUserId, subscription } = useSelector((state) => state?.auth?.user) || {};
  const { plan, status } = subscription || {};
  const isFreeUser = status === 'active' && plan === 'free';
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
      } catch (error) {
        toast.error("Failed to fetch invoices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [currentUserId]);

  return (
    <Box
      sx={{
        height: 'auto',
        mx: "auto",
        backdropFilter: "blur(25px)",
        background: `linear-gradient(135deg,
          ${theme.palette.background.paper}DD 0%,
          ${theme.palette.background.default}CC 100%)`,
        boxShadow: `0 10px 40px ${theme.palette.primary.main}26`,
        filter: `drop-shadow(0 0 1rem ${theme.palette.divider}33)`,
        WebkitFilter: `drop-shadow(0 0 1rem ${theme.palette.divider}33)`,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: -50,
          left: -50,
          width: "150%",
          height: "150%",
          background: `radial-gradient(circle at top left,
            ${theme.palette.primary.main}22,
            transparent 70%)`,
          zIndex: 0,
        },
      }}
    >
      {isFreeUser ? (
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            color: theme.palette.text.secondary,
            py: 4,
            fontStyle: "italic",
          }}
        >
          You’re currently on the <b>Free Plan</b>. Upgrade to unlock premium features 🚀
        </Typography>
      ) : (
        <>
          <Table
            sx={{
              borderRadius: 0.5,
              overflow: "hidden",
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.background.paper}E6 0%, ${theme.palette.background.default}BF 100%)`,
              backdropFilter: "blur(10px)",
              boxShadow: (theme) =>
                `0 8px 24px ${theme.palette.mode === "dark"
                  ? "rgba(0,0,0,0.6)"
                  : "rgba(0,0,0,0.1)"
                }`,
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, fontSize: isSm && '0.6em' }}>#</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: isSm && '0.6em' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: isSm && '0.6em' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: isSm && '0.6em' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: isSm && '0.6em' }}>Invoice</TableCell>
              </TableRow>
            </TableHead>

            {loading ? (
              <Stack
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Loading />
              </Stack>

            ) : (
              <>
                <TableBody>
                  {paymentHistories?.length > 0 ? (
                    paymentHistories.map((inv, index) => (
                      <TableRow
                        key={inv.id}
                        sx={{
                          backdropFilter: "blur(12px)",
                          background: alpha(theme.palette.background.paper, 0.5),
                          transition: "0.2s ease",
                          "&:hover": {
                            background: alpha(theme.palette.primary.main, 0.08),
                            transform: "scale(1.01)",
                          },
                        }}
                      >
                        <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary, fontSize: isSm && '0.6em' }}>
                          {index + 1}
                        </TableCell>

                        <TableCell sx={{ color: theme.palette.text.secondary, fontSize: isSm && '0.6em' }}>
                          {new Date(inv.startDate).toLocaleDateString()}
                        </TableCell>

                        <TableCell sx={{ fontWeight: 600, color: theme.palette.info.main, fontSize: isSm && '0.6em' }}>
                          ₹{inv.amount} {inv.currency}
                        </TableCell>

                        <TableCell
                          sx={{
                            color:
                              inv.status === "paid"
                                ? theme.palette.success.main
                                : theme.palette.warning.main,
                            fontWeight: 600,
                            textTransform: "capitalize",
                            fontSize: isSm && '0.6em'
                          }}
                        >
                          {inv.status}
                        </TableCell>

                        <TableCell>

                          {isSm ? (
                            <Tooltip title='download invoice'>
                              <IconButton onClick={() => toast.info('currently not working')}>
                                <DownloadIcon
                                  fontSize="small"
                                />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Button
                              variant="outlined"
                              size="small"
                              component={'a'}
                              href={inv.invoice_pdf}
                              disabled
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                borderRadius: "10px",
                                fontWeight: 600,
                                textTransform: "none",
                                backdropFilter: "blur(8px)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  background: alpha(theme.palette.primary.main, 0.1),
                                  borderColor: theme.palette.primary.main,
                                  boxShadow: `0 0 8px ${alpha(theme.palette.primary.main, 0.3)}`,
                                },
                              }}
                            >
                              Download
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        align="center"
                        sx={{
                          py: 5,
                          color: theme.palette.text.secondary,
                          backdropFilter: "blur(10px)",
                          background: alpha(theme.palette.background.paper, 0.4),
                          borderRadius: 2,
                        }}
                      >
                        No payment history found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </>
            )}

          </Table>
        </>

      )}
    </Box>
  )
}

export default PaymentHistory;