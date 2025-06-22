// src/components/ThemeToggler.tsx
import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { FaSun, FaMoon, FaDesktop } from 'react-icons/fa';
import styles from './ThemeToggler.module.scss';

const ThemeToggler: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const isActive = (t: string) => (theme === t ? styles.active : '');

  return (
    <div className={styles.toggleWrapper}>
      <button
        className={`${styles.toggleButton} ${isActive('light')}`}
        onClick={() => setTheme('light')}
        title="Light theme"
      >
        <FaSun />
      </button>
      <button
        className={`${styles.toggleButton} ${isActive('dark')}`}
        onClick={() => setTheme('dark')}
        title="Dark theme"
      >
        <FaMoon />
      </button>
      <button
        className={`${styles.toggleButton} ${isActive('system')}`}
        onClick={() => setTheme('system')}
        title="System theme"
      >
        <FaDesktop />
      </button>
    </div>
  );
};

export default ThemeToggler;
