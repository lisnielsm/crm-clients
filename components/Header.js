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

const Header = () => {
	const dispatch = useDispatch();
	const open = useSelector(openMenuState);

	const router = useRouter();

	const { data, loading, error, client } = useQuery(OBTENER_USUARIO);

	if (error) {
		return <p>{error.message}</p>;
	}

	const user = data?.obtenerUsuario;

	if (!user && !loading) {
		router.push("/login");
	}

	const cerrarSesion = async () => {
		localStorage.removeItem("token");
		// Borra la cache en el servidor del cliente logueado
		await client.clearStore();
		router.push("/login");
	};

	return (
		<div className="flex justify-between items-center mb-6">
			{!loading && user ? (
				<p>
					Hola{" "}
					<span className="font-bold">
						{user.nombre} {user.apellido}
					</span>
				</p>
			) : (
				<p>No se pudo obtener la información del usuario.</p>
			)}

			<button
				type="button"
				aria-label="Cerrar Sesion"
				className="hidden sm:flex justify-center bg-blue-800 hover:bg-blue-600 w-full sm:w-auto font-bold uppercase text-xs rounded p-2 text-white shadow-md mt-2 sm:mt-0"
				onClick={() => cerrarSesion()}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth="1.5"
					stroke="currentColor"
					className="w-4 h-4 mr-2"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
					/>
				</svg>
				Cerrar Sesión
			</button>

			<button
				type="button"
				aria-label="Abrir Menu"
				className={`inline-flex sm:hidden text-gray-800 border-gray-800 border-[1px] rounded p-2 shadow-md duration-300 ${open && "scale-0" }`}
				onClick={() => dispatch(setOpenMenuState(true))}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="w-6 h-6"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
					/>
				</svg>
			</button>
		</div>
	);
};

export default Header;
