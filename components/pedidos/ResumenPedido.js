import React from "react";
import { useSelector } from "react-redux";

import { productos } from "../../slices/pedidoSlice"; 
import ProductoResumen from "./ProductoResumen";

const ResumenPedido = () => {
	const products = useSelector(productos);

	return (
		<>
			<p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
				3.- Ajusta las cantidades del producto
			</p>

			{products.length > 0 ? (
				products.map((producto) => (
					<ProductoResumen key={producto.id} producto={producto} />
				))
			) : (
				<p className="mt-5 text-sm">Aún no hay productos</p>
			)}
		</>
	);
};

export default ResumenPedido;
