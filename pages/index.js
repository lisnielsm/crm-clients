import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";

import Cliente from "../components/Cliente";
import ClienteResponsive from "../components/ClienteResponsive";
import Layout from "../components/Layout";

const OBTENER_CLIENTE_USUARIO = gql`
	query obtenerClientesVendedor {
		obtenerClientesVendedor {
			id
			nombre
			apellido
			empresa
			email
			telefono
		}
	}
`;

export default function Index() {
	const { data, loading, error } = useQuery(OBTENER_CLIENTE_USUARIO);

	const router = useRouter();

	if (data && !data.obtenerClientesVendedor && !loading) {
		router.push("/login");
	}

	if(loading ) {
		return (
			<Layout>
				<h1 className="text-2xl text-gray-800">Clientes</h1>
			</Layout>
		)
	}

	if(error) {
		return (
			<Layout>
				<h1 className="text-2xl text-gray-800">Clientes</h1>
				<p className="mt-5 text-center text-xl">Ocurrió un error al cargar los clientes</p>
			</Layout>
		)
	}

	return (
		<div>
			<Layout>
				<h1 className="text-2xl text-gray-800">Clientes</h1>

				<Link href="/nuevocliente">
					<button
						type="button"
						className="flex justify-center items-center text-sm bg-blue-800 py-2 px-4 mt-4 text-white rounded uppercase font-bold hover:bg-blue-600 w-full sm:w-auto"
					>
						Nuevo Cliente
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

				{data.obtenerClientesVendedor && data.obtenerClientesVendedor.length > 0 ? (
					<>
						<div className="hidden lg:block">
							<table className="table-auto shadow-md mt-10 w-full w-lg">
								<thead className="bg-gray-800">
									<tr className="text-white">
										<th className="w-1/4 py-2 border-r-white border-r-2">
											Nombre
										</th>
										<th className="w-1/4 py-2 border-r-white border-r-2">
											Empresa
										</th>
										<th className="w-1/4 py-2 border-r-white border-r-2">
											Email
										</th>
										<th className="w-1/4 py-2">
											Opciones
										</th>
									</tr>
								</thead>

								<tbody className="bg-white">
									{data.obtenerClientesVendedor.map(
										(cliente) => (
											<Cliente
												key={cliente.id}
												cliente={cliente}
											/>
										)
									)}
								</tbody>
							</table>
						</div>

						<div className="block lg:hidden">
							{data.obtenerClientesVendedor.map((cliente) => (
								<ClienteResponsive
									key={cliente.id}
									cliente={cliente}
								/>
							))}
						</div>
					</>
				) : (
					<p className="mt-5 text-center text-xl">
						Aún no tienes clientes
					</p>
				)}
			</Layout>
		</div>
	);
}
