import { createSlice } from "@reduxjs/toolkit";

// Define namespace
const name = "pedido";

// Actual Slice
export const layoutSlice = createSlice({
	name,
	initialState: {
		cliente: {},
		productos: [],
		total: 0,
	},
	reducers: {
		agregarCliente: (state, action) => {
      state.cliente = action.payload;
    },

    agregarProductos: (state, action) => {
			let nuevoState;
			if (state.productos.length > 0) {
				// Tomar del segundo arreglo, una copia para asignarlo al primero
				nuevoState = action.payload.map((producto) => {
					const nuevoObjeto = state.productos.find(
						(productoState) => productoState.id === producto.id
					);
					return { ...producto, ...nuevoObjeto };
				});
			} else {
				nuevoState = action.payload;
			}

			state.productos = nuevoState;
		},

    cantidadProductos: (state, action) => {
      state.productos = state.productos.map(producto => producto.id === action.payload.id ? action.payload : producto);
    },

    actualizarTotal: (state) => {
      state.total = state.productos.reduce((nuevoTotal, articulo) => nuevoTotal += articulo.precio * articulo.cantidad, 0);
    },

    limpiarPedido: (state) => {
      state.cliente = {};
      state.productos = [];
      state.total = 0;
    },
	},
});

export const {
  agregarCliente,
  agregarProductos,
  cantidadProductos,
  actualizarTotal,
  limpiarPedido,
} = layoutSlice.actions;

export const cliente = (state) => state[name].cliente;
export const productos = (state) => state[name].productos;
export const total = (state) => state[name].total;

export default layoutSlice.reducer;
