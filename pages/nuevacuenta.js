import { gql, useMutation } from "@apollo/client";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import * as Yup from "yup";
import Layout from "../components/Layout";

const NUEVA_CUENTA = gql`
	mutation nuevoUsuario($input: UsuarioInput) {
		nuevoUsuario(input: $input) {
			id
			nombre
			apellido
			email
		}
	}
`;

const NuevaCuenta = () => {
	const [mensaje, setMensaje] = React.useState(null);

	// Mutation para crear nuevos usuarios en apollo
	const [nuevoUsuario] = useMutation(NUEVA_CUENTA);

	// Routing
	const router = useRouter();

	// Validacion del formulario
	const formik = useFormik({
		initialValues: {
			nombre: "",
			apellido: "",
			email: "",
			password: "",
		},
		validationSchema: Yup.object({
			nombre: Yup.string().required("El nombre es obligatorio"),
			apellido: Yup.string().required("El apellido es obligatorio"),
			email: Yup.string()
				.email("El email no es valido")
				.required("El email es obligatorio"),
			password: Yup.string()
				.required("El password no puede ir vacio")
				.min(6, "El password debe ser de al menos 6 caracteres"),
		}), // End validationSchema
		onSubmit: async (valores) => {
			const { nombre, apellido, email, password } = valores;

			try {
				const { data } = await nuevoUsuario({
					variables: {
						input: {
							nombre,
							apellido,
							email,
							password,
						},
					},
				});

				// Usuario creado correctamente
				setMensaje(
					`Se creo correctamente el usuario: ${data.nuevoUsuario.nombre}`
				);

				setTimeout(() => {
					setMensaje(null);
					// Redirigir usuario para iniciar sesion
					router.push("/login");
				}, 3000);
			} catch (error) {
				setMensaje(error.message.replace("GraphQL error: ", ""));

				setTimeout(() => {
					setMensaje(null);
				}, 3000);
			}
		},
	}); // End formik

	const mostrarMensaje = () => {
		return (
			<div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
				<p>{mensaje}</p>
			</div>
		);
	};

	return (
		<Layout>
			<h1 className="text-center text-white text-2xl">
				Crear Nueva Cuenta
			</h1>

			{mensaje && mostrarMensaje()}

			<div className="flex justify-center mt-5">
				<div className="w-full max-w-sm">
					<form
						className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
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
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								id="nombre"
								placeholder="Nombre de Usuario"
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
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								id="apellido"
								placeholder="Apellido de Usuario"
								value={formik.values.apellido}
								onChange={formik.handleChange}
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
								htmlFor="email"
							>
								Email
							</label>

							<input
								type="email"
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								id="email"
								placeholder="Email de Usuario"
								value={formik.values.email}
								onChange={formik.handleChange}
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
								htmlFor="password"
							>
								Password
							</label>

							<input
								type="password"
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								id="password"
								placeholder="Password de Usuario"
								value={formik.values.password}
								onChange={formik.handleChange}
							/>
						</div>

						{formik.touched.password && formik.errors.password ? (
							<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
								<p className="font-bold">Error</p>
								<p>{formik.errors.password}</p>
							</div>
						) : null}

						<div className="mt-4">
							<Link href="/login">
								<span className="text-blue-600 hover:text-blue-800 visited:text-purple-600 cursor-pointer">
									Volver al login
								</span>
							</Link>
						</div>

						<button
							type="submit"
							className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
						>
							Crear Cuenta
						</button>
					</form>
				</div>
			</div>
		</Layout>
	);
};

export default NuevaCuenta;
