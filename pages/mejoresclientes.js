import { gql, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import {
	Bar, BarChart, CartesianGrid, Legend,
	ResponsiveContainer, Tooltip, XAxis,
	YAxis
} from "recharts";

import Layout from "../components/Layout";

const MEJORES_CLIENTES = gql`
	query mejoresClientes {
		mejoresClientes {
			cliente {
				nombre
				empresa
			}
			total
		}
	}
`;

const MejoresClientes = () => {
	const { data, loading, error, startPolling, stopPolling } = useQuery(MEJORES_CLIENTES);

    useEffect(() => {
        startPolling(1000);
        return () => {
            stopPolling();
        }
    }, [startPolling, stopPolling])

	if (loading) {
		return (
			<Layout>
				<h1 className="text-2xl text-gray-800">Mejores Clientes</h1>
			</Layout>
		);
	}

    const { mejoresClientes } = data;

	const clienteGrafica = [];

	mejoresClientes.forEach((cliente, index) => {
		clienteGrafica[index] = {
			...cliente.cliente[0],
			Total: cliente.total,
		};
	});

	return (
		<Layout>
			<h1 className="text-2xl text-gray-800">Mejores Clientes</h1>

			<div className="mt-10" style={{ height: 500, maxWidth: 600 }}>
				<ResponsiveContainer width="100%" height="100%">
					<BarChart
						data={clienteGrafica}
						margin={{
							top: 5,
							right: 30,
							left: 20,
							bottom: 5,
						}}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="nombre" />
						<YAxis />
						<Tooltip />
						<Legend />
						<Bar dataKey="Total" fill="#3182CE" />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</Layout>
	);
};

export default MejoresClientes;
