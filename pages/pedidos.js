import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import React from "react";

import Layout from "../components/Layout";
import Pedido from "../components/Pedido";

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

const Pedidos = () => {
	const { data, loading, error } = useQuery(OBTENER_PEDIDOS);

	return (
		<div>
			<Layout>
				<h1 className="text-2xl text-gray-800">Pedidos</h1>

				<Link href="/nuevopedido">
					<button
						type="button"
						className="flex justify-center items-center mt-4 text-sm bg-blue-800 py-2 px-4 text-white rounded uppercase font-bold hover:bg-blue-600 w-full sm:w-auto"
					>
						Nuevo Pedido
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth="1.5"
							stroke="currentColor"
							className="w-4 h-4 ml-2 stroke-white"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 4.5v15m7.5-7.5h-15"
							/>
						</svg>
					</button>
				</Link>

				{loading ? (
					<p>Cargando...</p>
				) : data?.obtenerPedidosVendedor?.length === 0 ? (
					<p className="mt-5 text-center text-2xl">No hay pedidos aún</p>
				) : (
					data?.obtenerPedidosVendedor?.map((pedido) => (
						<Pedido
							key={pedido.id}
							pedido={pedido}
						/>
					))
				)}
			</Layout>
		</div>
	);
};

export default Pedidos;
