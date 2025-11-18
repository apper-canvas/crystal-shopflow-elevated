import ordersData from "@/services/mockData/orders.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const orderService = {
  async getAll() {
    await delay(300);
    return [...ordersData];
  },

  async getById(id) {
    await delay(200);
    const order = ordersData.find(o => o.id === id);
    if (!order) {
      throw new Error("Order not found");
    }
    return { ...order };
  },

  async create(orderData) {
    await delay(500);
    const highestId = Math.max(...ordersData.map(o => o.id), 0);
    const newOrder = {
      ...orderData,
      id: highestId + 1,
      createdAt: new Date().toISOString(),
      status: "pending"
    };
    ordersData.push(newOrder);
    return { ...newOrder };
  },

  async update(id, updateData) {
    await delay(300);
    const index = ordersData.findIndex(o => o.id === id);
    if (index === -1) {
      throw new Error("Order not found");
    }
    ordersData[index] = { ...ordersData[index], ...updateData };
    return { ...ordersData[index] };
  },

  async delete(id) {
    await delay(250);
    const index = ordersData.findIndex(o => o.id === id);
    if (index === -1) {
      throw new Error("Order not found");
    }
    const deletedOrder = { ...ordersData[index] };
    ordersData.splice(index, 1);
    return deletedOrder;
  }
};