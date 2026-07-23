import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import App from './App'
import { slides } from './data/slides'

describe('App', () => {
  it('renders the hero headline and primary CTA', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { level: 1, name: /command the room/i }),
    ).toBeInTheDocument()
    expect(
      screen.getAllByRole('link', { name: /join the waitlist/i }).length,
    ).toBeGreaterThan(0)
  })

  it('advances the slide deck when Next is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByText(slides[0].title)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /next slide/i }))
    expect(screen.getByText(slides[1].title)).toBeInTheDocument()
  })

  it('wraps to the first slide from the last using Prev', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /previous slide/i }))
    expect(
      screen.getByText(slides[slides.length - 1].title),
    ).toBeInTheDocument()
  })
})

describe('WaitlistForm', () => {
  it('shows an error for an invalid email', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/you@company\.com/i), 'nope')
    await user.click(screen.getByRole('button', { name: /request access/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(/valid email/i)
  })

  it('confirms signup for a valid email', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(
      screen.getByPlaceholderText(/you@company\.com/i),
      'founder@slidexl.com',
    )
    await user.click(screen.getByRole('button', { name: /request access/i }))

    expect(screen.getByRole('status')).toHaveTextContent(/on the list/i)
    expect(screen.getByRole('status')).toHaveTextContent(/founder@slidexl.com/i)
  })
})
