import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FileTable from './FileTable';
import { storage, Provider } from '../config/store';
import { ref as storageRef, deleteObject } from "firebase/storage";
import { ref as databaseRef, remove, push } from "firebase/database";

// Mock the Firebase services and methods
jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  deleteObject: jest.fn(),
}));

jest.mock('firebase/database', () => ({
  ref: jest.fn(),
  remove: jest.fn(),
  push: jest.fn(),
}));

jest.mock('../config/store', () => ({
  storage: jest.fn(),
  database: jest.fn(),
}));

describe('FileTable Component', () => {
  const uid = 'test-uid';
  const mockFiles = [
    {
      key: '1',
      name: 'test-image.png',
      contentType: 'image/png',
      downloadURL: 'http://example.com/test-image.png',
    },
    {
      key: '2',
      name: 'test-doc.txt',
      contentType: 'text/plain',
      downloadURL: 'http://example.com/test-doc.txt',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders FileTable with files', () => {
    render(<FileTable uid={uid} myFiles={mockFiles} />);

    expect(screen.getByText('test-image.png')).toBeInTheDocument();
    expect(screen.getByText('image/png')).toBeInTheDocument();
    expect(screen.getByText('test-doc.txt')).toBeInTheDocument();
    expect(screen.getByText('text/plain')).toBeInTheDocument();
  });

  test('deletes a file', async () => {
    deleteObject.mockResolvedValueOnce();
    remove.mockResolvedValueOnce();
    push.mockResolvedValueOnce();

    render(<FileTable uid={uid} myFiles={mockFiles} />);

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(deleteObject).toHaveBeenCalledWith(expect.any(Object));
      expect(remove).toHaveBeenCalledWith(expect.any(Object));
      expect(push).toHaveBeenCalledWith(expect.any(Object), {
        action: 'test-image.png deleted',
        timestamp: expect.any(String),
      });
    });
  });

  test('handles delete file error', async () => {
    console.error = jest.fn();
    deleteObject.mockRejectedValueOnce(new Error('Error deleting file'));

    render(<FileTable uid={uid} myFiles={mockFiles} />);

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(deleteObject).toHaveBeenCalledWith(expect.any(Object));
      expect(console.error).toHaveBeenCalledWith('Error deleting file:', 'Error deleting file');
    });
  });
});
