// Redux/profile/reducer.ts
import { ProfileActionTypes } from './constants';

const INIT_STATE = {
    profile: null,
    loading: false,
    msg: '',
    error: '',
};

export default function ProfileReducer(state = INIT_STATE, action: any) {
    switch (action.type) {
        // ── Déclenchement des requêtes → loading ───────────────────────
        case ProfileActionTypes.GET_MY_PROFILE:
        case ProfileActionTypes.UPDATE_MY_PROFILE:
        case ProfileActionTypes.UPLOAD_AVATAR:
        case ProfileActionTypes.DELETE_AVATAR:
            return { ...state, loading: true, msg: '', error: '' };

        // ── Succès ─────────────────────────────────────────────────────
        case ProfileActionTypes.API_RESPONSE_SUCCESS:
            switch (action.payload.actionType) {
                case ProfileActionTypes.GET_MY_PROFILE:
                    return {
                        ...state,
                        profile: action.payload.data,
                        loading: false,
                        msg: '',
                        error: '',
                    };

                case ProfileActionTypes.UPDATE_MY_PROFILE:
                    return {
                        ...state,
                        loading: false,
                        msg: action.payload.msg || 'Profil mis à jour avec succès',
                        error: '',
                        
                        profile: action.payload.data?.profile || state.profile, 
                    };

                case ProfileActionTypes.UPLOAD_AVATAR:
                    return {
                        ...state,
                        loading: false,
                        msg: action.payload.msg || 'Photo de profil mise à jour',
                        error: '',
                    };

                case ProfileActionTypes.DELETE_AVATAR:
                    return {
                        ...state,
                        loading: false,
                        msg: action.payload.msg || 'Photo de profil supprimée',
                        error: '',
                    };

                default:
                    return state;
            }

        // ── Erreur ─────────────────────────────────────────────────────
        case ProfileActionTypes.API_RESPONSE_ERROR:
            return {
                ...state,
                loading: false,
                msg: '',
                error: action.payload.error || 'Une erreur est survenue',
            };

        // ── Clear msg / error (après alert dans le composant) ──────────
        case ProfileActionTypes.CLEAR_MSG:
            return {
                ...state,
                msg: '',
                error: '',
            };

        default:
            return state;
    }
}
