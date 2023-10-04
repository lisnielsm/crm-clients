import React, { useReducer } from 'react';
import {
    ABRIR_SIDEBAR,
    CERRAR_SIDEBAR
} from '../../types';
import LayoutContext from './LayoutContext';
import LayoutReducer from './LayoutReducer';

const LayoutState = ({children}) => {
    // State de layout
    const initialState = {
        open: false,
    };

    const [state, dispatch] = useReducer(LayoutReducer, initialState);

    // Abre el sidebar
    const abrirSidebar = () => {
        dispatch({
            type: ABRIR_SIDEBAR
        });
    };

    // Cierra el sidebar
    const cerrarSidebar = () => {
        dispatch({
            type: CERRAR_SIDEBAR
        });
    };
    
    return ( 
        <LayoutContext.Provider
            value={{
                open: state.open,
                abrirSidebar,
                cerrarSidebar,
            }}
        >
            {children}
        </LayoutContext.Provider>
     );
}
 
export default LayoutState;