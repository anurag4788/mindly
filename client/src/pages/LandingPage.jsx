import styles from "./LandingPage.module.css";
import { useNavigate } from 'react-router-dom'


export default function LandingPage() {
  const navigate = useNavigate()
  const cards = [
    {
      title: "AI summaries",
      description:
        "Condense long entries into 2–3 reflective sentences.",
      icon: "✦",
    },
    {
      title: "Grammar check",
      description:
        "Catch grammar, spelling, and punctuation issues instantly.",
      icon: "A",
    },
    {
      title: "Improve English",
      description:
        "Get a clearer, more natural rewrite that keeps your voice.",
      icon: "🪄",
    },
    {
      title: "Mood & tags",
      description:
        "Auto-detect how you felt and tag what your day was about.",
      icon: "☺",
    },
  ];

  return (
    <div className={styles.container}>
      {/* Navbar */}

      <nav className={styles.navbar}>
        <div className={styles.logo}>
          📖 <span>Mindly</span>
        </div>

        <div className={styles.navButtons}>
          <button className={styles.signIn}  onClick={() => navigate('/auth')} >Sign in</button>

          <button className={styles.getStarted}  onClick={() => navigate('/auth')}>
            Get started
          </button>
        </div>
      </nav>

      {/* Hero Section */}

      <section className={styles.hero}>
        <div className={styles.badge}>
          ✨ AI-powered diary
        </div>

        <h1>
          Write your day.
          <br />
          Reflect with AI.
        </h1>

        <p>
          Mindly is your private journal that summarizes entries,
          fixes grammar, improves your English, and detects mood
          and tags — all in one place.
        </p>

        <button className={styles.ctaButton}  onClick={() => navigate('/auth')}>
          Start writing 
        </button>
      </section>

      {/* Feature Cards */}

      <section className={styles.cardsContainer}>
        {cards.map((card, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.cardIcon}>
              {card.icon}
            </div>

            <h3>{card.title}</h3>

            <p>{card.description}</p>
          </div>
        ))}
      </section>

      {/* Footer */}

      <footer className={styles.footer}>
        <p>© 2026 Mindly</p>

        <p>🔒 Private to you</p>
      </footer>
    </div>
  );
}