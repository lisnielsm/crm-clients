import { gql, useMutation } from "@apollo/client";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import * as Yup from "yup";

const AUTENTICAR_USUARIO = gql`
	mutation autenticarUsuario($input: AutenticarInput) {
		autenticarUsuario(input: $input) {
			token
		}
	}
`;

import Layout from "../components/Layout";

const Login = () => {
	const [mensaje, setMensaje] = React.useState(null);
	const [tipoMensaje, setTipoMensaje] = React.useState("");

	// Mutation para autenticar usuarios en apollo
	const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);

	// Routing
	const router = useRouter();

	// Validacion del formulario
	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		validationSchema: Yup.object({
			email: Yup.string()
				.email("El email no es valido")
				.required("El email es obligatorio"),
			password: Yup.string()
				.required("El password no puede ir vacio")
				.min(6, "El password debe ser de al menos 6 caracteres"),
		}), // End validationSchema
		onSubmit: async (valores) => {
			const { email, password } = valores;

			try {
				const { data } = await autenticarUsuario({
					variables: {
						input: {
							email,
							password,
						},
					},
				});

				setMensaje("Autenticando...");
				setTipoMensaje("exito");
				
				// Guardar token en localstorage
				setTimeout(() => {
					const { token } = data.autenticarUsuario;
					localStorage.setItem("token", token);
				}, 1000);

				setTimeout(() => {
					setMensaje(null);
					setTipoMensaje("");
					router.push("/");
				}, 2000);

			} catch (error) {
				setMensaje(error.message.replace("GraphQL error: ", ""));
				setTipoMensaje("error");
				setTimeout(() => {
					setMensaje(null);
					setTipoMensaje("");
				}, 3000);
			}
		},
	}); // End formik

	const mostrarMensaje = () => {
		return (
			<div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
				<p 
					className={ tipoMensaje === "error" ? "text-red-500" : tipoMensaje === "exito" ? "text-green-500" : ""}
				>{mensaje}</p>
			</div>
		);
	};

	return (
		<Layout>
			<h1 className="text-center text-white text-2xl">
				Login
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
								onBlur={formik.handleBlur}
							/>
						</div>

						{formik.touched.password && formik.errors.password ? (
							<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
								<p className="font-bold">Error</p>
								<p>{formik.errors.password}</p>
							</div>
						) : null}

						<button
							type="submit"
							className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
						>
							Iniciar Sesión
						</button>
					</form>
				</div>
			</div>
		</Layout>
	);
};

export default Login;
