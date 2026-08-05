import { useState } from 'react';
import i18n from 'i18next';
import { Button, Menu, MenuItem } from '@mui/material';
//import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { isRtl } from '../../i18n/isRtl';
//import LanguageIcon from '@mui/icons-material/Language';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية' },
];

const LanguageSwitcher: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeLang = (lng: string) => {
    i18n.changeLanguage(lng).then(() => {
      const dir = isRtl(lng) ? 'rtl' : 'ltr';
      document.documentElement.setAttribute('dir', dir);
      document.documentElement.setAttribute('lang', lng);
    });
    handleClose();
  };

  // const styles = {
  //   button: {
  //     border: 'none',
  //     color: 'gray',
  //     borderColor: 'transparent',
  //     mx: 1,
  //   },
  // };

  return (
    <>
      <Button
        onClick={handleClick}
        sx={{
          width: 10,
          height: 5,
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          bgcolor: 'background.paper',
          '&:hover': {
            boxShadow: 'none',
          },
        }}
      >
        {i18n.language.toUpperCase()}
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleChangeLang(lang.code)}
            selected={i18n.language === lang.code}
          >
            {lang.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSwitcher;
