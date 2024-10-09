import React, { useState, useEffect, useRef } from "react";
import styles from "./Input.module.css";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";

const SelectOptions = ({
  text,
  values,
  value,
  setValue,
  width,
  height,
  bgColor,
  displayKey,
  displaySecondaryKey,
  errorText,
  showError,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [roleName, setRoleName] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (value === "") {
      setRoleName("");
    }
    if (value) {
      const selectedOption = values.find((option) => option.id === value.id);
      if (selectedOption) {
        setRoleName(
          `${selectedOption[displayKey]} ${
            displaySecondaryKey ? selectedOption[displaySecondaryKey] : ""
          }`
        );
      }
    }
  }, [value, values, displayKey, displaySecondaryKey]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (selectedValue) => {
    setValue(selectedValue);
    setRoleName(
      `${selectedValue[displayKey]} ${
        displaySecondaryKey ? selectedValue[displaySecondaryKey] : ""
      }`
    );
    setIsOpen(false);
  };

  return (
    <div
      className={styles.formGroup}
      style={{
        width: `calc(${width}/14.4*1vw)`,
      }}
      ref={dropdownRef}
    >
      <button
        onClick={toggleDropdown}
        className={value && styles.active}
        style={{
          width: "100%",
          height: `calc(${height}/14.4*1vw)`,
          background: bgColor,
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={styles.text}>{text}</span>
        <span>{roleName || ""}</span>
        {!isOpen ? (
          <FaAngleDown className={styles.icon} />
        ) : (
          <FaAngleUp className={styles.icon} />
        )}
      </button>

      {showError && <p className={styles.textInputError}>{errorText}</p>}

      {isOpen && (
        <ul
          className={styles.active}
          style={{ background: bgColor }}
          role="listbox"
          tabIndex="-1"
        >
          {values.map((value, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(value)}
              role="option"
              aria-selected={value.id === value.id}
            >
              {`${value[displayKey]} ${
                displaySecondaryKey ? value[displaySecondaryKey] : ""
              }`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export { SelectOptions };
