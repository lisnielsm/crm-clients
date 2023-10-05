import React from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from "@testing-library/react";

import Header from "../../components/Header";

describe("Test Header component", () => {
  // Mock the LayoutContext
  const mockLayoutContext = {
    open: false,
    abrirSidebar: jest.fn(),
  };

  // Mock the useRouter hook
  const mockRouter = {
    push: jest.fn(),
  };

	// Renders logout button if user is logged in
	it("should render logout button when user is logged in", () => {
		jest.spyOn(React, "useContext").mockReturnValue(mockLayoutContext);
		jest.spyOn(require("next/router"), "useRouter").mockReturnValue(
			mockRouter
		);

		// Mock the useQuery hook
		const mockData = {
			obtenerUsuario: {
				id: 1,
				nombre: "John",
				apellido: "Doe",
			},
		};
		const mockUseQuery = jest.fn().mockReturnValue({
			data: mockData,
			loading: false,
			error: null,
			client: {
				clearStore: jest.fn(),
			},
		});
		jest.spyOn(require("@apollo/client"), "useQuery").mockImplementation(
			mockUseQuery
		);

		// Render the component
		render(<Header />);

		// Assert
		expect(screen.getByText("Cerrar Sesión")).toBeInTheDocument();
	});

	// Opens sidebar when sidebar button is clicked
	it("should open sidebar when sidebar button is clicked", () => {
		jest.spyOn(React, "useContext").mockReturnValue(mockLayoutContext);
		jest.spyOn(require("next/router"), "useRouter").mockReturnValue(
			mockRouter
		);

		// Mock the useQuery hook
		const mockData = {
			obtenerUsuario: {
				id: 1,
				nombre: "John",
				apellido: "Doe",
			},
		};
		const mockUseQuery = jest.fn().mockReturnValue({
			data: mockData,
			loading: false,
			error: null,
			client: {
				clearStore: jest.fn(),
			},
		});
		jest.spyOn(require("@apollo/client"), "useQuery").mockImplementation(
			mockUseQuery
		);

		// Render the component
		render(<Header />);

		// Click the sidebar button
		fireEvent.click(screen.getByRole("button", { name: /abrir menu/i }));

		// Assert
		expect(mockLayoutContext.abrirSidebar).toHaveBeenCalled();
	});

	// Redirects to login page if user is not logged in
	it("should redirect to login page if user is not logged in", () => {
		jest.spyOn(React, "useContext").mockReturnValue(mockLayoutContext);
		jest.spyOn(require("next/router"), "useRouter").mockReturnValue(
			mockRouter
		);

		// Mock the useQuery hook
		const mockUseQuery = jest.fn().mockReturnValue({
			data: null,
			loading: false,
			error: null,
			client: {
				clearStore: jest.fn(),
			},
		});
		jest.spyOn(require("@apollo/client"), "useQuery").mockImplementation(
			mockUseQuery
		);

		// Render the component
		render(<Header />);

		// Assert
		expect(mockRouter.push).toHaveBeenCalledWith("/login");
	});

	// Renders error message if there is an error obtaining user data
	it("should render error message if there is an error obtaining user data", () => {
		jest.spyOn(React, "useContext").mockReturnValue(mockLayoutContext);
  	jest.spyOn(require("next/router"), "useRouter").mockReturnValue(
			mockRouter
		);

		// Mock the useQuery hook
		const mockError = new Error("Usuario no válido");
		const mockUseQuery = jest.fn().mockReturnValue({
			data: null,
			loading: false,
			error: mockError,
			client: {
				clearStore: jest.fn(),
			},
		});
		jest.spyOn(require("@apollo/client"), "useQuery").mockImplementation(
			mockUseQuery
		);

		// Render the component
		render(<Header />);

		// Assert
		expect(
			screen.getByText("Usuario no válido")
		).toBeInTheDocument();
	});

	// Renders error message if user data is not obtained and loading is finished
	it("should render error message if user data is not obtained and loading is finished", () => {
		jest.spyOn(React, "useContext").mockReturnValue(mockLayoutContext);
		jest.spyOn(require("next/router"), "useRouter").mockReturnValue(
			mockRouter
		);

		// Mock the useQuery hook
		const mockUseQuery = jest.fn().mockReturnValue({
			data: null,
			loading: false,
			error: null,
			client: {
				clearStore: jest.fn(),
			},
		});
		jest.spyOn(require("@apollo/client"), "useQuery").mockImplementation(
			mockUseQuery
		);

		// Render the component
		render(<Header />);

		// Assert
		expect(
			screen.getByText("No se pudo obtener la información del usuario.")
		).toBeInTheDocument();
	});
});
