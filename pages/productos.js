import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import React from "react";

import Layout from "../components/Layout";
import Producto from "../components/Producto";
import ProductoResponsive from "../components/ProductoResponsive";

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

const Productos = () => {
	// Consultar los productos
	const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);

	if (loading) {
		return (
			<Layout>
				<h1 className="text-2xl text-gray-800">Productos</h1>
			</Layout>
		);
	}

	if (error) {
		return (
			<Layout>
				<h1 className="text-2xl text-gray-800">Productos</h1>
				<p className="mt-5 text-center text-xl">
					Ocurrió un error al cargar los Productos
				</p>
			</Layout>
		);
	}

	return (
		<div>
			<Layout>
				<h1 className="text-2xl text-gray-800">Productos</h1>

				<Link href="/nuevoproducto">
					<button
						type="button"
						className="flex justify-center items-center mt-4 text-sm bg-blue-800 py-2 px-4 text-white rounded uppercase font-bold hover:bg-blue-600"
					>
						Nuevo Producto
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

				{data.obtenerProductos && data.obtenerProductos.length > 0 ? (
					<>
						<div className="hidden lg:block">
							<table className="table-auto shadow-md mt-10 w-full w-lg">
								<thead className="bg-gray-800">
									<tr className="text-white">
										<th className="w-1/4 py-2 border-r-white border-r-2">
											Nombre
										</th>
										<th className="w-1/4 py-2 border-r-white border-r-2">
											Existencia
										</th>
										<th className="w-1/4 py-2 border-r-white border-r-2">
											Precio
										</th>
										<th className="w-1/4 py-2">Opciones</th>
									</tr>
								</thead>

								<tbody className="bg-white">
									{data.obtenerProductos.map((producto) => (
										<Producto
											key={producto.id}
											producto={producto}
										/>
									))}
								</tbody>
							</table>
						</div>

						<div className="block lg:hidden">
							{data.obtenerProductos.map((producto) => (
								<ProductoResponsive
									key={producto.id}
									producto={producto}
								/>
							))}
						</div>
					</>
				) : (
					<p className="mt-5 text-center text-xl">
						Aún no hay productos
					</p>
				)}
			</Layout>
		</div>
	);
};

export default Productos;
