import React, { useReducer } from 'react';
import {
    ACTUALIZAR_TOTAL,
    CANTIDAD_PRODUCTOS,
    SELECCIONAR_CLIENTE,
    SELECCIONAR_PRODUCTO,
    LIMPIAR_PEDIDO,
} from '../../types';
import PedidoContext from './PedidoContext';
import PedidoReducer from './PedidoReducer';

const PedidoState = ({children}) => {
    // State de pedidos
    const initialState = {
        cliente: {},
        productos: [],
        total: 0
    };

    const [state, dispatch] = useReducer(PedidoReducer, initialState);

    // Modifica el cliente
    const agregarCliente = cliente => {
        dispatch({
            type: SELECCIONAR_CLIENTE,
            payload: cliente
        });
    };

    // Modifica los productos
    const agregarProductos = productos => {
        let nuevoState;
        if (state.productos.length > 0) {
            // Tomar del segundo arreglo, una copia para asignarlo al primero
            nuevoState = productos.map(producto => {
                const nuevoObjeto = state.productos.find(productoState => productoState.id === producto.id);
                return {...producto, ...nuevoObjeto};
            });
        } else {
            nuevoState = productos;
        }

        dispatch({
            type: SELECCIONAR_PRODUCTO,
            payload: nuevoState
        });
    };

    // Modifica las cantidades de los productos
    const cantidadProductos = nuevoProducto => {
        dispatch({
            type: CANTIDAD_PRODUCTOS,
            payload: nuevoProducto
        });
    };

    const actualizarTotal = () => {
        dispatch({
            type: ACTUALIZAR_TOTAL
        });
    };

    const limpiarPedido = () => {
        dispatch({
            type: LIMPIAR_PEDIDO
        });
    };
    
    return ( 
        <PedidoContext.Provider
            value={{
                cliente: state.cliente,
                productos: state.productos,
                total: state.total,
                agregarCliente,
                agregarProductos,
                cantidadProductos,
                actualizarTotal,
                limpiarPedido,
            }}
        >
            {children}
        </PedidoContext.Provider>
     );
}
 
export default PedidoState;