import {
    ACTUALIZAR_TOTAL,
    CANTIDAD_PRODUCTOS, 
    SELECCIONAR_CLIENTE,
    SELECCIONAR_PRODUCTO,
    LIMPIAR_PEDIDO,
} from '../../types';

export default (state, action) => {
    switch (action.type) {
        case SELECCIONAR_CLIENTE:
            return {
                ...state,
                cliente: action.payload
            }
        case SELECCIONAR_PRODUCTO:
            return {
                ...state,
                productos: action.payload
            }
        case CANTIDAD_PRODUCTOS:
            return {
                ...state,
                productos: state.productos.map(producto => producto.id === action.payload.id ? action.payload : producto)
            }
        case ACTUALIZAR_TOTAL:
            return {
                ...state,
                total: state.productos.reduce((nuevoTotal, articulo) => nuevoTotal += articulo.precio * articulo.cantidad, 0)
            }
        case LIMPIAR_PEDIDO:
            return {
                ...state,
                cliente: {},
                productos: [],
                total: 0
            }
        default:
            return state;
    }
}