import { useState, type FormEvent } from 'react'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!EMAIL_RE.test(email.trim())) {
      setStatus('error')
      return
    }
    setStatus('success')
  }

  if (status === 'success') {
    return (
      <div className="waitlist-success" role="status">
        <span className="check" aria-hidden="true">
          ✓
        </span>
        <p>
          You&rsquo;re on the list! We&rsquo;ll email <strong>{email}</strong>{' '}
          when early access opens.
        </p>
      </div>
    )
  }

  return (
    <form className="waitlist-form" onSubmit={onSubmit} noValidate>
      <label className="sr-only" htmlFor="email">
        Email address
      </label>
      <input
        id="email"
        name="email"
        type="email"
        className="waitlist-input"
        placeholder="you@company.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          if (status === 'error') setStatus('idle')
        }}
        aria-invalid={status === 'error'}
      />
      <button type="submit" className="btn btn-primary">
        Request access
      </button>
      {status === 'error' && (
        <p className="waitlist-error" role="alert">
          Please enter a valid email address.
        </p>
      )}
    </form>
  )
}
