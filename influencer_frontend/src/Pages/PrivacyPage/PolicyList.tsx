import { List, ListItem, ListItemText } from '@mui/material';
import FormattedText from './FormattedText';

interface PolicyListProps {
  items: string[];
}

const PolicyList = ({ items }: PolicyListProps) => (
  <List dense>
    {items.map((item, index) => (
      <ListItem key={index} sx={{ display: 'list-item', listStyleType: 'disc', pl: 2 }}>
        <ListItemText primary={<FormattedText text={item} />} />
      </ListItem>
    ))}
  </List>
);

export default PolicyList;
