import React from 'react';
import { useSelector } from 'react-redux';

import { total } from '../../slices/pedidoSlice';

const Total = () => {
    const currentTotal = useSelector(total);

    return ( 
        <div className="flex items-center mt-5 justify-between bg-white p-3">
            <h2 className="text-gray-800 text-lg">Total a pagar:</h2>
            <p className="text-gray-800 mt-0">$ {currentTotal}</p>
        </div>
     );
}
 
export default Total;