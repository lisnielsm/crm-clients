import {
    ABRIR_SIDEBAR,
    CERRAR_SIDEBAR
} from '../../types';

export default (state, action) => {
    switch (action.type) {
        case ABRIR_SIDEBAR:
            return {
                open: true
            }
        case CERRAR_SIDEBAR:
            return {
                open: false
            }
        default:
            return state;
    }
}