import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navigation from '../../app/components/Navigation';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  usePathname: jest.fn().mockReturnValue('/'),
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

// Mock Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('Navigation Component', () => {
  it('renders the logo correctly', () => {
    render(<Navigation />);
    expect(screen.getByText('CD Golf League')).toBeInTheDocument();
  });

  it('renders all navigation links on desktop', () => {
    render(<Navigation />);
    expect(screen.getByText('Teams')).toBeInTheDocument();
    expect(screen.getByText('Schedule')).toBeInTheDocument();
    expect(screen.getByText('Matches')).toBeInTheDocument();
    expect(screen.getByText('Standings')).toBeInTheDocument();
  });

  it('toggles mobile menu when hamburger button is clicked', () => {
    render(<Navigation />);
    
    // Mobile menu should be hidden initially
    expect(screen.queryByRole('link', { name: 'Teams' })).not.toBeVisible();
    
    // Click hamburger menu button
    const menuButton = screen.getByRole('button', { name: /open main menu/i });
    fireEvent.click(menuButton);
    
    // Mobile menu should now be visible
    expect(screen.getAllByText('Teams')[0]).toBeVisible();
    expect(screen.getAllByText('Schedule')[0]).toBeVisible();
    expect(screen.getAllByText('Matches')[0]).toBeVisible();
    expect(screen.getAllByText('Standings')[0]).toBeVisible();
    
    // Click again to close
    fireEvent.click(menuButton);
    
    // Menu should be hidden again
    expect(screen.queryByRole('link', { name: 'Teams' })).not.toBeVisible();
  });

  it('has the correct href attributes on all links', () => {
    render(<Navigation />);
    
    const teamsLink = screen.getByRole('link', { name: 'Teams' });
    const scheduleLink = screen.getByRole('link', { name: 'Schedule' });
    const matchesLink = screen.getByRole('link', { name: 'Matches' });
    const standingsLink = screen.getByRole('link', { name: 'Standings' });
    
    expect(teamsLink).toHaveAttribute('href', '/teams');
    expect(scheduleLink).toHaveAttribute('href', '/schedule');
    expect(matchesLink).toHaveAttribute('href', '/matches');
    expect(standingsLink).toHaveAttribute('href', '/standings');
  });
});
