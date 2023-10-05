import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React from "react";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";

import Layout from "../components/Layout";
import AsignarCliente from "../components/pedidos/AsignarCliente";
import AsignarProductos from "../components/pedidos/AsignarProductos";
import ResumenPedido from "../components/pedidos/ResumenPedido";
import Total from "../components/pedidos/Total";
import { cliente, productos, total, limpiarPedido } from "../slices/pedidoSlice";

const NUEVO_PEDIDO = gql`
	mutation nuevoPedido($input: PedidoInput) {
		nuevoPedido(input: $input) {
			id
		}
	}
`;

const OBTENER_PEDIDOS = gql`
	query obtenerPedidosVendedor {
		obtenerPedidosVendedor {
			id
			pedido {
				id
				cantidad
				nombre
			}
			cliente {
				id
				nombre
				apellido
				email
				telefono
			}
			vendedor
			total
			estado
		}
	}
`;

const NuevoPedido = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const client = useSelector(cliente);
	const products = useSelector(productos);
	const currentTotal = useSelector(total);

	const [mensaje, setMensaje] = React.useState(null);

	// Query para obtener los pedidos
	const { data } = useQuery(OBTENER_PEDIDOS);

	// Mutation para crear un nuevo pedido
	const [nuevoPedido] = useMutation(NUEVO_PEDIDO, {
		update(cache, { data: { nuevoPedido } }) {
			const { obtenerPedidosVendedor } = cache.readQuery({
				query: OBTENER_PEDIDOS,
			});

			cache.writeQuery({
				query: OBTENER_PEDIDOS,
				data: {
					obtenerPedidosVendedor: [
						...obtenerPedidosVendedor,
						nuevoPedido,
					],
				},
			});
		},
	});

	const validarPedido = () => {
		return !products.every((producto) => producto.cantidad > 0) ||
			client.length === 0 ||
			currentTotal === 0
			? "opacity-50 cursor-not-allowed"
			: "";
	};

	const crearNuevoPedido = async () => {
		const { id } = client;

		// Remover lo no deseado de productos
		const pedido = products.map(
			({ __typename, existencia, ...producto }) => producto
		);

		try {
			const { data } = await nuevoPedido({
				variables: {
					input: {
						cliente: id,
						total: currentTotal,
						pedido,
					},
				},
			});

			// Redireccionar
			router.push("/pedidos");

			// Mostrar alerta
			Swal.fire(
				"Correcto",
				"El pedido se registró correctamente",
				"success"
			);
		} catch (error) {
			setMensaje(error.message.replace("GraphQL error: ", ""));
			setTimeout(() => {
				setMensaje(null);
			}, 3000);
		}
	};

	const onBackClick = () => {
		dispatch(limpiarPedido());
		router.push("/pedidos");
	};

	const mostrarMensaje = () => {
		return (
			<div className="bg-white py-2 px-3 w-full my-3 max-w-lg text-center mx-auto">
				<p className="text-red-500">{mensaje}</p>
			</div>
		);
	};

	return (
		<Layout>
			<h1 className="text-2xl text-gray-800">Crear Nuevo Pedido</h1>

			{mensaje && mostrarMensaje()}

			<div className="flex justify-center mt-5">
				<div className="w-full max-w-lg">
					<AsignarCliente />
					<AsignarProductos />
					<ResumenPedido />
					<Total />

					<div className="flex flex-col sm:flex-row justify-between mt-5 gap-4">
						<button
							type="button"
							className="w-full bg-white text-gray-600 p-2 border-2 border-gray-400 rounded uppercase font-bold hover:border-blue-600"
							onClick={onBackClick}
						>
							Regresar
						</button>
						<button
							type="button"
							className={`bg-gray-800 w-full p-2 text-white uppercase font-bold hover:bg-gray-900 ${validarPedido()}`}
							onClick={crearNuevoPedido}
						>
							Registrar Pedido
						</button>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default NuevoPedido;
