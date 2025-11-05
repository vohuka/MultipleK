import api from "./api";

const productService = {
	getProducts: () => {
		return api.get("/products");
	},
	getProductsDistinct: () => {
		return api.get("/products/distinct");
	},
	getProductsById: (id) => {
		return api.get(`/products/${id}`);
	},
	getFilteredProducts: (page, limit, sortBy) => {
		return axios.get(
			`/products/${page}/${limit}${sortBy ? `?sort=${sortBy}` : ""}`,
			{
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	},
	deleteProduct: (id) => {
		return api.delete(`/products/${id}`, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	},
};

export default productService;
