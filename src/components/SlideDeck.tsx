import { useState } from 'react'
import { slides } from '../data/slides'

export function SlideDeck() {
  const [index, setIndex] = useState(0)
  const total = slides.length
  const slide = slides[index]

  const go = (delta: number) =>
    setIndex((i) => (i + delta + total) % total)

  return (
    <div className="deck">
      <div
        className="slide"
        style={{ backgroundImage: slide.accent }}
        role="group"
        aria-roledescription="slide"
        aria-label={`Slide ${index + 1} of ${total}`}
      >
        <span className="slide-count">
          {index + 1} / {total}
        </span>
        <h3 className="slide-title">{slide.title}</h3>
        <p className="slide-body">{slide.body}</p>
      </div>

      <div className="deck-controls">
        <button
          type="button"
          className="deck-btn"
          onClick={() => go(-1)}
          aria-label="Previous slide"
        >
          ‹ Prev
        </button>
        <div className="deck-dots" role="tablist" aria-label="Slides">
          {slides.map((s, i) => (
            <button
              key={s.title}
              type="button"
              className={`dot${i === index ? ' active' : ''}`}
              aria-label={`Go to slide ${i + 1}`}
              aria-selected={i === index}
              role="tab"
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <button
          type="button"
          className="deck-btn"
          onClick={() => go(1)}
          aria-label="Next slide"
        >
          Next ›
        </button>
      </div>
    </div>
  )
}
