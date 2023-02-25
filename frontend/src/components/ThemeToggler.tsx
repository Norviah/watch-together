import { usePrefers } from '@/src/util/usePrefers';
import { Divider, IconButton } from '@mui/material';
import { useState } from 'react';

import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import type { ThemePresets, Themes } from '../types/Themes';

export function ThemeToggler() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const prefers = usePrefers();

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeChange = (theme: ThemePresets) => {
    prefers.switchTheme(theme);
    handleClose();
  };

  const theme: Themes =
    prefers.theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark'
      : prefers.theme;

  return (
    <>
      <IconButton onClick={handleClick}>
        {theme === 'light' ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={() => handleThemeChange('light')} selected={prefers.theme === 'light'}>
          <LightModeIcon fontSize="small" sx={{ mr: 0.5 }} />
          Light Mode
        </MenuItem>
        <MenuItem onClick={() => handleThemeChange('dark')} selected={prefers.theme === 'dark'}>
          <DarkModeIcon fontSize="small" sx={{ mr: 0.5 }} />
          Dark Mode
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleThemeChange('system')} selected={prefers.theme === 'system'}>
          System
        </MenuItem>
      </Menu>
    </>
  );
}
