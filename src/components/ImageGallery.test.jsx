import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FileGallery from './FileGallery';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../firebase/firebaseConfig';
import { ref, listAll, getDownloadURL } from 'firebase/storage';

// Mock the useAuth hook
jest.mock('../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock the Firebase storage functions
jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  listAll: jest.fn(),
  getDownloadURL: jest.fn(),
}));

describe('FileGallery Component', () => {
  const mockUser = {
    uid: 'test-uid',
  };

  const mockFiles = [
    { name: 'file1.pdf', fullPath: 'files/test-uid/file1.pdf' },
    { name: 'file2.jpg', fullPath: 'files/test-uid/file2.jpg' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ user: mockUser });
    listAll.mockResolvedValueOnce({ items: mockFiles });
  });

  test('renders FileGallery and fetches files', async () => {
    render(<FileGallery />);

    await waitFor(() => {
      mockFiles.forEach(file => {
        expect(screen.getByText(truncateFileName(file.name))).toBeInTheDocument();
      });
    });
  });

  test('handles file download', async () => {
    const mockUrl = 'http://example.com/file1.pdf';
    getDownloadURL.mockResolvedValueOnce(mockUrl);

    render(<FileGallery />);

    const downloadButtons = await screen.findAllByRole('button');
    fireEvent.click(downloadButtons[0]);

    await waitFor(() => {
      expect(getDownloadURL).toHaveBeenCalledWith(ref(storage, `files/${mockUser.uid}/${mockFiles[0].name}`));
    });
  });

  test('handles file download error', async () => {
    console.error = jest.fn();
    getDownloadURL.mockRejectedValueOnce(new Error('Error downloading the image'));

    render(<FileGallery />);

    const downloadButtons = await screen.findAllByRole('button');
    fireEvent.click(downloadButtons[0]);

    await waitFor(() => {
      expect(getDownloadURL).toHaveBeenCalledWith(ref(storage, `files/${mockUser.uid}/${mockFiles[0].name}`));
      expect(console.error).toHaveBeenCalledWith('Error downloading the image:', expect.any(Error));
    });
  });
});