import { gql, useQuery } from "@apollo/client";
import React from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";

import { agregarCliente } from "../../slices/pedidoSlice";

const OBTENER_CLIENTE_USUARIO = gql`
	query obtenerClientesVendedor {
		obtenerClientesVendedor {
			id
			nombre
			apellido
			empresa
			email
		}
	}
`;

const AsignarCliente = () => {
    const dispatch = useDispatch();

    const { data } = useQuery(OBTENER_CLIENTE_USUARIO, {
		fetchPolicy: "cache-and-network",
	});

	const seleccionarCliente = (cliente) => {
		dispatch(agregarCliente(cliente));
	};

	return (
		<>
			<p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
                1.- Asigna un Cliente al pedido
            </p>
            <Select
                id="asignarCliente"
				instanceId="asignarCliente"
				className="mt-3"
				options={data?.obtenerClientesVendedor || []}
				onChange={(opcion) => seleccionarCliente(opcion)}
				getOptionValue={(opciones) => opciones.id}
				getOptionLabel={(opciones) => `${opciones.nombre} ${opciones.apellido}`}
				placeholder="Busque o Seleccione el Cliente"
				noOptionsMessage={() => "No hay resultados"}
				isMulti={false}
			/>
		</>
	);
};

export default AsignarCliente;
