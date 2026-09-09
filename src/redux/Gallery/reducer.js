import {
  GET_GALLERY_REQUEST,
  GET_GALLERY_SUCCESS,
  GET_GALLERY_FAILURE,
} from "./actions";

const initialState = {
  productSlug: null, // which product slug the current `data` belongs to
  data: null,         // { data: { ...product with variants } } from the API
  loading: false,
  error: null,
};

export default function GalleryReducer(state = initialState, action) {
  switch (action.type) {
    case GET_GALLERY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        productSlug: action.payload.productSlug,
      };
    case GET_GALLERY_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        productSlug: action.productSlug,
      };
    case GET_GALLERY_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}