import productsData from "@/services/mockData/products.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  async getAll() {
    await delay(300);
    return [...productsData];
  },

  async getById(id) {
    await delay(200);
    const product = productsData.find(p => p.id === id);
    if (!product) {
      throw new Error("Product not found");
    }
    return { ...product };
  },

  async create(productData) {
    await delay(400);
    const highestId = Math.max(...productsData.map(p => p.id), 0);
    const newProduct = {
      ...productData,
      id: highestId + 1,
      createdAt: new Date().toISOString()
    };
    productsData.push(newProduct);
    return { ...newProduct };
  },

  async update(id, updateData) {
    await delay(300);
    const index = productsData.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }
    productsData[index] = { ...productsData[index], ...updateData };
    return { ...productsData[index] };
  },

  async delete(id) {
    await delay(250);
    const index = productsData.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }
    const deletedProduct = { ...productsData[index] };
    productsData.splice(index, 1);
    return deletedProduct;
  }
};