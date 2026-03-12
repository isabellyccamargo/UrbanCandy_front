import './Button.css';

export const Button = ({ children, onClick, variant = 'primary', type = 'button' }) => {
  return (
    <button
      type={type}
      className={`btn-universal ${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};