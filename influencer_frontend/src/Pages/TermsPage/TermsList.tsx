// src/components/TermsList.jsx
import { List, ListItem, ListItemText, Typography } from '@mui/material';
interface TermsListProps {
  items: string[];
}
const TermsList = ({ items }: TermsListProps) => (
  <List dense>
    {items.map((item, index) => (
      <ListItem key={index} sx={{ display: 'list-item', listStyleType: 'decimal', pl: 2 }}>
        <ListItemText primary={<Typography variant="body1">{item}</Typography>} />
      </ListItem>
    ))}
  </List>
);

export default TermsList;
