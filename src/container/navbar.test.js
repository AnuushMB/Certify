import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Navbar from './navbaravbar';
import { getAuth, signOut } from 'firebase/auth';

// Mock the Firebase auth module
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signOut: jest.fn(),
}));

describe('Navbar Component', () => {
  const name = "John Doe";
  const img = "https://via.placeholder.com/45";

  test('renders Navbar with user information', () => {
    render(<Navbar name={name} img={img} />);

    // Check if the user's first name is displayed
    expect(screen.getByText('Hello, John')).toBeInTheDocument();

    // Check if the user's image is displayed
    const userImage = screen.getByAltText('User');
    expect(userImage).toBeInTheDocument();
    expect(userImage).toHaveAttribute('src', img);
  });

  test('calls signOut on logout button click', () => {
    render(<Navbar name={name} img={img} />);

    // Simulate a click on the logout button
    fireEvent.click(screen.getByText('Log Out'));

    // Check if signOut was called
    expect(signOut).toHaveBeenCalled();
  });
});
