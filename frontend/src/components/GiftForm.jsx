import { useState } from "react";

export default function GiftForm() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/gift-suggestion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: input,
        }),
      });

      const data = await res.json();

      setOutput(data.suggestion);
    } catch (err) {
      console.error(err);
      setOutput("Something went wrong.");
    }

    setLoading(false);
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
