import { gql, useMutation } from "@apollo/client";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import Swal from "sweetalert2";
import * as Yup from "yup";

import Layout from "../components/Layout";

const NUEVO_PRODUCTO = gql`
	mutation nuevoProducto($input: ProductoInput) {
		nuevoProducto(input: $input) {
			id
			nombre
			existencia
			precio
		}
	}
`;

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

const NuevoProducto = () => {
	// Mutation para crear nuevos productos
	const [nuevoProducto] = useMutation(NUEVO_PRODUCTO, {
		update(cache, { data: { nuevoProducto } }) {
			// Obtener el objeto de cache que deseamos actualizar
			const { obtenerProductos } = cache.readQuery({
				query: OBTENER_PRODUCTOS,
			});

			// Reescribimos el cache (el cache nunca se debe modificar)
			cache.writeQuery({
				query: OBTENER_PRODUCTOS,
				data: {
					obtenerProductos: [...obtenerProductos, nuevoProducto],
				},
			});
		},
	});

	const router = useRouter();

	const [mensaje, setMensaje] = React.useState(null);

	// Validacion del formulario
	const formik = useFormik({
		initialValues: {
			nombre: "",
			existencia: "",
			precio: "",
		},
		validationSchema: Yup.object({
			nombre: Yup.string().required(
				"El nombre del producto es obligatorio"
			),
			existencia: Yup.number()
				.required("Agrega la cantidad disponible")
				.positive("No se aceptan números negativos")
				.integer("La existencia debe ser números enteros"),
			precio: Yup.number()
				.required("El precio es obligatorio")
				.positive("No se aceptan números negativos"),
		}), // End validationSchema
		onSubmit: async (valores) => {
			const { nombre, existencia, precio } = valores;

			try {
				const { data } = await nuevoProducto({
					variables: {
						input: {
							nombre,
							existencia: Number(existencia),
							precio: Number(precio),
						},
					},
				});

				// Mostrar alerta
				Swal.fire(
					"Creado",
					"Se creo el producto correctamente",
					"success"
				);

				// Redireccionar hacia productos
				router.push("/productos");
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
				<p className="text-red-500">{mensaje}</p>
			</div>
		);
	};

	return (
		<Layout>
			<h1 className="text-2xl text-gray-800">Nuevo Producto</h1>

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
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								id="nombre"
								placeholder="Nombre Producto"
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
								htmlFor="existencia"
							>
								Cantidad Disponible
							</label>

							<input
								type="number"
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								id="existencia"
								placeholder="Cantidad Disponible"
								value={formik.values.existencia}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
						</div>

						{formik.touched.existencia &&
						formik.errors.existencia ? (
							<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
								<p className="font-bold">Error</p>
								<p>{formik.errors.existencia}</p>
							</div>
						) : null}

						<div className="mb-4">
							<label
								className="block text-gray-700 text-sm font-bold mb-2"
								htmlFor="precio"
							>
								Precio
							</label>

							<input
								type="number"
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								id="precio"
								placeholder="Precio Producto"
								value={formik.values.precio}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
						</div>

						{formik.touched.precio && formik.errors.precio ? (
							<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
								<p className="font-bold">Error</p>
								<p>{formik.errors.precio}</p>
							</div>
						) : null}

						<div className="flex flex-col sm:flex-row justify-between mt-5 gap-4">
							<button
								type="button"
								className="w-full text-gray-600 p-2 border-2 rounded uppercase font-bold hover:bg-gray-200"
								onClick={() => router.push("/productos")}
							>
								Regresar
							</button>
							<button
								type="submit"
								className="bg-gray-800 w-full p-2 text-white uppercase font-bold hover:bg-gray-900"
							>
								Agregar Producto
							</button>
						</div>
					</form>
				</div>
			</main>
		</Layout>
	);
};

export default NuevoProducto;
