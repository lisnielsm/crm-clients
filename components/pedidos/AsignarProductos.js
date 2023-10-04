import { gql, useQuery } from "@apollo/client";
import React, { useContext } from "react";
import Select from "react-select";

import PedidoContext from "../../context/pedidos/PedidoContext";

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

const AsignarProductos = () => {
	const pedidoContext = useContext(PedidoContext);
	const { agregarProductos } = pedidoContext;

	const { data, loading, error } = useQuery(OBTENER_PRODUCTOS, {
		fetchPolicy: "cache-and-network",
	});

	const seleccionarProductos = (productos) => {
		const nuevosProductos = productos.map((producto) => ({
			...producto,
			cantidad: 0,
		}));

		agregarProductos(nuevosProductos);
	};

	return (
		<>
			<p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
				2.- Selecciona o busca los productos
			</p>
			<Select
				id="asignarProductos"
				instanceId="asignarProductos"
				className="mt-3"
				options={data?.obtenerProductos || []}
				onChange={(opcion) => seleccionarProductos(opcion)}
				getOptionValue={(opciones) => opciones.id}
				getOptionLabel={(opciones) =>
					`${opciones.nombre} - ${opciones.existencia} Disponibles`
				}
				placeholder="Busque o Seleccione el Producto"
				noOptionsMessage={() => "No hay resultados"}
				isMulti={true}
			/>
		</>
	);
};

export default AsignarProductos;
