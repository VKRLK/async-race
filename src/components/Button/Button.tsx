import styles from './Button.module.scss';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  text?: string;
  onClick?: () => void;
  link?: string;
  variant?: 'primary' | 'danger';
  appearance?: 'filled' | 'outline';
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  textClassName?: string;
}

const Button: React.FC<ButtonProps> = ({
  text,
  icon,
  className,
  onClick,
  link,
  variant = 'primary',
  appearance = 'filled',
  color,
  backgroundColor,
  borderColor,
  textClassName,
  ...props
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (link) {
      navigate(link);
    } else {
      onClick?.();
    }
  };

  return (
    <button
      className={classNames(styles.btn, styles[`btn--${variant}`], styles[appearance], className)}
      onClick={handleClick}
      {...props}
    >
      {icon && (
        <span className={styles.iconWrapper} style={{ color }}>
          {icon}
        </span>
      )}
      {text && <span className={classNames(styles.text, textClassName)}>{text}</span>}
    </button>
  );
};

export default Button;
