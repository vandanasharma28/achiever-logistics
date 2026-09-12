import { useEffect } from "react";

function TidioChat() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//code.tidio.co/bkh96kdrdjped8vpfbnf7nrd8n6qqx8f.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);
  return null;
}

export default TidioChat;