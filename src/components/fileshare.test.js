import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FileShare from './FileShare';
import { storage, database } from '../config/store';
import { ref as storageRef, uploadBytesResumable, getDownloadURL, getMetadata } from 'firebase/storage';
import { ref as databaseRef, push } from 'firebase/database';

// Mock the Firebase services and methods
jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  uploadBytesResumable: jest.fn(),
  getDownloadURL: jest.fn(),
  getMetadata: jest.fn(),
}));

jest.mock('firebase/database', () => ({
  ref: jest.fn(),
  push: jest.fn(),
}));

jest.mock('../config/store', () => ({
  storage: jest.fn(),
  database: jest.fn(),
}));

describe('FileShare Component', () => {
  const uid = 'test-uid';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders FileShare component', () => {
    render(<FileShare uid={uid} />);
    expect(screen.getByText('Add files')).toBeInTheDocument();
  });

  test('handles file upload process', async () => {
    const mockFile = new File(['content'], 'test.png', { type: 'image/png' });

    uploadBytesResumable.mockReturnValue({
      on: jest.fn((event, progress, error, success) => {
        if (event === 'state_changed') {
          progress({ bytesTransferred: 50, totalBytes: 100 });
          success();
        }
      }),
      snapshot: { ref: {} },
    });

    getDownloadURL.mockResolvedValue('http://mockurl.com/test.png');
    getMetadata.mockResolvedValue({
      name: 'test.png',
      size: 1024,
      contentType: 'image/png',
      fullPath: 'test.png',
    });

    render(<FileShare uid={uid} />);

    const input = screen.getByLabelText('Browse your files');
    Object.defineProperty(input, 'files', {
      value: [mockFile],
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(uploadBytesResumable).toHaveBeenCalled();
      expect(getDownloadURL).toHaveBeenCalled();
      expect(getMetadata).toHaveBeenCalled();
      expect(push).toHaveBeenCalledTimes(2); // One for file metadata, one for log
      expect(screen.getByText('Upload Success')).toBeInTheDocument();
    });
  });

  test('handles upload error', async () => {
    const mockFile = new File(['content'], 'test.png', { type: 'image/png' });

    uploadBytesResumable.mockReturnValue({
      on: jest.fn((event, progress, error, success) => {
        if (event === 'state_changed') {
          error({ message: 'Upload failed' });
        }
      }),
      snapshot: { ref: {} },
    });

    render(<FileShare uid={uid} />);

    const input = screen.getByLabelText('Browse your files');
    Object.defineProperty(input, 'files', {
      value: [mockFile],
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(uploadBytesResumable).toHaveBeenCalled();
      expect(screen.getByText('Upload error: Upload failed')).toBeInTheDocument();
    });
  });
});
