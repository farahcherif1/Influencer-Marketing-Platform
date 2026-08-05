import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Select,
  MenuItem,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
  Fade,
  Grid,
  Divider,
  useTheme,
} from '@mui/material';

export default function EarningsPage() {
  const theme = useTheme();
  const [earningsFilter, setEarningsFilter] = useState('all');
  const [year, setYear] = useState('2025');
  const [month, setMonth] = useState('all');

  const earningsData = [
    {
      date: 'Aug. 10, 2025',
      details: 'Lus - 2 Instagram Lives (30 Minutes)',
      status: 'Payout Aug. 11',
      amount: '$42.50',
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        minHeight: '100vh',
      }}
    >
      <Paper
        sx={{
          p: 4,
          mx: 'auto',
          mt: 8,
          elevation: 0,
        }}
      >
        {/* Header Section */}
        <Fade in timeout={800}>
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Earnings
            </Typography>
          </Box>
        </Fade>

        {/* Summary Cards */}
        <Fade in timeout={1000}>
          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card
                elevation={8}
                sx={{
                  px: 6,
                  py: 4,
                  borderRadius: '12px',
                  height: '100%',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    mb: 1,
                  }}
                >
                  Total Earned (2025)
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    background: `linear-gradient(to right, ${theme.palette.secondary.dark}, ${theme.palette.secondary.light}, ${theme.palette.primary.dark})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  $0.00
                </Typography>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Card
                elevation={8}
                sx={{
                  px: 6,
                  py: 4,
                  borderRadius: '12px',
                  height: '100%',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    mb: 1,
                  }}
                >
                  Total Pending (2025)
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    background: `linear-gradient(to right, ${theme.palette.secondary.dark}, ${theme.palette.secondary.light}, ${theme.palette.primary.dark})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  $42.50
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Fade>

        {/* Filters Section */}
        <Fade in timeout={1200}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <Select
                  value={earningsFilter}
                  onChange={(e) => setEarningsFilter(e.target.value)}
                  sx={{
                    bgcolor: 'white',
                    borderRadius: '8px',
                  }}
                >
                  <MenuItem value="all">All Earnings</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  sx={{
                    bgcolor: 'white',
                    borderRadius: '8px',
                  }}
                >
                  <MenuItem value="2025">2025</MenuItem>
                  <MenuItem value="2024">2024</MenuItem>
                  <MenuItem value="2023">2023</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <Select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  sx={{
                    bgcolor: 'white',
                    borderRadius: '8px',
                  }}
                >
                  <MenuItem value="all">All Months</MenuItem>
                  <MenuItem value="jan">January</MenuItem>
                  <MenuItem value="feb">February</MenuItem>
                  <MenuItem value="mar">March</MenuItem>
                  <MenuItem value="apr">April</MenuItem>
                  <MenuItem value="may">May</MenuItem>
                  <MenuItem value="jun">June</MenuItem>
                  <MenuItem value="jul">July</MenuItem>
                  <MenuItem value="aug">August</MenuItem>
                  <MenuItem value="sep">September</MenuItem>
                  <MenuItem value="oct">October</MenuItem>
                  <MenuItem value="nov">November</MenuItem>
                  <MenuItem value="dec">December</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Fade>

        {/* Earnings Table */}
        <Fade in timeout={1400}>
          <Box>
            <Divider sx={{ mb: 2 }} />

            <Card elevation={2} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Details</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        Amount
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {earningsData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2">{row.date}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{row.details}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.status}
                            size="small"
                            sx={{
                              bgcolor: '#ffe4cc',
                              color: '#663c00',
                              fontWeight: 500,
                              borderRadius: '8px',
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {row.amount}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Box>
        </Fade>
      </Paper>
    </Box>
  );
}
