import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'
import styles from './DiaryDetailPage.module.css'

export default function DiaryDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [entry, setEntry] = useState(null)
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingSummary, setLoadingSummary] = useState(false)

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await api.get(`/diary/entries/${id}`)
        const data = response.data?.data ?? response.data
        setEntry(data)
        setSummary(data?.summary || '')
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchEntry()
  }, [id])

  const generateSummary = async () => {
    try {
      setLoadingSummary(true)
      const response = await api.post(`/diary/entries/${id}/generate-summary`)
      setSummary(response.data.summary || '')
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingSummary(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.notebook}>
        <div className={styles.pages}>
          <div className={styles.page}>
            <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
            <div className={styles.skeleton} />
            <div className={styles.skeleton} />
            <div className={`${styles.skeleton} ${styles.skeletonShort}`} />
          </div>
          <div className={styles.page}>
            <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
            <div className={styles.skeleton} />
          </div>
        </div>
      </div>
    )
  }

  if (!entry) return <p className={styles.state}>Entry not found.</p>

  const wordCount = (entry.content || '').trim().split(/\s+/).filter(Boolean).length

  return (
    <div className={styles.notebook}>
      <header className={styles.topBar}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <span aria-hidden="true">←</span>
        </button>
        <span className={styles.breadcrumb}>Diary / Entry</span>
      </header>

      <div className={styles.pages}>
        {/* Left page: Diary Entry */}
        <article className={styles.page}>
          <div className={styles.pageHead}>
            <span className={styles.pageLabel}>Entry</span>
            <h1 className={styles.title}>{entry.title}</h1>

            <div className={styles.meta}>
              <time>
                {entry.createdAt
                  ? new Date(entry.createdAt).toLocaleDateString(undefined, {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : ''}
              </time>
              {entry.mood && <span className={styles.mood}>{entry.mood}</span>}
              <span className={styles.dot} aria-hidden="true">•</span>
              <span>{wordCount} words</span>
            </div>
          </div>

          <div className={styles.pageBody}>
            <div className={styles.content}>{entry.content}</div>
          </div>

          {(entry.tags || []).length > 0 && (
            <footer className={styles.tags}>
              {entry.tags.map((tag) => (
                <span key={tag} className={styles.tag}>#{tag}</span>
              ))}
            </footer>
          )}
        </article>

        {/* Right page: AI Summary */}
        <aside className={styles.page}>
          <div className={styles.pageHead}>
            <span className={styles.pageLabel}>Assistant</span>
            <h2 className={styles.summaryTitle}>AI Summary</h2>
          </div>

          <div className={styles.summaryContent}>
            {loadingSummary ? (
              <div className={styles.summaryBox}>
                <div className={styles.skeleton} />
                <div className={styles.skeleton} />
                <div className={`${styles.skeleton} ${styles.skeletonShort}`} />
              </div>
            ) : summary ? (
              <div className={styles.summaryBox}>
                <p>{summary}</p>
              </div>
            ) : (
              <div className={styles.noSummary}>
                <span className={styles.noSummaryIcon} aria-hidden="true">✦</span>
                <p className={styles.noSummaryTitle}>No summary yet</p>
                <p className={styles.noSummaryText}>
                  Generate a short AI recap of this entry.
                </p>
              </div>
            )}
          </div>

          <div className={styles.pageActions}>
            <button
              type="button"
              className={styles.summaryButton}
              onClick={generateSummary}
              disabled={loadingSummary}
            >
              {loadingSummary ? 'Generating…' : summary ? 'Regenerate summary' : 'AI Summary'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
