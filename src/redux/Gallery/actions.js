export const GET_GALLERY_REQUEST = "GET_GALLERY_REQUEST";
export const GET_GALLERY_SUCCESS = "GET_GALLERY_SUCCESS";
export const GET_GALLERY_FAILURE = "GET_GALLERY_FAILURE";

// productSlug: the PRODUCT slug (e.g. "moss-creations"), not the variant
// slug. The gallery page finds the right variant client-side from
// data.variants once this resolves.
export function getGalleryRequest(productSlug) {
  return { type: GET_GALLERY_REQUEST, payload: { productSlug } };
}

export function getGallerySuccess(payload, productSlug) {
  return { type: GET_GALLERY_SUCCESS, payload, productSlug };
}

export function getGalleryFailure(error) {
  return { type: GET_GALLERY_FAILURE, payload: error };
}