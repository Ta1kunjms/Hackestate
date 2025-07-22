import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Mock scrollIntoView for JSDOM
global.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('Property filtering and DOM actions', () => {
  it('filters properties by location', () => {
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/type a message/i), { target: { value: 'Show me properties in Austin' } });
    fireEvent.click(screen.getByText(/send/i));
    expect(screen.getByText(/Suburban House/)).toBeInTheDocument();
    expect(screen.queryByText(/Modern Family Home/)).not.toBeInTheDocument();
  });

  it('filters properties by price', () => {
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/type a message/i), { target: { value: 'Show me properties under $400,000' } });
    fireEvent.click(screen.getByText(/send/i));
    expect(screen.getByText(/Cozy Cottage/)).toBeInTheDocument();
    expect(screen.queryByText(/Luxury Villa/)).not.toBeInTheDocument();
  });

  it('scrolls to listings section on command', () => {
    render(<App />);
    const listingsSection = screen.getByText(/Property Listings/).parentElement;
    if (listingsSection) {
      const spy = jest.spyOn(listingsSection, 'scrollIntoView');
      fireEvent.change(screen.getByPlaceholderText(/type a message/i), { target: { value: 'Scroll to listings' } });
      fireEvent.click(screen.getByText(/send/i));
      expect(spy).toHaveBeenCalled();
    }
  });

  it('scrolls to filters section on command', () => {
    render(<App />);
    const filtersSection = screen.getByText(/Filters/).parentElement;
    if (filtersSection) {
      const spy = jest.spyOn(filtersSection, 'scrollIntoView');
      fireEvent.change(screen.getByPlaceholderText(/type a message/i), { target: { value: 'Show filters' } });
      fireEvent.click(screen.getByText(/send/i));
      expect(spy).toHaveBeenCalled();
    }
  });
});
