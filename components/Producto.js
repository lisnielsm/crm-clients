import { gql, useMutation } from "@apollo/client";
import Router from "next/router";
import React from "react";
import Swal from "sweetalert2";

const ELIMINAR_PRODUCTO = gql`
	mutation eliminarProducto($id: ID!) {
		eliminarProducto(id: $id)
	}
`;

const OBTENER_PRODUCTOS = gql`
	query obtenerProductos {
		obtenerProductos {
			id
			nombre
			precio
			existencia
		}
	}
`;

const Producto = ({ producto }) => {
	const { id, nombre, existencia, precio } = producto;

	// mutation para eliminar producto
	const [eliminarProducto] = useMutation(ELIMINAR_PRODUCTO, {
		update(cache) {
			// obtener copia de cache
			const { obtenerProductos } = cache.readQuery({
				query: OBTENER_PRODUCTOS,
			});

			// reescribir el cache
			cache.writeQuery({
				query: OBTENER_PRODUCTOS,
				data: {
					obtenerProductos: obtenerProductos.filter(
						(productoActual) => productoActual.id !== id
					),
				},
			});
		},
	});

	const confirmarEliminarProducto = () => {
		// preguntar al usuario
		Swal.fire({
			title: "¿Deseas eliminar a este producto?",
			text: "Esta acción no se puede deshacer",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, Eliminar",
			cancelButtonText: "Cancelar",
		}).then(async (result) => {
			if (result.value) {
				const { data } = await eliminarProducto({
					variables: {
						id,
					},
				});

				Swal.fire("Eliminado!", data.eliminarProducto, "success");
			}
		});
	};

	const editarProducto = () => {
		Router.push({
			pathname: "/editarproducto/[id]",
			query: { id },
		});
	};

	return (
		<tr>
			<td className="border px-4 py-2">{nombre}</td>
			<td className="border px-4 py-2 text-center">{existencia}</td>
			<td className="border px-4 py-2 text-center">$ {precio}</td>
			<td className="border px-4 py-2">
				<div className="flex justify-center w-full">
					<button
						type="button"
						className="flex justify-center items-center mr-2 bg-red-800 py-1 px-2 font-bold text-white rounded text-xs uppercase hover:bg-red-600"
						onClick={confirmarEliminarProducto}
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
						className="flex justify-center items-center py-1 px-2 border-2 rounded font-bold text-xs uppercase hover:bg-gray-200"
						onClick={editarProducto}
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
			</td>
		</tr>
	);
};

export default Producto;
