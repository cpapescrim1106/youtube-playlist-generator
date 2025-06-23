import { render, screen } from '@testing-library/react'
import { LoadingSpinner } from '@/components/loading-spinner'

describe('LoadingSpinner', () => {
  it('renders with default size', () => {
    render(<LoadingSpinner />)
    const spinner = screen.getByRole('status', { hidden: true })
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('h-4', 'w-4')
  })

  it('renders with small size', () => {
    render(<LoadingSpinner size="sm" />)
    const spinner = screen.getByRole('status', { hidden: true })
    expect(spinner).toHaveClass('h-3', 'w-3')
  })

  it('renders with large size', () => {
    render(<LoadingSpinner size="lg" />)
    const spinner = screen.getByRole('status', { hidden: true })
    expect(spinner).toHaveClass('h-8', 'w-8')
  })

  it('applies custom className', () => {
    render(<LoadingSpinner className="custom-class" />)
    const spinner = screen.getByRole('status', { hidden: true })
    expect(spinner).toHaveClass('custom-class')
  })
})