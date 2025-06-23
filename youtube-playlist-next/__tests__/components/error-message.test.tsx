import { render, screen } from '@testing-library/react'
import { ErrorMessage } from '@/components/error-message'

describe('ErrorMessage', () => {
  it('renders error message', () => {
    const message = 'Something went wrong'
    render(<ErrorMessage message={message} />)
    
    expect(screen.getByText(message)).toBeInTheDocument()
  })

  it('renders with error icon', () => {
    render(<ErrorMessage message="Error" />)
    
    const alertIcon = screen.getByRole('img', { hidden: true })
    expect(alertIcon).toBeInTheDocument()
  })

  it('has correct error styling', () => {
    render(<ErrorMessage message="Error" />)
    
    const container = screen.getByText('Error').closest('div')
    expect(container).toHaveClass('border-destructive/50', 'bg-destructive/10')
  })
})