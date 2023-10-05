import React from 'react';
import { useDispatch } from 'react-redux';

import { cantidadProductos, actualizarTotal } from '../../slices/pedidoSlice';

const ProductoResumen = ({producto}) => {
    const dispatch = useDispatch();

    const { nombre, precio } = producto;

    const actualizarCantidad = (e) => {
        const nuevoProducto = {...producto, cantidad: Number(e.target.value)};
        dispatch(cantidadProductos(nuevoProducto));
        dispatch(actualizarTotal());
    }

    return ( 
        <div className="md:flex md:justify-between md:items-center mt-5">
            <div className="md:w-2/4 mb-2 md:mb-0">
                <p className="text-sm">{nombre}</p>
                <p>$ {precio}</p>
            </div>

            <input
                type="number"
                placeholder="Cantidad"
                className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline md:ml-4"
                onChange={actualizarCantidad}
                defaultValue={0}
            />
        </div>
     );
}
 
export default ProductoResumen;