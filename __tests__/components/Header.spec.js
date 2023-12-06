import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@apollo/client";
import { Provider } from "react-redux";
import { RouterContext } from "next/dist/shared/lib/router-context";

import Header from "../../components/Header";
import { setOpenMenuState } from "../../slices/layoutSlice";
import { store } from "../../store";
import { createMockRouter } from "../../utils";

jest.mock("react-redux", () => ({
	...jest.requireActual("react-redux"),
	useDispatch: jest.fn(),
	useSelector: jest.fn(),
}));

jest.mock("@apollo/client", () => ({
	...jest.requireActual("@apollo/client"),
	useQuery: jest.fn(),
}));

describe("Test Header Component", () => {
	// const { location } = window;

	// beforeAll(() => {
	// 	delete window.location;
	// 	window.location = { assign: jest.fn() };
	// });

	// afterAll(() => {
	// 	window.location = location;
	// });

	// Renders user name if user is logged in and data is loaded
	it("should render user name when user is logged in and data is loaded", () => {
		// Mock the useRouter hook
		const router = createMockRouter({});
		
		// Mock the useQuery hook
		const mockData = {
			obtenerUsuario: {
				id: 1,
				nombre: "John",
				apellido: "Doe",
			},
		};
		const mockUseQuery = {
			data: mockData,
			loading: false,
			error: null,
			client: {
				clearStore: jest.fn(),
			},
		};

		useQuery.mockReturnValue(mockUseQuery);

		// const mockUseQuery = jest.fn().mockReturnValue({
		// 	data: mockData,
		// 	loading: false,
		// 	error: null,
		// 	client: {
		// 		clearStore: jest.fn(),
		// 	},
		// });

		// jest.spyOn(require("@apollo/client"), "useQuery").mockImplementation(
		// 	mockUseQuery
		// );

		// Render the Header component
		render(
			<Provider store={store}>
				<RouterContext.Provider value={router}>
					<Header />
				</RouterContext.Provider>
			</Provider>
		);

		// Assert that the user name is rendered
		expect(screen.getByText(/Hola/)).toBeInTheDocument();
		expect(screen.getByText(/John Doe/)).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /Cerrar Sesion/ })
		).toBeInTheDocument();
	});

	// Redirects to login page if user is not logged in and data is loaded with router.push
	it("should redirect to login page when user is not logged in and data is loaded with router.push", () => {
		// Mock the useRouter hook
		const router = createMockRouter({});

		// Mock the useQuery hook
		const mockUseQuery = {
			data: null,
			loading: false,
			error: null,
			client: {
				clearStore: jest.fn(),
			},
		};
		useQuery.mockReturnValue(mockUseQuery);

		// Render the Header component
		render(
			<Provider store={store}>
				<RouterContext.Provider value={router}>
					<Header />
				</RouterContext.Provider>
			</Provider>
		);

		// Assert that the window location is set to "/login"
		expect(router.push).toHaveBeenCalledWith("/login");
	});

	// Renders error message if there is an error fetching user data
	it("should render error message if there is an error fetching user data", () => {
		// Mock the useRouter hook
		const router = createMockRouter({});
		
		// Mock useQuery to return an error
		const mockUseQuery = {
			data: null,
			loading: false,
			error: { message: "Error fetching user data" },
			client: {
				clearStore: jest.fn(),
			},
		};

		useQuery.mockReturnValue(mockUseQuery);

		// Render the Header component
		render(
			<Provider store={store}>
				<RouterContext.Provider value={router}>
					<Header />
				</RouterContext.Provider>
			</Provider>
		);

		// Assert that the error message is rendered
		expect(
			screen.getByText(/Error fetching user data/)
		).toBeInTheDocument();
	});

	// Renders error message if user data is not available and data is not loading
	it("should render error message if user data is not available and data is not loading", () => {
		// Mock the useRouter hook
		const router = createMockRouter({});
		
		// Mock useQuery to return null for user data
		const mockUseQuery = {
			data: null,
			loading: false,
			error: null,
			client: {
				clearStore: jest.fn(),
			},
		};

		useQuery.mockReturnValue(mockUseQuery);

		// Render the Header component
		render(
			<Provider store={store}>
				<RouterContext.Provider value={router}>
					<Header />
				</RouterContext.Provider>
			</Provider>
		);

		// Assert that the error message is rendered
		expect(
			screen.getByText(/No se pudo obtener la información del usuario/)
		).toBeInTheDocument();
	});

	it('should log out user when "Cerrar Sesión" button is clicked', async () => {
		// Mock the useRouter hook
		const router = createMockRouter({});

		const mockData = {
			obtenerUsuario: {
				id: 1,
				nombre: "John",
				apellido: "Doe",
			},
		};
		const mockUseQuery = {
			data: mockData,
			loading: false,
			error: null,
			client: {
				clearStore: jest.fn(),
			},
		};

		useQuery.mockReturnValue(mockUseQuery);

		jest.spyOn(Storage.prototype, "removeItem");
		Storage.prototype.removeItem = jest.fn();

		render(
			<Provider store={store}>
				<RouterContext.Provider value={router}>
					<Header />
				</RouterContext.Provider>
			</Provider>
		);

		// Simulate clicking on the "Cerrar Sesión" button
		fireEvent.click(screen.getByRole("button", { name: /cerrar sesion/i }));

		// Assert that the user is logged out
		expect(localStorage.removeItem).toHaveBeenCalledWith("token");
		expect(mockUseQuery.client.clearStore).toHaveBeenCalled();
		expect(router.push).toHaveBeenCalledWith("/login");
	});

	// Opens sidebar when mune button is clicked
	it("should open sidebar when menu button is clicked", () => {
		// Mock the useRouter hook
		const router = createMockRouter({});
		
		// Mock the useQuery hook
		const mockData = {
			obtenerUsuario: {
				id: 1,
				nombre: "John",
				apellido: "Doe",
			},
		};
		const mockUseQuery = {
			data: mockData,
			loading: false,
			error: null,
			client: {
				clearStore: jest.fn(),
			},
		};

		useQuery.mockReturnValue(mockUseQuery);

		const dispatch = jest.fn();
		useDispatch.mockReturnValue(dispatch);

		// Render the component
		render(
			<Provider store={store}>
				<RouterContext.Provider value={router}>
					<Header />
				</RouterContext.Provider>
			</Provider>
		);

		// Click the sidebar button
		fireEvent.click(screen.getByRole("button", { name: /abrir menu/i }));

		// Assert that the menu state is set to open
		expect(dispatch).toHaveBeenCalledWith(setOpenMenuState(true));
	});

	// Opens sidebar when mune button is clicked
	it("should hide menu button when is clicked", () => {
		// Mock the useRouter hook
		const router = createMockRouter({});
		
		// Mock the useQuery hook
		const mockData = {
			obtenerUsuario: {
				id: 1,
				nombre: "John",
				apellido: "Doe",
			},
		};
		const mockUseQuery = {
			data: mockData,
			loading: false,
			error: null,
			client: {
				clearStore: jest.fn(),
			},
		};

		useQuery.mockReturnValue(mockUseQuery);

		useSelector.mockReturnValue(true);

		// Render the component
		render(
			<Provider store={store}>
				<RouterContext.Provider value={router}>
					<Header />
				</RouterContext.Provider>
			</Provider>
		);

		expect(screen.getByRole("button", { name: /abrir menu/i }).getAttribute('class')).toMatch(/scale-0/gi);
	});
});
