import styles from "./Input.module.css";
import React, { useEffect, useState } from "react";
import {
  FaAngleDown,
  FaAngleUp,
  FaCalendarDays,
  FaCheck,
} from "react-icons/fa6";

import { PatternFormat } from "react-number-format";

const TextInput = ({
  text,
  value,
  setValue,
  showError = true,
  type = "text",
  maxLength,
  minLength,
  patternFormat = null,
  mask = null,
  errorText,
  setShowError = false,
  ...patternProps
}) => {
  const handleChange = (e) => {
    const inputValue = e.target.value;
    if (!minLength && !maxLength) {
      setValue(inputValue);
    }
    if (minLength) {
      if (inputValue.length <= minLength && inputValue.length > 0) {
        setShowError(true);
      } else {
        setShowError(false);
      }
      setValue(inputValue);
    }
    if (maxLength) {
      if (inputValue.length < maxLength) {
        setValue(inputValue);
      }
      if (inputValue.length === maxLength) {
        setShowError(false);
      } else {
        setShowError(true);
      }
    }
  };

  return (
    <div className={styles.formGroupWrapper}>
      <div className={styles.formGroup}>
        {patternFormat ? (
          <PatternFormat
            {...patternProps}
            format={patternFormat}
            value={value}
            onValueChange={(values) => {
              const newValue = values.value;
              setValue(newValue);
              setShowError(
                newValue.length !== maxLength && newValue.length > 0
              );
            }}
            className={value ? styles.valid : undefined}
            mask={mask}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={handleChange}
            className={value ? styles.valid : undefined}
            maxLength={maxLength}
            autoComplete="off"
          />
        )}
        <span className={styles.text}>{text}</span>
      </div>
      {showError && <p className={styles.textInputError}>{errorText}</p>}
    </div>
  );
};

const SearchInput = ({
  text,
  setValue,
  values,
  errorText,
  showError,
  setShowError,
  minLength,
  maxLength,
}) => {
  const [filterData, setFilterData] = useState(null);
  const [roomName, setRoomName] = useState("");

  const handleOnChangeSearch = (e) => {
    const inputValue = e.target.value;
    setRoomName(inputValue);

    // Validation based on minLength and maxLength
    if (minLength || maxLength) {
      if (minLength && inputValue.length <= minLength) {
        setShowError(true);
      } else if (maxLength && inputValue.length > maxLength) {
        setShowError(true);
      } else {
        setShowError(false);
      }
    }

    setValue(inputValue);

    // Filtering logic
    setFilterData(() => {
      if (inputValue === "") return null;

      return values.filter((item) =>
        item.name.toLowerCase().includes(inputValue.toLowerCase())
      );
    });

    // Automatically select the matching item if there is exactly one match
    if (
      filterData &&
      filterData.length === 1 &&
      inputValue === filterData[0].name
    ) {
      setValue(filterData[0].name);
    }
  };

  const handleOptionClick = (id, name) => {
    setRoomName(name);
    setValue(name);
    setFilterData(null);
  };

  return (
    <div className={styles.searchInputDiv}>
      <input
        autoComplete="off"
        type="text"
        value={roomName}
        onChange={handleOnChangeSearch}
        className={roomName ? styles.valid : undefined}
      />
      <span className={styles.text}>{text}</span>
      {showError && <p className={styles.textInputError}>{errorText}</p>}
      {filterData && (
        <ul className={styles.roomList}>
          {filterData.map((room, i) => (
            <li key={i} onClick={() => handleOptionClick(room.id, room.name)}>
              {room.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const SelectOptions = ({
  text,
  values,
  value,
  setValue,
  errorText,
  showError,
  isDeleteFunction,
  bgColor = "#fff",
  isDelete = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [roleName, setRoleName] = useState("");

  useEffect(() => {
    if (value === "") {
      setRoleName("");
    }
  }, [value]);

  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (value, name) => {
    setValue(value);
    setRoleName(name);
    setIsOpen(false);
  };

  return (
    <div className={styles.formGroup}>
      <button
        onClick={toggleDropdown}
        className={value ? styles.active : undefined}
        style={{ background: bgColor }}
      >
        <span className={styles.text}>{text}</span>
        <span>{roleName || ""}</span>
        {!isOpen && <FaAngleDown className={styles.icon} />}
        {isOpen && <FaAngleUp className={styles.icon} />}
      </button>

      {showError && <p className={styles.textInputError}>{errorText}</p>}

      <ul
        className={isOpen ? styles.active : undefined}
        style={{ background: bgColor }}
      >
        {values.map((value, index) => (
          <li
            key={index}
            onClick={() => handleOptionClick(value.id, value.name)}
          >
            <span>{value.name}</span>

            {isDelete && (
              <button onClick={() => isDeleteFunction(value.id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const SelectOptionsMulti = ({
  text,
  values,
  value,
  setValue,
  multiple,
  errorText,
  showError,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (selectedId) => {
    if (multiple) {
      if (value.includes(selectedId)) {
        setValue(value.filter((id) => id !== selectedId));
      } else {
        setValue([...value, selectedId]);
      }
    } else {
      setValue([selectedId]);
    }
    setIsOpen(false);
  };

  return (
    <div className={styles.formGroup}>
      <button
        onClick={toggleDropdown}
        className={value.length > 0 && styles.active}
      >
        <span className={styles.text}>{text}</span>
        <span>
          {value.length > 0
            ? value.map((id) => values.find((v) => v.id === id).name).join(", ")
            : ""}
        </span>
        {!isOpen && <FaAngleDown className={styles.icon} />}
        {isOpen && <FaAngleUp className={styles.icon} />}
      </button>

      {showError && <p className={styles.textInputError}>{errorText}</p>}

      <ul className={isOpen ? styles.active : undefined}>
        {values.map((option) => (
          <li key={option.id} onClick={() => handleOptionClick(option.id)}>
            {option.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

const DateInput = ({
  text,
  value,
  setValue,
  width,
  errorText,
  showError,
  setShowError,
  type = null,
  bgColor = "#fff",
}) => {
  const handleDateChange = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    if (type === "DateOfBirth") {
      const today = new Date();
      const selectedDate = new Date(inputValue);
      if (selectedDate < today) {
        setShowError(false);
      } else {
        setShowError(true);
      }
    }
  };

  const handleFocus = (e) => {
    e.target.type = "date";
  };

  const handleBlur = (e) => {
    e.target.type = "text";
  };

  return (
    <div
      className={styles.formGroup}
      style={{ width: `calc(${width}/14.4*1vw)` }}
    >
      <input
        type="text"
        value={value}
        onChange={handleDateChange}
        className={value ? styles.valid : undefined}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{ background: bgColor }}
      />
      <span className={styles.text}>{text}</span>
      <span className={styles.dateicon}>
        <FaCalendarDays />
      </span>
      {showError && <p className={styles.textInputError}>{errorText}</p>}
    </div>
  );
};

const CheckboxInputsGroup = ({ text, value, id, reset }) => {
  const [checkValue, setCheckValue] = useState(value);

  useEffect(() => {
    if (reset) {
      setCheckValue({
        add: false,
        read: false,
        update: false,
        delete: false,
      });
    }
  }, [reset]);

  const handleChange = (event) => {
    const { name, checked } = event.target;
    setCheckValue((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleToggleAll = (event) => {
    const { checked } = event.target;
    setCheckValue({
      add: checked,
      read: checked,
      update: checked,
      delete: checked,
    });
  };

  return (
    <div className={styles.checkboxInputsGroup}>
      <h3>{text}</h3>
      <div className={styles.checkboxGoup}>
        <div className={styles.checkbox}>
          <input
            autoComplete="off"
            type="checkbox"
            id={`all${id}`}
            checked={
              checkValue.add &&
              checkValue.read &&
              checkValue.update &&
              checkValue.delete
            }
            onChange={handleToggleAll}
          />
          <label className={styles.icon} htmlFor={`all${id}`}>
            <FaCheck />
          </label>
          <label htmlFor={`all${id}`} className={styles.text}>
            All
          </label>
        </div>

        <div className={styles.checkbox}>
          <input
            autoComplete="off"
            type="checkbox"
            id={`add${id}`}
            name="add"
            checked={checkValue.add}
            onChange={handleChange}
          />
          <label className={styles.icon} htmlFor={`add${id}`}>
            <FaCheck />
          </label>
          <label htmlFor={`add${id}`} className={styles.text}>
            Add
          </label>
        </div>

        <div className={styles.checkbox}>
          <input
            autoComplete="off"
            type="checkbox"
            id={`read${id}`}
            name="read"
            checked={checkValue.read}
            onChange={handleChange}
          />
          <label className={styles.icon} htmlFor={`read${id}`}>
            <FaCheck />
          </label>
          <label htmlFor={`read${id}`} className={styles.text}>
            Read
          </label>
        </div>

        <div className={styles.checkbox}>
          <input
            autoComplete="off"
            type="checkbox"
            id={`update${id}`}
            name="update"
            checked={checkValue.update}
            onChange={handleChange}
          />
          <label className={styles.icon} htmlFor={`update${id}`}>
            <FaCheck />
          </label>
          <label htmlFor={`update${id}`} className={styles.text}>
            Update
          </label>
        </div>

        <div className={styles.checkbox}>
          <input
            autoComplete="off"
            type="checkbox"
            id={`delete${id}`}
            name="delete"
            checked={checkValue.delete}
            onChange={handleChange}
          />
          <label className={styles.icon} htmlFor={`delete${id}`}>
            <FaCheck />
          </label>
          <label htmlFor={`delete${id}`} className={styles.text}>
            Delete
          </label>
        </div>
      </div>
    </div>
  );
};

const MyProfileCheckBox = ({ text, value, setValue, typesTitle }) => {
  const handleChange = (event) => {
    const { name, checked } = event.target;

    setValue((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleToggleAll = (event) => {
    const { checked } = event.target;
    setValue({
      firstName: checked,
      lastName: checked,
      middleName: checked,
      dateOfBirth: checked,
      jshir: checked,
      homeAddress: checked,
      image: checked,
      phoneNumber: checked,
    });
  };
  return (
    <div className={styles.checkboxInputsGroup}>
      <h3>{text}</h3>
      <div className={`${styles.checkboxGoup} ${styles.myProfile}`}>
        <div className={styles.checkbox}>
          <input
            autoComplete="off"
            type="checkbox"
            id="accessAll"
            checked={
              value.firstName &&
              value.lastName &&
              value.middleName &&
              value.dateOfBirth &&
              value.jshir &&
              value.homeAddress &&
              value.image &&
              value.phoneNumber
            }
            onChange={handleToggleAll}
          />
          <label className={styles.icon} htmlFor="accessAll">
            <FaCheck />
          </label>
          <label htmlFor="accessAll" className={styles.text}>
            All
          </label>
        </div>

        {Object.keys(value).map((item, i) => {
          return (
            <div className={styles.checkbox} key={i}>
              <input
                type="checkbox"
                id={item}
                name={item}
                checked={value[item]}
                onChange={handleChange}
              />
              <label className={styles.icon} htmlFor={item}>
                <FaCheck />
              </label>
              <label htmlFor={item} className={styles.text}>
                {typesTitle[i]}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SelectSearch = ({ text, options, searchTerm, setSearchTerm, width }) => {
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [showOptions, setShowOptions] = useState(false);

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    const filtered = options.filter((option) =>
      option.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredOptions(filtered);
    setShowOptions(true);
    if (searchValue) {
      setShowOptions(true);
    } else {
      setShowOptions(false);
    }
  };

  const handleSelect = (option) => {
    setSearchTerm(option);
    setShowOptions(false);
    onSelect(option);
  };

  return (
    <div
      className={`${styles.formGroup} ${styles.formGroupWrapper}`}
      style={{ width: `calc(${width}/14.4*1vw)` }}
    >
      <input
        type="text"
        className={styles.searchBox}
        value={searchTerm}
        onChange={handleSearch}
      />
      <span
        className={styles.text}
        style={{ display: searchTerm ? "none" : "inline-block" }}
      >
        {text}
      </span>

      {showOptions && (
        <ul className={showOptions ? `${styles.active}` : undefined}>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li key={index} onClick={() => handleSelect(option)}>
                {option}
              </li>
            ))
          ) : (
            <li>No options found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export {
  TextInput,
  SelectOptions,
  DateInput,
  CheckboxInputsGroup,
  MyProfileCheckBox,
  SearchInput,
  SelectOptionsMulti,
  SelectSearch,
};
