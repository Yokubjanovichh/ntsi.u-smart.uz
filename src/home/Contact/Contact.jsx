import React, { useState } from "react";
import { PatternFormat } from "react-number-format";
import { enqueueSnackbar as EnSn } from "notistack";
import { useSelector } from "react-redux";
import styles from "./Contact.module.css";

const BOT_TOKEN = import.meta.env.VITE_BOT_TOKEN;
const YOUR_CHAT_ID = import.meta.env.VITE_YOUR_CHAT_ID;

export default function Contact() {
  const translations = useSelector((state) => state.language.translations);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [question, setQuestion] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const requestBody = {
      chat_id: YOUR_CHAT_ID,
      text: `
      \nIsm: ${name}
      \nTelefon-raqami: ${number}
      \nMavzu: ${question}
      `,
    };

    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Xatolik yuz berdi");
        }
        return response.json();
      })
      .then((data) => {
        EnSn("Success", { variant: "success" });
        setName("");
        setNumber("");
        setQuestion("");
      })
      .catch((error) => {
        EnSn("Error", { variant: "error" });
        console.error("Xatolik yuz berdi:", error);
      });
  };

  return (
    <div className={`${styles.contact} container`} id="contact">
      <h1>{translations.mainContactUsBody}</h1>
      <p>
        Lorem Ipsum has been the industry's standard dummy text ever since the
        1500s, when an unknown printer took a galley of type and scrambled it to
        make a type specimen book. It has survived not only five centuries, but
        also the leap into electronic typesetting, remaining essentially
      </p>
      <form className={styles.contactForm} onSubmit={handleSubmit}>
        <input
          autoComplete="off"
          required
          type="text"
          name="name"
          placeholder={translations.mainInputName}
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <PatternFormat
          format="+998 ## ### ## ##"
          allowEmptyFormatting
          mask=" "
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          required
          className={styles.contactInputPhone}
          autoComplete="off"
        />
        <textarea
          autoComplete="off"
          required
          placeholder={translations.mainInputMessage}
          name="message"
          onChange={(e) => setQuestion(e.target.value)}
          value={question}
        ></textarea>
        <button>{translations.mainSendMessage}</button>
      </form>
    </div>
  );
}
