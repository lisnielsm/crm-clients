import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { openMenuState, setOpenMenuState } from "../slices/layoutSlice";

const OBTENER_USUARIO = gql`
	query obtenerUsuario {
		obtenerUsuario {
			id
			nombre
			apellido
		}
	}
`;

const Sidebar = () => {
	const dispatch = useDispatch();
	const open = useSelector(openMenuState);

	// Routing de next
	const router = useRouter();

	const { client } = useQuery(OBTENER_USUARIO);

	const cerrarSesion = async () => {
		localStorage.removeItem("token");
		// Borra la cache en el servidor del cliente logueado
		await client.clearStore();
		router.push("/login");
	};

	const navegarAlLink = (link) => {
		dispatch(setOpenMenuState(false));
		setTimeout(() => {
			router.push(link);
		}, 300);
	};

	const opcionesMenu = () => {
		return (
			<>
				<div className="flex justify-between items-center">
					<p className="text-white text-2xl font-black">
						CRM Clientes
					</p>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-7 h-7 inline-block sm:hidden cursor-pointer"
						onClick={() => dispatch(setOpenMenuState(false))}
					>
						<path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</div>

				<nav>
					<div className="mt-5 list-none">
						<li
							className={
								router.pathname === "/"
									? "bg-blue-800 rounded-md mb-2"
									: "rounded-md mb-2 hover:bg-blue-800"
							}
						>
							<button
								type="button"
								className="text-white w-full text-left p-2"
								onClick={() => navegarAlLink("/")}
							>
								<span>Clientes</span>
							</button>
						</li>
						<li
							className={
								router.pathname === "/pedidos"
									? "bg-blue-800 rounded-md mb-2"
									: "rounded-md mb-2 hover:bg-blue-800"
							}
						>
							<button
								type="button"
								className="text-white w-full text-left p-2"
								onClick={() => navegarAlLink("/pedidos")}
							>
								<span>Pedidos</span>
							</button>
						</li>
						<li
							className={
								router.pathname === "/productos"
									? "bg-blue-800 rounded-md mb-2"
									: "rounded-md mb-2 hover:bg-blue-800"
							}
						>
							<button
								type="button"
								className="text-white w-full text-left p-2"
								onClick={() => navegarAlLink("/productos")}
							>
								<span>Productos</span>
							</button>
						</li>
					</div>
				</nav>

				<div className="sm:mt-10">
					<p className="text-white text-2xl font-black">
						Otras Opciones
					</p>
				</div>
				<nav>
					<div className="mt-5 list-none">
						<li
							className={
								router.pathname === "/mejoresvendedores"
									? "bg-blue-800 rounded-md mb-2"
									: "rounded-md mb-2 hover:bg-blue-800"
							}
						>
							<button
								type="button"
								className="text-white w-full text-left p-2"
								onClick={() => navegarAlLink("/mejoresvendedores")}
							>
								<span>Mejores Vendedores</span>
							</button>
						</li>
						<li
							className={
								router.pathname === "/mejoresclientes"
									? "bg-blue-800 rounded-md mb-2"
									: "rounded-md mb-2 hover:bg-blue-800"
							}
						>
							<button
								type="button"
								className="text-white w-full text-left p-2"
								onClick={() => navegarAlLink("/mejoresclientes")}
							>
								<span>Mejores Clientes</span>
							</button>
						</li>
						<li className="block sm:hidden rounded-md mb-2 hover:bg-blue-800">
							<button
								type="button"
								className="flex items-center text-white w-full text-left p-2"
								onClick={() => cerrarSesion()}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="currentColor"
									className="w-5 h-5 mr-2"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
									/>
								</svg>
								Cerrar Sesión
							</button>
						</li>
					</div>
				</nav>
			</>
		);
	};

	return (
		<>
		<aside
			className={`fixed top-0 left-0 h-full sm:hidden duration-300 z-50
				${ open ? "translate-x-0" : "-translate-x-full"	}
				w-full sm:min-w-[250px] sm:w-[250px] bg-gray-800  text-white sm:min-h-screen p-5`}
		>
			{opcionesMenu()}
		</aside>
		<aside
			className={`hidden sm:block h-full sm:h-auto w-full sm:min-w-[250px] sm:w-[250px] bg-gray-800  text-white sm:min-h-screen p-5`}
		>
			{opcionesMenu()}
		</aside>
		</>
	);
};

export default Sidebar;
