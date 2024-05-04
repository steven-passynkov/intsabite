import { useEffect, useState } from "react";
import { IntlProvider } from "react-intl";
import { useSelector } from "react-redux";
import englishUSMessages from "../lang/en-US.json";

const IntlContext = ({ children }) => {
  const [messages, setMessages] = useState({});
  const language = useSelector((state) => state.user).language;

  useEffect(() => {
    const loadLocaleData = async (locale) => {
      switch (locale) {
        case "fr": {
          const frenchMessages = await import("../lang/fr.json");
          setMessages(frenchMessages);
          break;
        }
        case "en-US":
        default: {
          const englishUSMessages = await import("../lang/en-US.json");
          setMessages(englishUSMessages);
          break;
        }
      }
    };

    loadLocaleData(language);
  }, [language]);

  return (
    <IntlProvider
      locale={language || "en-US"}
      messages={messages || englishUSMessages}
      defaultLocale="en-US"
    >
      {children}
    </IntlProvider>
  );
};

export default IntlContext;
