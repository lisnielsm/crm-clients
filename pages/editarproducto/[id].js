import { gql, useMutation, useQuery } from "@apollo/client";
import { Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import Swal from "sweetalert2";
import * as Yup from "yup";

import Layout from "../../components/Layout";

const OBTENER_PRODUCTO = gql`
	query obtenerProducto($id: ID!) {
		obtenerProducto(id: $id) {
			id
			nombre
			existencia
			precio
		}
	}
`;

const ACTUALIZAR_PRODUCTO = gql`
	mutation actualizarProducto($id: ID!, $input: ProductoInput) {
		actualizarProducto(id: $id, input: $input) {
			id
			nombre
			existencia
			precio
		}
	}
`;

const EditarProducto = () => {
	//obtener el ID actual
	const router = useRouter();
	const {
		query: { id },
	} = router;

	// Consultar para obtener el producto
	const { data, loading, error } = useQuery(OBTENER_PRODUCTO, {
		variables: {
			id: id || "",
		},
		fetchPolicy: "network-only",
	});

	// Actualizar el producto
	const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO);

	const [mensaje, setMensaje] = React.useState(null);

	// Schema de validacion
	const schemaValidacion = Yup.object({
		nombre: Yup.string().required("El nombre del producto es obligatorio"),
		existencia: Yup.number()
			.required("Agrega la cantidad disponible")
			.positive("No se aceptan números negativos")
			.integer("La existencia debe ser números enteros"),
		precio: Yup.number()
			.required("El precio es obligatorio")
			.positive("No se aceptan números negativos"),
	});

	const initialValues = {
		nombre: data?.obtenerProducto?.nombre || "",
		existencia: data?.obtenerProducto?.existencia || "",
		precio: data?.obtenerProducto?.precio || "",
	};

	// Modifica el producto en la BD
	const actualizarInfoProducto = async (valores) => {
		const { nombre, existencia, precio } = valores;

		try {
			const { data } = await actualizarProducto({
				variables: {
					id,
					input: {
						nombre,
						existencia: Number(existencia),
						precio: Number(precio),
					},
				},
			});

			// Mostrar alerta
			Swal.fire(
				"Actualizado",
				"El producto se actualizo correctamente",
				"success"
			);

			// Redireccionar
			router.push("/productos");
		} catch (error) {
			console.log(error);
			setMensaje("Hubo un error al actualizar el producto");
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
				<h1 className="text-2xl text-gray-800">Editar Producto</h1>
			</Layout>
		)
	}

	if(error) {
		return (
			<Layout>
				<h1 className="text-2xl text-gray-800">Editar Producto</h1>
				<p className="mt-5 text-center text-xl">Ocurrió un error al cargar el producto</p>
			</Layout>
		)
	}

	return (
		<Layout>
			<h1 className="text-2xl text-gray-800">Editar Producto</h1>

			{mensaje && mostrarMensaje()}

			{data?.obtenerProducto ? (
				<main className="flex justify-center mt-5">
					<div className="w-full max-w-lg">
						<Formik
							validationSchema={schemaValidacion}
							enableReinitialize={true}
							initialValues={initialValues}
							onSubmit={(valores) => {
								actualizarInfoProducto(valores);
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
												placeholder="Nombre Producto"
												value={props.values.nombre}
												onChange={props.handleChange}
												onBlur={props.handleBlur}
											/>
										</div>

										{props.touched.nombre &&
										props.errors.nombre ? (
											<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
												<p className="font-bold">
													Error
												</p>
												<p>{props.errors.nombre}</p>
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
												value={props.values.existencia}
												onChange={props.handleChange}
												onBlur={props.handleBlur}
											/>
										</div>

										{props.touched.existencia &&
										props.errors.existencia ? (
											<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
												<p className="font-bold">
													Error
												</p>
												<p>{props.errors.existencia}</p>
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
												value={props.values.precio}
												onChange={props.handleChange}
												onBlur={props.handleBlur}
											/>
										</div>

										{props.touched.precio &&
										props.errors.precio ? (
											<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
												<p className="font-bold">
													Error
												</p>
												<p>{props.errors.precio}</p>
											</div>
										) : null}

										<div className="flex flex-col sm:flex-row justify-between mt-5 gap-4">
											<button
												type="button"
												className="w-full text-gray-600 p-2 border-2 rounded uppercase font-bold hover:bg-gray-200"
												onClick={() =>
													router.push("/productos")
												}
											>
												Regresar
											</button>
											<button
												type="submit"
												className="bg-gray-800 w-full p-2 text-white uppercase font-bold hover:bg-gray-900"
											>
												Editar Producto
											</button>
										</div>
									</form>
								);
							}}
						</Formik>
					</div>
				</main>
			) : (
				<div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
					<p className="text-red-500">Acción no permitida</p>
				</div>
			)}
		</Layout>
	);
};

export default EditarProducto;
