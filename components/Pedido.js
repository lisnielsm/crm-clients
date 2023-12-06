import { gql, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const ACTUALIZAR_PEDIDO = gql`
	mutation actualizarPedido($id: ID!, $input: PedidoInput) {
		actualizarPedido(id: $id, input: $input) {
			estado
		}
	}
`;

const ELIMINAR_PEDIDO = gql`
    mutation eliminarPedido($id: ID!) {
        eliminarPedido(id: $id)
    }
`;

const OBTENER_PEDIDOS = gql`
	query obtenerPedidosVendedor {
		obtenerPedidosVendedor {
			id
		}
	}
`;

const Pedido = ({ pedido }) => {
	const {
		id,
		total,
		estado,
        cliente,
	} = pedido;

	const [estadoPedido, setEstadoPedido] = useState(estado);
	const [clase, setClase] = useState("");

	// Mutation para cambiar el estado de un pedido
	const [actualizarPedido] = useMutation(ACTUALIZAR_PEDIDO);

    // Mutation para eliminar un pedido
    const [eliminarPedido] = useMutation(ELIMINAR_PEDIDO, {
        update(cache) {
            const { obtenerPedidosVendedor } = cache.readQuery({
                query: OBTENER_PEDIDOS
            });

            cache.writeQuery({
                query: OBTENER_PEDIDOS,
                data: {
                    obtenerPedidosVendedor: obtenerPedidosVendedor.filter( pedidoActual => pedidoActual.id !== id )
                }
            })
        }
    });

	useEffect(() => {
		cambiarColor(estadoPedido);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if(!cliente) return null;

	const { nombre, apellido, email, telefono } = cliente;

	// Función que modifica el color del pedido de acuerdo a su estado
	const cambiarColor = (nuevoEstadoPedido) => {
		if (nuevoEstadoPedido === "PENDIENTE") {
			setClase("border-yellow-500");
		} else if (nuevoEstadoPedido === "COMPLETADO") {
			setClase("border-green-500");
		} else {
			setClase("border-red-800");
		}
	};

	const cambiarEstadoPedido = async (nuevoEstado) => {
		try {
			const { data } = await actualizarPedido({
				variables: {
					id,
					input: {
						estado: nuevoEstado,
						cliente: cliente.id,
						pedido: pedido.pedido.map((producto) => {
							return {
								id: producto.id,
								cantidad: producto.cantidad,
							};
						}),
					},
				},
			});

            setEstadoPedido(data.actualizarPedido.estado);
		    cambiarColor(data.actualizarPedido.estado);
		} catch (error) {
			console.log(error);
		}
	};

    const confirmarEliminarPedido = () => {
        Swal.fire({
            title: "¿Deseas eliminar este pedido?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "!Sí, eliminar!",
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Eliminar por ID
                    const { data } = await eliminarPedido({
                        variables: {
                            id,
                        },
                    });

                    // Mostrar una alerta
                    Swal.fire("Eliminado", data.eliminarPedido, "success");
                } catch (error) {
                    console.log(error);
                }
            }
        });
    };

	return (
		<main
			className={`${clase} border-t-4 mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 shadow-lg`}
		>
			<div className="flex flex-col justify-between mb-4 md:mb-0">
				<div>
					<p className="font-bold text-gray-800">
						Cliente: {nombre} {apellido}
					</p>

					{email ? (
						<p className="flex items-center my-2">
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
									d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
								/>
							</svg>
							{email}
						</p>
					) : null}

					{telefono ? (
						<p className="flex items-center my-2">
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
									d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
								/>
							</svg>
							{telefono}
						</p>
					) : null}
				</div>

				<div>
					<p className="font-bold text-gray-800">Estado Pedido:</p>
					<select
						className="mt-2 bg-blue-600 border border-blue-600 text-white p-2 text-center rounded focus:outline-none focus:bg-blue-600 focus:border-blue-500 uppercase text-xs font-bold"
						value={estadoPedido}
						disabled={estadoPedido === "CANCELADO"}
						onChange={(e) => cambiarEstadoPedido(e.target.value)}
					>
						<option
							className="bg-white py-2 text-gray-800"
							value="COMPLETADO"
						>
							COMPLETADO
						</option>
						<option
							className="bg-white py-2 text-gray-800"
							value="PENDIENTE"
						>
							PENDIENTE
						</option>
						<option
							className="bg-white py-2 text-gray-800"
							value="CANCELADO"
						>
							CANCELADO
						</option>
					</select>	
				</div>
			</div>

			<div>
				<h2 className="text-gray-800 font-bold">Resumen del Pedido</h2>
				{pedido.pedido.map((articulo) => (
					<div key={articulo.id} className="mt-4">
						<p className="text-sm text-gray-600">
							Producto: {articulo.nombre}
						</p>
						<p className="text-sm text-gray-600">
							Cantidad: {articulo.cantidad}
						</p>
					</div>
				))}
				<p className="text-gray-800 mt-3 font-bold">
					Total a pagar:
					<span className="font-light"> $ {total}</span>
				</p>

				<button
					className="uppercase text-xs font-bold inline-flex items-center mt-4 bg-red-800 px-4 py-2 text-white rounded leading-tight hover:bg-red-600"
					onClick={confirmarEliminarPedido}
				>
					Eliminar Pedido
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
			</div>
		</main>
	);
};

export default Pedido;
