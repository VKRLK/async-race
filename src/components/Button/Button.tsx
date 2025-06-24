import styles from './Button.module.scss';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../../hooks/useIsMobile';

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
  hideTextOnMobile?: boolean;
  alwaysShowIcon?: boolean;
  isIconFirst?: boolean;
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
  hideTextOnMobile,
  alwaysShowIcon = true,
  isIconFirst = true,

  ...props
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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
      {isIconFirst ? (
        <>
          {(alwaysShowIcon || isMobile) && icon && (
            <span className={styles.iconWrapper} style={{ color }}>
              {icon}
            </span>
          )}
          {(!hideTextOnMobile || !isMobile) && text && (
            <span className={classNames(styles.text, textClassName)}>{text}</span>
          )}
        </>
      ) : (
        <>
          {(!hideTextOnMobile || !isMobile) && text && (
            <span className={classNames(styles.text, textClassName)}>{text}</span>
          )}
          {(alwaysShowIcon || isMobile) && icon && (
            <span className={styles.iconWrapper} style={{ color }}>
              {icon}
            </span>
          )}
        </>
      )}
    </button>
  );
};

export default Button;
