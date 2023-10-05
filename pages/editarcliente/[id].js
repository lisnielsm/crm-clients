import { gql, useMutation, useQuery } from "@apollo/client";
import { Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import Swal from "sweetalert2";
import * as Yup from "yup";
import Layout from "../../components/Layout";

const OBTENER_CLIENTE = gql`
	query obtenerCliente($id: ID!) {
		obtenerCliente(id: $id) {
			nombre
			apellido
			empresa
			email
			telefono
		}
	}
`;

const ACTUALIZAR_CLIENTE = gql`
	mutation actualizarCliente($id: ID!, $input: ClienteInput) {
		actualizarCliente(id: $id, input: $input) {
			id
			nombre
			apellido
			empresa
			email
			telefono
		}
	}
`;

const EditarCliente = () => {
	//obtener el ID actual
	const router = useRouter();
	const { query: { id } } = router;

	// Consultar para obtener el cliente
	const { data, loading, error } = useQuery(OBTENER_CLIENTE, {
		variables: {
			id: id || "",
		},
		fetchPolicy: "network-only",
	});

	// Actualizar el cliente
	const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE);

	const [mensaje, setMensaje] = React.useState(null);

	// Schema de validacion
	const schemaValidacion = Yup.object({
		nombre: Yup.string().required("El nombre del cliente es obligatorio"),
		apellido: Yup.string().required(
			"El apellido del cliente es obligatorio"
		),
		empresa: Yup.string().required("La campo empresa es obligatorio"),
		email: Yup.string()
			.email("El email del cliente no es valido")
			.required("El email del cliente es obligatorio"),
	});

	const initialValues = {
		nombre: data?.obtenerCliente?.nombre || "",
		apellido: data?.obtenerCliente?.apellido || "",
		empresa: data?.obtenerCliente?.empresa || "",
		email: data?.obtenerCliente?.email || "",
		telefono: data?.obtenerCliente?.telefono || "",
	};

	// Modifica el cliente en la BD
	const actualizarInfoCliente = async (valores) => {
		const { nombre, apellido, empresa, email, telefono } = valores;

		try {
			const { data } = await actualizarCliente({
				variables: {
					id,
					input: {
						nombre,
						apellido,
						empresa,
						email,
						telefono,
					},
				},
			});

			// Mostrar alerta
			Swal.fire(
				"Actualizado",
				"El cliente se actualizo correctamente",
				"success"
			);

			// Redireccionar
			router.push("/clientes");
		} catch (error) {
			console.log(error);
			setMensaje("Hubo un error al actualizar el cliente");
			setTimeout(() => {
				setMensaje(null);
			}, 3000);
		}
	};

	const mostrarMensaje = () => {
		return (
			<div className="bg-white  py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
				<p className="text-red-500">{mensaje}</p>
			</div>
		);
	};

	if(loading ) {
		return (
			<Layout>
				<h1 className="text-2xl text-gray-800">Editar Cliente</h1>
			</Layout>
		)
	}

	if(error) {
		return (
			<Layout>
				<h1 className="text-2xl text-gray-800">Editar Cliente</h1>
				<p className="mt-5 text-center text-xl">Ocurrió un error al cargar el cliente</p>
			</Layout>
		)
	}

	return (
		<Layout>
			<h1 className="text-2xl text-gray-800">Editar Cliente</h1>

			{mensaje && mostrarMensaje()}

			<main className="flex justify-center mt-5">
				<div className="w-full max-w-lg">
					<Formik
						validationSchema={schemaValidacion}
						enableReinitialize={true}
						initialValues={initialValues}
						onSubmit={(valores) => {
							actualizarInfoCliente(valores);
						}}
					>
						{(props) => {
							return (
								<form
									className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
									onSubmit={props.handleSubmit}
								>
									<div className="mb-4">
										<label
											className="block text-gray-700 text-sm font-bold mb-2"
											htmlFor="nombre"
										>
											Nombre
										</label>

										<input
											type="text"
											className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
											id="nombre"
											placeholder="Nombre Cliente"
											value={props.values.nombre}
											onChange={props.handleChange}
											onBlur={props.handleBlur}
										/>
									</div>

									{props.touched.nombre &&
									props.errors.nombre ? (
										<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
											<p className="font-bold">Error</p>
											<p>{props.errors.nombre}</p>
										</div>
									) : null}

									<div className="mb-4">
										<label
											className="block text-gray-700 text-sm font-bold mb-2"
											htmlFor="apellido"
										>
											Apellido
										</label>

										<input
											type="text"
											className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
											id="apellido"
											placeholder="Apellido Cliente"
											value={props.values.apellido}
											onChange={props.handleChange}
											onBlur={props.handleBlur}
										/>
									</div>

									{props.touched.apellido &&
									props.errors.apellido ? (
										<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
											<p className="font-bold">Error</p>
											<p>{props.errors.apellido}</p>
										</div>
									) : null}

									<div className="mb-4">
										<label
											className="block text-gray-700 text-sm font-bold mb-2"
											htmlFor="empresa"
										>
											Empresa
										</label>

										<input
											type="text"
											className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
											id="empresa"
											placeholder="Empresa Cliente"
											value={props.values.empresa}
											onChange={props.handleChange}
											onBlur={props.handleBlur}
										/>
									</div>

									{props.touched.empresa &&
									props.errors.empresa ? (
										<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
											<p className="font-bold">Error</p>
											<p>{props.errors.empresa}</p>
										</div>
									) : null}

									<div className="mb-4">
										<label
											className="block text-gray-700 text-sm font-bold mb-2"
											htmlFor="email"
										>
											Email
										</label>

										<input
											type="email"
											className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
											id="email"
											placeholder="Email Cliente"
											value={props.values.email}
											onChange={props.handleChange}
											onBlur={props.handleBlur}
										/>
									</div>

									{props.touched.email &&
									props.errors.email ? (
										<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
											<p className="font-bold">Error</p>
											<p>{props.errors.email}</p>
										</div>
									) : null}

									<div className="mb-4">
										<label
											className="block text-gray-700 text-sm font-bold mb-2"
											htmlFor="telefono"
										>
											Teléfono
										</label>

										<input
											type="tel"
											className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
											id="telefono"
											placeholder="Teléfono Cliente"
											value={props.values.telefono}
											onChange={props.handleChange}
											onBlur={props.handleBlur}
										/>
									</div>

									<div className="flex flex-col sm:flex-row justify-between mt-5 gap-4">
										<button
											type="button"
											className="w-full text-gray-600 p-2 border-2 rounded uppercase font-bold hover:bg-gray-200"
											onClick={() => router.push("/clientes")}
										>
											Regresar
										</button>
										<button
											type="submit"
											className="bg-gray-800 w-full p-2 text-white uppercase font-bold hover:bg-gray-900"
										>
											Editar Cliente
										</button>
									</div>
								</form>
							);
						}}
					</Formik>
				</div>
			</main>
		</Layout>
	);
};

export default EditarCliente;
