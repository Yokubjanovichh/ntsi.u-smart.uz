import React, { useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6';
import styles from './Input.module.css';

const SelectOptionsGroup = ({
  text,
  values,
  selectedValues,
  onChange,
  width,
  height,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (value) => {
    if (onChange) {
      onChange(value);
    }
    setIsOpen(false); // Close the dropdown after selection
  };

  return (
    <div className={styles.formGroup} style={{ width, height }}>
      <button
        onClick={toggleDropdown}
        className={`${styles.dropdownButton} ${isOpen ? styles.active : ''}`}
      >
        <span className={styles.text}>{text}</span>
        <span>{selectedValues.map((val) => val.name).join(', ')}</span>
        {!isOpen ? (
          <FaAngleDown className={styles.icon} />
        ) : (
          <FaAngleUp className={styles.icon} />
        )}
      </button>

      {isOpen && (
        <ul className={styles.optionsList}>
          {values.map((option) => (
            <li key={option.id} onClick={() => handleOptionClick(option)}>
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectOptionsGroup;
