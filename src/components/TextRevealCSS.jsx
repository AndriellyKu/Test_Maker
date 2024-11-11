import React from 'react';
import PropTypes from 'prop-types';

const TextRevealCSS = ({ text = '', className = '' }) => {
  const characters = text.match(/./gu) || []; // Captura cada caractere, retorna array vazia se `text` for vazio

  return (
    <p className={`ainda-p ${className}`}>
      {characters.map((char, index) => (
        <span
          key={`${char}-${index}`}
          style={{ animationDelay: `${index * 0.05}s` }}
          className="text-reveal-char" 
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </p>
  );
};

TextRevealCSS.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
};

export default TextRevealCSS;
