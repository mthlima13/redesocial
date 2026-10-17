const Card = ({ children, className = "", hover = false, padding = "p-6" }) => {
  return (
    <div
      className={`card ${hover ? 'card-hover' : ''} ${padding} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
