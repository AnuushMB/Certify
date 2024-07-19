import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Home from './Home';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';
import ImageUpload from './ImageUpload';
import ImageGallery from './ImageGallery';

// Mock the useAuth hook
jest.mock('../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock the child components
jest.mock('./Login', () => () => <div>Login Component</div>);
jest.mock('./ImageUpload', () => () => <div>ImageUpload Component</div>);
jest.mock('./ImageGallery', () => () => <div>ImageGallery Component</div>);

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state', () => {
    useAuth.mockReturnValue({
      user: null,
      logout: jest.fn(),
      isLoading: true,
    });

    render(<Home />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders Login component when user is not logged in', () => {
    useAuth.mockReturnValue({
      user: null,
      logout: jest.fn(),
      isLoading: false,
    });

    render(<Home />);

    expect(screen.getByText('Login Component')).toBeInTheDocument();
  });

  test('renders user information and components when user is logged in', () => {
    useAuth.mockReturnValue({
      user: {
        displayName: 'John Doe',
        photoURL: 'http://example.com/user.jpg',
      },
      logout: jest.fn(),
      isLoading: false,
    });

    render(<Home />);

    expect(screen.getByText('Hello, John')).toBeInTheDocument();
    expect(screen.getByAltText('User')).toHaveAttribute('src', 'http://example.com/user.jpg');
    expect(screen.getByText('ImageUpload Component')).toBeInTheDocument();
    expect(screen.getByText('ImageGallery Component')).toBeInTheDocument();
  });

  test('calls logout when logout button is clicked', () => {
    const logoutMock = jest.fn();

    useAuth.mockReturnValue({
      user: {
        displayName: 'John Doe',
        photoURL: 'http://example.com/user.jpg',
      },
      logout: logoutMock,
      isLoading: false,
    });

    render(<Home />);

    fireEvent.click(screen.getByText('Logout'));

    expect(logoutMock).toHaveBeenCalled();
  });
});
