import { useEffect, useRef, useState } from 'react'
import styles from './DiaryEditorPage.module.css'

export default function DiaryEditorPage({
  open,
  onClose,
  onSave,
  initialData = null,
}) {
  const titleRef = useRef(null)

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: 'Calm',
    tags: '',
  })

  useEffect(() => {
    if (!open) return

    document.body.style.overflow = 'hidden'

    setFormData({
      title: initialData?.title || '',
      content: initialData?.content || '',
      mood: initialData?.mood || 'Calm',
      tags: Array.isArray(initialData?.tags)
        ? initialData.tags.join(', ')
        : initialData?.tags || '',
    })

    setTimeout(() => {
      titleRef.current?.focus()
    }, 0)

    return () => {
      document.body.style.overflow = ''
    }
  }, [open, initialData])

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }

    if (open) window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [open, onClose])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    onSave({
      ...formData,
      tags: formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    })

    onClose()
  }

  if (!open) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="diary-editor-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <div>
            <h2 id="diary-editor-title">
              {initialData ? 'Edit your diary' : 'Write your diary'}
            </h2>
            <p>Capture your thoughts in a calm, clean space.</p>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close editor"
          >
            ✕
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="title">Title</label>
            <input
              ref={titleRef}
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Today I felt..."
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="content">Your note</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your thoughts here..."
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="mood">Mood</label>
              <select
                id="mood"
                name="mood"
                value={formData.mood}
                onChange={handleChange}
              >
                <option>Calm</option>
                <option>Happy</option>
                <option>Sad</option>
                <option>Busy</option>
                <option>Grateful</option>
                <option>Stressed</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="tags">Tags</label>
              <input
                id="tags"
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleChange}
                placeholder="work, family, study"
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.saveButton}>
              Save entry
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}