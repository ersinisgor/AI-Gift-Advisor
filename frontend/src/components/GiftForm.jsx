import { useState } from "react";

export default function GiftForm() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setOutput("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/gift-suggestion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: input,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();
      setOutput(data.suggestion);
    } catch (err) {
      console.error(err);
      console.error("Gift suggestion error:", err);
      setOutput(
        "Sorry, I can't access what I need right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form className="gift-form" onSubmit={handleSubmit}>
        <div className="input-section">
          <div className="input-wrapper">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Describe the person you want a gift for..."
            />
          </div>
        </div>

        <div className="lamp-container">
          <button
            type="submit"
            disabled={loading}
            className={`lamp-btn ${loading ? "loading" : ""}`}
          >
            <span className="lamp-icon">
              <img src="/lamp.svg" className="lamp-icon-img" />
            </span>

            <span className="lamp-text">
              {loading ? "Summoning Gift Ideas..." : "Rub the Lamp"}
            </span>
          </button>
        </div>
      </form>

      {output && (
        <section className="output-section">
          <div id="output-container" className="visible">
            <div id="output-content">{output}</div>
          </div>
        </section>
      )}
    </>
  );
}
