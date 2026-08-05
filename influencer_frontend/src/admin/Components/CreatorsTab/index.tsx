import { useState } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

type Analytics = {
  platform: string;
  followers: number;
  avgViews: number;
  engagement: string;
};

type Creator = {
  id: number;
  name: string;
  email: string;
  title: string;
  description: string;
  city: string;
  country: string;
  age: number;
  gender: string;
  ethnicity: string;
  starRating: number;
  packages: string[];
  services: string[];
  portfolio: string[];
  categories: string[];
  analytics: Analytics[];
};

type ModalContent = {
  title: string;
  content: string | string[] | Analytics[] | null;
};

// Dummy creators data based on your Creator entity
const creators = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    title: 'Lifestyle Creator',
    description: 'Sharing daily lifestyle content',
    city: 'New York',
    country: 'USA',
    age: 28,
    gender: 'Male',
    ethnicity: 'Caucasian',
    starRating: 4.5,
    packages: ['Package A', 'Package B', 'Package C'],
    services: ['Photoshoot', 'Video content'],
    portfolio: ['portfolio1.jpg', 'portfolio2.jpg'],
    categories: ['Lifestyle', 'Travel'],
    analytics: [
      { platform: 'Instagram', followers: 1200, avgViews: 400, engagement: '5%' },
      { platform: 'YouTube', followers: 800, avgViews: 300, engagement: '8%' },
    ],
  },
  {
    id: 2,
    name: 'Alice Smith',
    email: 'alice@example.com',
    title: 'Fitness Creator',
    description: 'Fitness and wellness tips',
    city: 'Los Angeles',
    country: 'USA',
    age: 30,
    gender: 'Female',
    ethnicity: 'Asian',
    starRating: 4.8,
    packages: ['Package X', 'Package Y'],
    services: ['Workout Plans', 'Nutrition Advice'],
    portfolio: ['portfolio3.jpg', 'portfolio4.jpg'],
    categories: ['Fitness', 'Wellness'],
    analytics: [{ platform: 'TikTok', followers: 5000, avgViews: 2000, engagement: '12%' }],
  },
];

export default function CreatorsTable() {
  const [openModal, setOpenModal] = useState(false);

  const [modalContent, setModalContent] = useState<ModalContent>({ title: '', content: null });

  const handleOpen = (title: string, content: unknown) => {
    setModalContent({ title, content: content as ModalContent['content'] });
    setOpenModal(true);
  };

  const handleClose = () => setOpenModal(false);

  const handleDelete = (id: number) => {
    alert(`Delete creator with ID: ${id}`);
    // Implement actual delete logic here
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Typography variant="h5" sx={{ m: 2 }}>
          Creators List
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Ethnicity</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Packages</TableCell>
              <TableCell>Services</TableCell>
              <TableCell>Portfolio</TableCell>
              <TableCell>Categories</TableCell>
              <TableCell>Analytics</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {creators.map((creator) => (
              <TableRow key={creator.id}>
                <TableCell>{creator.id}</TableCell>
                <TableCell>{creator.name}</TableCell>
                <TableCell>{creator.email}</TableCell>
                <TableCell>{creator.title}</TableCell>
                <TableCell>{creator.city}</TableCell>
                <TableCell>{creator.country}</TableCell>
                <TableCell>{creator.age}</TableCell>
                <TableCell>{creator.gender}</TableCell>
                <TableCell>{creator.ethnicity}</TableCell>
                <TableCell>{creator.starRating}</TableCell>

                {/* Clickable cells */}
                {(
                  [
                    'packages',
                    'services',
                    'portfolio',
                    'categories',
                    'analytics',
                  ] as (keyof Creator)[]
                ).map((field) => (
                  <TableCell key={field}>
                    <Typography
                      sx={{
                        color: 'primary.main',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                      onClick={() =>
                        handleOpen(field.charAt(0).toUpperCase() + field.slice(1), creator[field])
                      }
                    >
                      see all
                    </Typography>
                  </TableCell>
                ))}

                {/* Delete action */}
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(creator.id)}
                  >
                    Delete Account
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal */}
      <Dialog open={openModal} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{modalContent.title}</DialogTitle>
        <DialogContent>
          {Array.isArray(modalContent.content) ? (
            <List>
              {modalContent.content.map((item, idx) =>
                typeof item === 'object' && item !== null ? (
                  <ListItem key={idx}>
                    <ListItemText
                      primary={`Platform: ${(item as Analytics).platform}`}
                      secondary={`Followers: ${(item as Analytics).followers}, Avg Views: ${(item as Analytics).avgViews}, Engagement: ${(item as Analytics).engagement}`}
                    />
                  </ListItem>
                ) : (
                  <ListItem key={idx}>
                    <ListItemText primary={item as string} />
                  </ListItem>
                ),
              )}
            </List>
          ) : (
            <Typography>{modalContent.content}</Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
