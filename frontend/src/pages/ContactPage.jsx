import { useState } from "react";
import woofImg from "../assets/woof.jpg";
import capterraIcon from "../assets/capterra.svg";
import adviceIcon from "../assets/software-advice.svg";
import "./contact.css";

export default function ContactPage() {
  const [form, setForm] = useState({ email: "", name: "", message: "" });
  const [touched, setTouched] = useState({
    email: false,
    name: false,
    message: false,
  });
  const [submitted, setSubmitted] = useState(false);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function setFieldTouched(field) {
    setTouched((p) => ({ ...p, [field]: true }));
  }

  const errors = {
    email: !form.email.trim()
      ? "Mandatory field cannot stay empty."
      : !/^\S+@\S+\.\S+$/.test(form.email.trim())
      ? "Please enter a valid email."
      : "",
    name: !form.name.trim() ? "Mandatory field cannot stay empty." : "",
    message: !form.message.trim() ? "Mandatory field cannot stay empty." : "",
  };

  const hasErrors = Object.values(errors).some(Boolean);

  async function onSubmit(e) {
    e.preventDefault();
    setTouched({ email: true, name: true, message: true });
    if (hasErrors) return;

    try {
      // IMPORTANT: set this to your real endpoint after you confirm it
      const API = "http://localhost:8000/api/contact/";

      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        }),
      });

      if (!res.ok) {
        // Optional: show backend error detail if provided
        let detail = "Failed to submit. Please try again.";
        try {
          const data = await res.json();
          if (data?.detail) detail = data.detail;
        } catch (_) {}
        alert(detail); // or use your Toast system if you want
        return;
      }

      setSubmitted(true);
      // optional reset
      setForm({ email: "", name: "", message: "" });
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    }
  }

  return (
    <div className="contact-page">
      <div className="contact-layout">
        {/* LEFT SIDE */}
        <section className="contact-left">
          <div className="container contact-left-inner">
            <h1 className="contact-title mb-3">Contact Dog Selector today</h1>
            <p className="contact-subtitle mb-4">
              Discover how Dog Selector can help you save time and bring joy.
            </p>

            <div className="card woof-card border-0 shadow-sm">
              <div className="card-body d-flex gap-3 align-items-center">
                <img src={woofImg} alt="Woof" className="woof-avatar" />
                <p className="mb-0 woof-text">
                  Hi, I am Woof, your dog selector specialist. Please tell us
                  more about your needs so that we can find the right fit for
                  you.
                </p>
              </div>
            </div>

            <div className="ratings-row mt-4">
              <div className="d-flex align-items-center gap-2">
                <img src={capterraIcon} alt="" width="100" height="25" />
              </div>

              <div className="d-flex align-items-center gap-2">
                <img src={adviceIcon} alt="" width="150" height="35" />
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE FULL HEIGHT PANEL */}
        <aside className="contact-right-panel">
          <div className="contact-right-inner">
            {!submitted ? (
              <div className="contact-form-card">
                <form onSubmit={onSubmit} noValidate>
                  {/* Email */}
                  <label className="form-label">Email</label>
                  <input
                    className={`form-control ${
                      touched.email && errors.email ? "is-invalid" : ""
                    }`}
                    placeholder="Type here"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    onBlur={() => setFieldTouched("email")}
                  />
                  {touched.email && errors.email ? (
                    <div className="invalid-feedback d-block">
                      <span className="me-2">●</span>
                      {errors.email}
                    </div>
                  ) : null}

                  {/* Name */}
                  <label className="form-label mt-3">Name</label>
                  <input
                    className={`form-control ${
                      touched.name && errors.name ? "is-invalid" : ""
                    }`}
                    placeholder="Type here"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    onBlur={() => setFieldTouched("name")}
                  />
                  {touched.name && errors.name ? (
                    <div className="invalid-feedback d-block">
                      <span className="me-2">●</span>
                      {errors.name}
                    </div>
                  ) : null}

                  {/* Message */}
                  <label className="form-label mt-3">Message</label>
                  <textarea
                    className={`form-control ${
                      touched.message && errors.message ? "is-invalid" : ""
                    }`}
                    placeholder="Type here"
                    name="message"
                    value={form.message}
                    onChange={onChange}
                    onBlur={() => setFieldTouched("message")}
                    rows={4}
                  />
                  {touched.message && errors.message ? (
                    <div className="invalid-feedback d-block">
                      <span className="me-2">●</span>
                      {errors.message}
                    </div>
                  ) : null}

                  <button type="submit" className="btn btn-primary mt-4 px-4">
                    Submit
                  </button>
                </form>
              </div>
            ) : (
              <div className="thank-you-card">
                <h3 className="thank-you-title mb-2">
                  Thank you for contacting us.
                </h3>
                <p className="thank-you-text mb-0">We'll get back to you soon.</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}