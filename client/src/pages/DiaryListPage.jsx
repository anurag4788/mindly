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

  const handleSave =async (data) => {
    if (editingEntry) {
      await api.put(`/diary/entries/${editingEntry._id}`, data)
      setDiaries((prev) =>
        prev.map((item) =>
          item._id === editingEntry._id
            ? {
                ...item,
                title: data.title,
                content: data.content,
                mood: data.mood,
                tags: data.tags,
              }
            : item
        )
      )
    } else {
      // Create new entry
      const response = await api.post('/diary/entries', data)

      const newEntry = response.data.data || response.data

      setDiaries((prev) => [
        {
          ...newEntry,
          createdAt: newEntry.createdAt || new Date().toISOString(),
        },
        ...prev,
      ])
    }
    setEditingEntry(null)
    setEditorOpen(false)
  }

  useEffect(() => {
    const fetchDiary = async () => {
      try {
        const response = await api.get('/diary/entries')
        setDiaries(response.data.data || [])
      } catch (err) {
        console.log(err)
      }
    }

    fetchDiary()
  }, [])

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
      setDiaries((prev) => prev.filter((item) => item._id !== id))
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
          + New entry
        </button>
      </header>

      <section className={styles.stats}>
        <div className={styles.statCard}>
          <span>Total entries</span>
          <strong>{diaries.length}</strong>
        </div>
        <div className={styles.statCard}>
          <span>This week</span>
          <strong>4</strong>
        </div>
        <div className={styles.statCard}>
          <span>Current mood</span>
          <strong>Calm</strong>
        </div>
      </section>

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
              <span className={styles.mood}>{entry.mood}</span>
            </div>

            <p className={styles.summary}>{entry.content}</p>

            <div className={styles.tags}>
              {(entry.tags || []).map((tag) => (
                <span key={tag} className={styles.tag}>
                  #{tag}
                </span>
              ))}
            </div>

            <div className={styles.actions}>
              <button type="button" onClick={() => navigate(`/diary/${entry._id}`)}>
                Read more
              </button>
              <button type="button" onClick={() => openEditEntry(entry)}>
                Edit
              </button>
              <button type="button" onClick={() => deleteEntry(entry._id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </section>

      {/* {viewEntry && (
        <div className={styles.modalOverlay} onClick={closeView}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button type="button" className={styles.closeButton} onClick={closeView}>
              ×
            </button>

            <h2>{viewEntry.title}</h2>
            <p className={styles.date}>
              {viewEntry.createdAt
                ? new Date(viewEntry.createdAt).toLocaleDateString()
                : ''}
            </p>

            <span className={styles.mood}>{viewEntry.mood}</span>

            <p className={styles.fullContent}>{viewEntry.content}</p>

            <div className={styles.tags}>
              {(viewEntry.tags || []).map((tag) => (
                <span key={tag} className={styles.tag}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )} */}

      <DiaryEditorPage
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={handleSave}
        initialData={editingEntry}
      />
    </div>
  )
}