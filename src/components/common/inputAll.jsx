import React, { useState } from 'react';
import styles from './Input.module.css';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6';

const TextInput = ({ text, value, setValue, width = '100%' }) => {
  return (
    <div className={styles.formGroup} style={{ width }}>
      <input
        type='text'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={value ? styles.valid : ''}
      />
      <span className={styles.text}>{text}</span>
    </div>
  );
};

const SelectOptions = ({
  text,
  values,
  value,
  setValue,
  width = '100%', // Default width
  height = '40px', // Default height
  bgColor = '#fff', // Default background color
  displayKey,
  displaySecondaryKey,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsOpen((prev) => !prev); // Toggle the dropdown
  };

  const handleOptionClick = (selectedValue) => {
    setValue(selectedValue);
    setIsOpen(false); // Close the dropdown after selection
  };

  return (
    <div className={styles.formGroup} style={{ width }}>
      <button
        onClick={toggleDropdown}
        className={value ? styles.active : ''}
        style={{
          width: '100%',
          height,
          background: bgColor,
        }}
      >
        <span className={styles.text}>{text}</span>
        <span>
          {value
            ? `${value[displayKey]} ${
                displaySecondaryKey ? value[displaySecondaryKey] : ''
              }`
            : 'Select...'}
        </span>
        {isOpen ? (
          <FaAngleUp className={styles.icon} />
        ) : (
          <FaAngleDown className={styles.icon} />
        )}
      </button>

      {isOpen && (
        <ul className={styles.dropdown} style={{ background: bgColor }}>
          {values.map((option, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(option)}
              style={{ padding: '10px', cursor: 'pointer', color: '#000' }}
            >
              {`${option[displayKey]} ${
                displaySecondaryKey ? option[displaySecondaryKey] : ''
              }`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export { TextInput, SelectOptions };
