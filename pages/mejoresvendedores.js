import { gql, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import Layout from "../components/Layout";

const MEJORES_VENDEDORES = gql`
	query mejoresVendedores {
		mejoresVendedores {
			vendedor {
				nombre
				email
			}
			total
		}
	}
`;

const MejoresVendedores = () => {
	const { data, loading, error, startPolling, stopPolling } =
		useQuery(MEJORES_VENDEDORES);

	useEffect(() => {
		startPolling(1000);
		return () => {
			stopPolling();
		};
	}, [startPolling, stopPolling]);

	if (loading) {
		return (
			<Layout>
				<h1 className="text-2xl text-gray-800">Mejores Vendedores</h1>
			</Layout>
		);
	}

	if (error) {
		return (
			<Layout>
				<h1 className="text-2xl text-gray-800">Mejores Vendedores</h1>
				<p className="mt-5 text-center text-xl">
					Ocurrió un error al cargar los vendedores
				</p>
			</Layout>
		);
	}

	const { mejoresVendedores } = data;

	const vendedorGrafica = [];

	mejoresVendedores.forEach((vendedor, index) => {
		vendedorGrafica[index] = {
			...vendedor.vendedor[0],
			Total: vendedor.total,
		};
	});

	return (
		<Layout>
			<h1 className="text-2xl text-gray-800">Mejores Vendedores</h1>

			{vendedorGrafica.length > 0 ? (
				<div className="mt-10" style={{ height: 500, maxWidth: 600 }}>
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							data={vendedorGrafica}
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
			) : (
				<p className="mt-5 text-center text-xl">No hay vendedores</p>
			)}
		</Layout>
	);
};

export default MejoresVendedores;
