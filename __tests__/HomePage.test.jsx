import React from 'react'
import { render, screen } from '@testing-library/react'
import HomePage from '../src/app/HomePage'

describe('HomePage', () => {
  it('renders a heading', () => {
    render(<HomePage />)

    const heading = screen.getByRole('heading', {
      name: /welcome to mystore/i,
    })

    expect(heading).toBeInTheDocument()
  })
})
