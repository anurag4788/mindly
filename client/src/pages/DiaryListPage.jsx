import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './DiaryListPage.module.css'
import DiaryEditorPage from './DiaryEditorPage'
import api from '../api/axios'

export default function DiaryListPage() {
  const navigate = useNavigate()

  const [editorOpen, setEditorOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)
  const [viewEntry, setViewEntry] = useState(null)

  const [diaries, setDiaries] = useState([])
  const [page, setPage] = useState(1)

  const [loading, setLoading] = useState(false)

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalEntries: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  })

  const fetchDiary = async () => {
    try {
      setLoading(true)

      const response = await api.get(
        `/diary/entries?page=${page}&limit=8`
      )

      setDiaries(response.data.data || [])
      setPagination(response.data.pagination)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDiary()
  }, [page])

  const handleSave = async (data) => {
    try {
      if (editingEntry) {
        await api.put(`/diary/entries/${editingEntry._id}`, data)
      } else {
        await api.post('/diary/entries', data)
      }

      await fetchDiary()

      setEditingEntry(null)
      setEditorOpen(false)
    } catch (err) {
      console.log(err)
    }
  }

  const openNewEntry = () => {
    setEditingEntry(null)
    setEditorOpen(true)
  }

  const openEditEntry = (entry) => {
    setEditingEntry(entry)
    setEditorOpen(true)
  }

  const deleteEntry = async (id) => {
    try {
      await api.delete(`/diary/entries/${id}`)

      if (diaries.length === 1 && page > 1) {
        setPage((prev) => prev - 1)
      } else {
        fetchDiary()
      }
    } catch (err) {
      console.log(err)
    }
  }

  const closeView = () => {
    setViewEntry(null)
  }
  return (
  <div className={styles.page}>
    <header className={styles.header}>
      <div>
        <h1>My Diary</h1>
        <p>All your entries in one peaceful place.</p>
      </div>

      <button
        type="button"
        className={styles.newEntryButton}
        onClick={openNewEntry}
      >
        + New Entry
      </button>
    </header>

    <section className={styles.stats}>
      <div className={styles.statCard}>
        <span>Total Entries</span>
        <strong>{pagination.totalEntries}</strong>
      </div>

      <div className={styles.statCard}>
        <span>This Week</span>
        <strong>4</strong>
      </div>

      <div className={styles.statCard}>
        <span>Current Mood</span>
        <strong>Calm</strong>
      </div>
    </section>

    {loading ? (
      <p>Loading...</p>
    ) : (
      <section className={styles.grid}>
        {diaries.map((entry) => (
          <article key={entry._id} className={styles.card}>
            <div className={styles.cardTop}>
              <div>
                <h2>{entry.title}</h2>

                <p className={styles.date}>
                  {entry.createdAt
                    ? new Date(entry.createdAt).toLocaleDateString()
                    : ''}
                </p>
              </div>

              <span className={styles.mood}>
                {entry.mood}
              </span>
            </div>

            <p className={styles.summary}>
              {entry.content}
            </p>

            <div className={styles.tags}>
              {(entry.tags || []).map((tag) => (
                <span
                  key={tag}
                  className={styles.tag}
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className={styles.actions}>
              <button
                onClick={() =>
                  navigate(`/diary/${entry._id}`)
                }
              >
                Read More
              </button>

              <button
                onClick={() => openEditEntry(entry)}
              >
                Edit
              </button>

              <button
                onClick={() =>
                  deleteEntry(entry._id)
                }
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </section>
    )}

<div className={styles.pagination}>
  <button
    className={styles.pageButton}
    disabled={!pagination.hasPreviousPage || loading}
    onClick={() => setPage((prev) => prev - 1)}
  >
    ← Previous
  </button>

  <span className={styles.pageInfo}>
    Page {pagination.currentPage} of {pagination.totalPages}
  </span>

  <button
    className={styles.pageButton}
    disabled={!pagination.hasNextPage || loading}
    onClick={() => setPage((prev) => prev + 1)}
  >
    Next →
  </button>
</div>

    <DiaryEditorPage
      open={editorOpen}
      onClose={() => setEditorOpen(false)}
      onSave={handleSave}
      initialData={editingEntry}
    />
  </div>
)
}