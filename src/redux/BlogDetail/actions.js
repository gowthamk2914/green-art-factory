export const GET_BLOG_DETAIL_REQUEST = "GET_BLOG_DETAIL_REQUEST";
export const GET_BLOG_DETAIL_SUCCESS = "GET_BLOG_DETAIL_SUCCESS";
export const GET_BLOG_DETAIL_FAILURE = "GET_BLOG_DETAIL_FAILURE";

export const GET_RELATED_BLOGS_REQUEST = "GET_RELATED_BLOGS_REQUEST";
export const GET_RELATED_BLOGS_SUCCESS = "GET_RELATED_BLOGS_SUCCESS";
export const GET_RELATED_BLOGS_FAILURE = "GET_RELATED_BLOGS_FAILURE";

export const getBlogDetailRequest = (slug) => ({
  type: GET_BLOG_DETAIL_REQUEST,
  payload: { slug },
});

export const getBlogDetailSuccess = (payload) => ({
  type: GET_BLOG_DETAIL_SUCCESS,
  payload,
});

export const getBlogDetailFailure = (payload) => ({
  type: GET_BLOG_DETAIL_FAILURE,
  payload,
});

// categorySlug -> `blogs.slug` from the blog detail response (used to
// scope the related list). excludeSlug -> current post's slug, filtered
// out of the results so the article doesn't recommend itself.
export const getRelatedBlogsRequest = (categorySlug, excludeSlug) => ({
  type: GET_RELATED_BLOGS_REQUEST,
  payload: { categorySlug, excludeSlug },
});

export const getRelatedBlogsSuccess = (payload) => ({
  type: GET_RELATED_BLOGS_SUCCESS,
  payload,
});

export const getRelatedBlogsFailure = (payload) => ({
  type: GET_RELATED_BLOGS_FAILURE,
  payload,
});