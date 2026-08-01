import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'
import styles from './DiaryDetailPage.module.css'

export default function DiaryDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [entry, setEntry] = useState(null)
  const [summary, setSummary] = useState('')
  const [loadingSummary, setLoadingSummary] = useState(false)

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await api.get(`/diary/entries/${id}`)
        setEntry(response.data.data || response.data)
        setSummary(response.data.data.summary);
        
      } catch (err) {
        console.log(err)
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

  if (!entry) return <p>Loading...</p>

  return (
    <div className={styles.notebook}>
      {/* Back button: separate, top-left corner */}
      <button
        type="button"
        className={styles.backButton}
        onClick={() => navigate(-1)}
        aria-label="Go back"
      >
        ←
      </button>

      <div className={styles.pages}>
        {/* Left page: Diary Entry */}
        <div className={styles.page}>
          <h1 className={styles.title}>{entry.title}</h1>

          <div className={styles.meta}>
            <span>
              {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : ''}
            </span>
            <span className={styles.mood}>{entry.mood}</span>
          </div>

          <div className={styles.content}>{entry.content}</div>

          <div className={styles.tags}>
            {(entry.tags || []).map((tag) => (
              <span key={tag} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right page: AI Summary */}
        <div className={styles.page}>
          <h2 className={styles.summaryTitle}>AI Summary</h2>

          {/* Summary / No summary content */}
          {summary ? (
            <div className={styles.summaryBox}>
              <p>{summary}</p>
            </div>
          ) : (
            <div className={styles.noSummary}>
              NO GENERATION OF AI YET, PLEASE CLICK TO GENERATE SUMMARY
            </div>
          )}

          {/* AI Summary button: always at bottom-left of right page */}
          <button
            type="button"
            className={styles.summaryButton}
            onClick={generateSummary}
            disabled={loadingSummary}
          >
            {loadingSummary ? 'Generating...' : 'AI Summary'}
          </button>
        </div>
      </div>
    </div>
  )
}