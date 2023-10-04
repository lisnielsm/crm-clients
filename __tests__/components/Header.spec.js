import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { gql } from '@apollo/client';

const OBTENER_USUARIO = gql`
    query obtenerUsuario {
        obtenerUsuario {
            id
            nombre
            apellido
        }
    }
`;

describe('Test Header component', () => {

    // Successfully fetches user data
    it('should fetch user data successfully', () => {
      // Mock the useQuery hook
      const mockData = {
        obtenerUsuario: {
          id: '1',
          nombre: 'John',
          apellido: 'Doe'
        }
      };
      const mockUseQuery = jest.fn(() => ({ data: mockData, loading: false, error: null }));
      jest.mock('@apollo/client', () => ({
        gql: jest.fn(),
        useQuery: mockUseQuery
      }));

      // Render the component and assert
      render(<Header />);
      expect(mockUseQuery).toHaveBeenCalledWith(OBTENER_USUARIO);
      expect(screen.getByText('Hola John Doe')).toBeInTheDocument();
    });

    // Redirects to login page if user is not logged in
    it('should redirect to login page if user is not logged in', () => {
      // Mock the useQuery hook
      const mockUseQuery = jest.fn(() => ({ data: null, loading: false, error: null }));
      jest.mock('@apollo/client', () => ({
        gql: jest.fn(),
        useQuery: mockUseQuery
      }));

      // Mock the useRouter hook
      const mockRouter = { push: jest.fn() };
      jest.mock('next/router', () => ({
        useRouter: () => mockRouter
      }));

      // Render the component and assert
      render(<Header />);
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });

    // Returns an error if there is an issue fetching user data
    it('should return an error if there is an issue fetching user data', () => {
      // Mock the useQuery hook
      const mockError = new Error('Failed to fetch user data');
      const mockUseQuery = jest.fn(() => ({ data: null, loading: false, error: mockError }));
      jest.mock('@apollo/client', () => ({
        gql: jest.fn(),
        useQuery: mockUseQuery
      }));

      // Render the component and assert
      render(<Header />);
      expect(screen.getByText('Failed to fetch user data')).toBeInTheDocument();
    });

    // Redirects to login page if user data is not returned and loading is false
    it('should redirect to login page if user data is not returned and loading is false', () => {
      // Mock the useQuery hook
      const mockUseQuery = jest.fn(() => ({ data: null, loading: false, error: null }));
      jest.mock('@apollo/client', () => ({
        gql: jest.fn(),
        useQuery: mockUseQuery
      }));

      // Mock the useRouter hook
      const mockRouter = { push: jest.fn() };
      jest.mock('next/router', () => ({
        useRouter: () => mockRouter
      }));

      // Render the component and assert
      render(<Header />);
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });

    // Displays user's first and last name if user data is returned
    it('should display user\'s first and last name if user data is returned', () => {
      // Mock the useQuery hook
      const mockData = {
        obtenerUsuario: {
          id: '1',
          nombre: 'John',
          apellido: 'Doe'
        }
      };
      const mockUseQuery = jest.fn(() => ({ data: mockData, loading: false, error: null }));
      jest.mock('@apollo/client', () => ({
        gql: jest.fn(),
        useQuery: mockUseQuery
      }));

      // Render the component and assert
      render(<Header />);
      expect(screen.getByText('Hola John Doe')).toBeInTheDocument();
    });

    // Removes token from local storage when logging out
    it('should remove token from local storage when logging out', () => {
      // Mock the useQuery hook
      const mockData = {
        obtenerUsuario: {
          id: '1',
          nombre: 'John',
          apellido: 'Doe'
        }
      };
      const mockUseQuery = jest.fn(() => ({ data: mockData, loading: false, error: null }));
      jest.mock('@apollo/client', () => ({
        gql: jest.fn(),
        useQuery: mockUseQuery
      }));

      // Mock the localStorage object
      const mockRemoveItem = jest.fn();
      Object.defineProperty(window, 'localStorage', {
        value: { removeItem: mockRemoveItem }
      });

      // Mock the useRouter hook
      const mockRouter = { push: jest.fn() };
      jest.mock('next/router', () => ({
        useRouter: () => mockRouter
      }));

      // Render the component and trigger logout
      render(<Header />);
      fireEvent.click(screen.getByText('Cerrar Sesión'));

      // Assert
      expect(mockRemoveItem).toHaveBeenCalledWith('token');
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });
});