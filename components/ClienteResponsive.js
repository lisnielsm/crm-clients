import { gql, useMutation } from "@apollo/client";
import Router from "next/router";
import React from "react";
import Swal from "sweetalert2";

const ELIMINAR_CLIENTE = gql`
	mutation eliminarCliente($id: ID!) {
		eliminarCliente(id: $id)
	}
`;

const OBTENER_CLIENTE_USUARIO = gql`
	query obtenerClientesVendedor {
		obtenerClientesVendedor {
			id
			nombre
			apellido
			empresa
			email
			telefono
		}
	}
`;

const ClienteResponsive = ({ cliente }) => {
	const { id, nombre, apellido, empresa, email, telefono } = cliente;

	// mutation para eliminar cliente
	const [eliminarCliente] = useMutation(ELIMINAR_CLIENTE, {
		update(cache) {
			// obtener copia de cache
			const { obtenerClientesVendedor } = cache.readQuery({
				query: OBTENER_CLIENTE_USUARIO,
			});

			// reescribir el cache
			cache.writeQuery({
				query: OBTENER_CLIENTE_USUARIO,
				data: {
					obtenerClientesVendedor: obtenerClientesVendedor.filter(
						(clienteActual) => clienteActual.id !== id
					),
				},
			});
		},
	});

	const confirmarEliminarCliente = () => {
		// preguntar al usuario
		Swal.fire({
			title: "¿Deseas eliminar a este cliente?",
			text: "Esta acción no se puede deshacer",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, Eliminar",
			cancelButtonText: "Cancelar",
		}).then(async (result) => {
			if (result.value) {
				const { data } = await eliminarCliente({
					variables: {
						id,
					},
				});

				Swal.fire("Eliminado!", data.eliminarCliente, "success");
			}
		});
	};

	const editarCliente = () => {
		Router.push({
			pathname: "/editarcliente/[id]",
			query: { id },
		});
	};

	return (
		<div className="bg-white shadow-md p-6 mt-6 border-t-4 border-gray-800">
			<p className="flex items-center mb-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="w-5 h-5 mr-2"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
					/>
				</svg>
				{`${nombre} ${apellido}`}
			</p>
			<p className="flex items-center mb-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="w-5 h-5 mr-2"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
					/>
				</svg>
				{empresa}
			</p>
			<p className="flex items-center mb-2">
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
						d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
					/>
				</svg>
				{email}
			</p>
			{telefono ? (
				<p className="flex items-center mb-2">
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
							d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
						/>
					</svg>
					{telefono}
				</p>
			) : null}

			<div className="flex flex-col sm:flex-row gap-2 mt-5">
				<button
					type="button"
					className="flex justify-center w-full mr-2 bg-red-800 p-2 text-white font-bold rounded text-xs uppercase hover:bg-red-600"
					onClick={confirmarEliminarCliente}
				>
					Eliminar
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-4 h-4 ml-2"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
						/>
					</svg>
				</button>

				<button
					type="button"
					className="flex justify-center w-full p-2 border-2 rounded font-bold text-xs uppercase hover:bg-gray-200"
					onClick={editarCliente}
				>
					Editar
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
						className="w-4 h-4 ml-2"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
};

export default ClienteResponsive;
