import { useState } from 'react';

import {
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Typography,
  List as MUIList,
} from '@mui/material';
import { AutoAwesomeMosaic, People, BrandingWatermark, Lan } from '@mui/icons-material';
import { Settings } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import CreatorsTable from '../Components/CreatorsTab';

const drawerWidth = 200;

const userGrowth = [
  { month: 'Jan', brands: 30, creators: 5 },
  { month: 'Feb', brands: 50, creators: 10 },
  { month: 'Mar', brands: 80, creators: 15 },
  { month: 'Apr', brands: 120, creators: 25 },
];

const platformEarnings = [
  { month: 'Jan', earnings: 5000 },
  { month: 'Feb', earnings: 7000 },
  { month: 'Mar', earnings: 4000 },
];

const recentActivity = [
  'Creator John signed up',
  'Creator Alice uploaded content',
  'Brand X purchased a service',
  'New review submitted',
];

export default function AdminDashboard() {
  const [view, setView] = useState('dashboard');

  const menuItems = [
    { text: 'Dashboard', icon: <AutoAwesomeMosaic /> },
    { text: 'Creators', icon: <People /> },
    { text: 'Brands', icon: <BrandingWatermark /> },
    { text: 'Services', icon: <Lan /> },
    { text: 'Settings', icon: <Settings /> },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={() => setView(item.text.toLowerCase())}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {view === 'dashboard' && (
          <>
            <Typography variant="h4" gutterBottom>
              Admin Dashboard
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <Card sx={{ flex: 1 }}>
                <CardContent>
                  <Typography variant="h6">Creators</Typography>
                  <Typography variant="h3">150</Typography>
                </CardContent>
              </Card>

              <Card sx={{ flex: 1 }}>
                <CardContent>
                  <Typography variant="h6">Brands</Typography>
                  <Typography variant="h3">75</Typography>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <Card sx={{ flex: 1 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Brand & Creator Growth
                  </Typography>
                  <LineChart width={400} height={250} data={userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="brands" stroke="#8884d8" />
                    <Line type="monotone" dataKey="creators" stroke="#82ca9d" />
                  </LineChart>
                </CardContent>
              </Card>

              <Card sx={{ flex: 1 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Platform Earnings
                  </Typography>
                  <BarChart width={400} height={250} data={platformEarnings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="earnings" fill="#8884d8" />
                  </BarChart>
                </CardContent>
              </Card>
            </Box>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                <MUIList>
                  {recentActivity.map((activity, idx) => (
                    <ListItem key={idx}>
                      <ListItemText primary={activity} />
                    </ListItem>
                  ))}
                </MUIList>
              </CardContent>
            </Card>
          </>
        )}

        {view === 'creators' && <CreatorsTable />}
      </Box>
    </Box>
  );
}
