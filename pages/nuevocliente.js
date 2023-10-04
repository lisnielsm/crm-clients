import { gql, useMutation } from "@apollo/client";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import Swal from "sweetalert2";
import * as Yup from "yup";

import Layout from "../components/Layout";

const NUEVO_CLIENTE = gql`
	mutation nuevoCliente($input: ClienteInput) {
		nuevoCliente(input: $input) {
			id
			nombre
			apellido
			empresa
			email
			telefono
		}
	}
`;

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

const NuevoCliente = () => {
	// Mutation para crear nuevos clientes
	const [nuevoCliente] = useMutation(NUEVO_CLIENTE, {
		update(cache, { data: { nuevoCliente } }) {
			// Obtener el objeto de cache que deseamos actualizar
			const { obtenerClientesVendedor } = cache.readQuery({
				query: OBTENER_CLIENTE_USUARIO,
			});

			// Reescribimos el cache (el cache nunca se debe modificar)
			cache.writeQuery({
				query: OBTENER_CLIENTE_USUARIO,
				data: {
					obtenerClientesVendedor: [
						...obtenerClientesVendedor,
						nuevoCliente,
					],
				},
			});
		},
	});

	const router = useRouter();

	const [mensaje, setMensaje] = React.useState(null);
	const [tipoMensaje, setTipoMensaje] = React.useState("");

	// Validacion del formulario
	const formik = useFormik({
		initialValues: {
			nombre: "",
			apellido: "",
			empresa: "",
			email: "",
			telefono: "",
		},
		validationSchema: Yup.object({
			nombre: Yup.string().required(
				"El nombre del cliente es obligatorio"
			),
			apellido: Yup.string().required(
				"El apellido del cliente es obligatorio"
			),
			empresa: Yup.string().required("La campo empresa es obligatorio"),
			email: Yup.string()
				.email("El email del cliente no es valido")
				.required("El email del cliente es obligatorio"),
		}), // End validationSchema
		onSubmit: async (valores) => {
			const { nombre, apellido, empresa, email, telefono } = valores;

			try {
				const { data } = await nuevoCliente({
					variables: {
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
					"Creado",
					"Se creo el producto correctamente",
					"success"
				);

				// Redireccionar hacia clientes
				router.push("/");
			} catch (error) {
				setMensaje(error.message.replace("GraphQL error: ", ""));
				setTipoMensaje("error");
				setTimeout(() => {
					setMensaje(null);
					setTipoMensaje("");
				}, 2000);
			}
		},
	}); // End formik

	const mostrarMensaje = () => {
		return (
			<div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
				<p
					className={
						tipoMensaje === "error"
							? "text-red-500"
							: tipoMensaje === "exito"
							? "text-green-500"
							: ""
					}
				>
					{mensaje}
				</p>
			</div>
		);
	};

	return (
		<Layout>
			<h1 className="text-2xl text-gray-800">Nuevo Cliente</h1>

			{mensaje && mostrarMensaje()}

			<main className="flex justify-center mt-5">
				<div className="w-full max-w-lg">
					<form
						className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
						onSubmit={formik.handleSubmit}
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
								className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								id="nombre"
								placeholder="Nombre Cliente"
								value={formik.values.nombre}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
						</div>

						{formik.touched.nombre && formik.errors.nombre ? (
							<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
								<p className="font-bold">Error</p>
								<p>{formik.errors.nombre}</p>
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
								className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								id="apellido"
								placeholder="Apellido Cliente"
								value={formik.values.apellido}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
						</div>

						{formik.touched.apellido && formik.errors.apellido ? (
							<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
								<p className="font-bold">Error</p>
								<p>{formik.errors.apellido}</p>
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
								className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								id="empresa"
								placeholder="Empresa Cliente"
								value={formik.values.empresa}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
						</div>

						{formik.touched.empresa && formik.errors.empresa ? (
							<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
								<p className="font-bold">Error</p>
								<p>{formik.errors.empresa}</p>
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
								className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								id="email"
								placeholder="Email Cliente"
								value={formik.values.email}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
						</div>

						{formik.touched.email && formik.errors.email ? (
							<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
								<p className="font-bold">Error</p>
								<p>{formik.errors.email}</p>
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
								className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								id="telefono"
								placeholder="Teléfono Cliente"
								value={formik.values.telefono}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
						</div>

						<div className="flex flex-col sm:flex-row justify-between mt-5 gap-4">
							<button
								type="button"
								className="w-full text-gray-600 p-2 border-2 rounded uppercase font-bold hover:bg-gray-200"
								onClick={() => router.push('/')}
							>
								Regresar
							</button>
							<button
								type="submit"
								className="bg-gray-800 w-full p-2 text-white uppercase font-bold hover:bg-gray-900"
							>
								Registrar Cliente
							</button>
						</div>
					</form>
				</div>
			</main>
		</Layout>
	);
};

export default NuevoCliente;
