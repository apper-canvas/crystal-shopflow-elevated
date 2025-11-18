import { getApperClient } from "@/services/apperClient";
const tableName = "order_c";

// Map frontend order format to database format
const mapToDatabase = (order) => {
  if (!order) return order;
  
  const mapped = {
    Name: `Order ${Date.now()}`, // Generate order name
    total_c: order.total,
    status_c: order.status || "pending",
    payment_method_c: order.paymentMethod,
  };

  // Map shipping address
  if (order.shippingAddress) {
    mapped.shipping_address_first_name_c = order.shippingAddress.firstName;
    mapped.shipping_address_last_name_c = order.shippingAddress.lastName;
    mapped.shipping_address_address_c = order.shippingAddress.address;
    mapped.shipping_address_city_c = order.shippingAddress.city;
    mapped.shipping_address_state_c = order.shippingAddress.state;
    mapped.shipping_address_zip_code_c = order.shippingAddress.zipCode;
    mapped.shipping_address_country_c = order.shippingAddress.country;
    mapped.shipping_address_email_c = order.shippingAddress.email;
    mapped.shipping_address_phone_c = order.shippingAddress.phone;
  }

  // Map first item (for simplification)
  if (order.items && order.items.length > 0) {
    const item = order.items[0];
    mapped.items_product_id_c = parseInt(item.productId);
    mapped.items_name_c = item.name;
    mapped.items_quantity_c = item.quantity;
    mapped.items_price_c = item.price;
    
    if (item.selectedVariant) {
      mapped.items_selected_variant_color_c = item.selectedVariant.color;
      mapped.items_selected_variant_name_c = item.selectedVariant.name;
      mapped.items_selected_variant_size_c = item.selectedVariant.size;
    }
  }

  // Remove undefined values
  Object.keys(mapped).forEach(key => {
    if (mapped[key] === undefined) {
      delete mapped[key];
    }
  });

  return mapped;
};

// Map database format to frontend order format
const mapFromDatabase = (dbOrder) => {
  if (!dbOrder) return dbOrder;
  
  return {
    id: dbOrder.Id,
    total: dbOrder.total_c,
    status: dbOrder.status_c,
    paymentMethod: dbOrder.payment_method_c,
    createdAt: dbOrder.CreatedOn,
    shippingAddress: {
      firstName: dbOrder.shipping_address_first_name_c,
      lastName: dbOrder.shipping_address_last_name_c,
      address: dbOrder.shipping_address_address_c,
      city: dbOrder.shipping_address_city_c,
      state: dbOrder.shipping_address_state_c,
      zipCode: dbOrder.shipping_address_zip_code_c,
      country: dbOrder.shipping_address_country_c,
      email: dbOrder.shipping_address_email_c,
      phone: dbOrder.shipping_address_phone_c,
    },
    items: [{
      productId: dbOrder.items_product_id_c,
      name: dbOrder.items_name_c,
      quantity: dbOrder.items_quantity_c,
      price: dbOrder.items_price_c,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
      selectedVariant: {
        color: dbOrder.items_selected_variant_color_c,
        name: dbOrder.items_selected_variant_name_c,
        size: dbOrder.items_selected_variant_size_c,
      }
    }].filter(item => item.productId) // Only include items with productId
  };
};

export const orderService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        return [];
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "total_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "payment_method_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "shipping_address_first_name_c"}},
          {"field": {"Name": "shipping_address_last_name_c"}},
          {"field": {"Name": "shipping_address_address_c"}},
          {"field": {"Name": "shipping_address_city_c"}},
          {"field": {"Name": "shipping_address_state_c"}},
          {"field": {"Name": "shipping_address_zip_code_c"}},
          {"field": {"Name": "shipping_address_email_c"}},
          {"field": {"Name": "shipping_address_phone_c"}},
          {"field": {"Name": "items_product_id_c"}},
          {"field": {"Name": "items_name_c"}},
          {"field": {"Name": "items_quantity_c"}},
          {"field": {"Name": "items_price_c"}},
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error("Failed to fetch orders:", response.message);
        return [];
      }

      return (response.data || []).map(mapFromDatabase);
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "total_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "payment_method_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "shipping_address_first_name_c"}},
          {"field": {"Name": "shipping_address_last_name_c"}},
          {"field": {"Name": "shipping_address_address_c"}},
          {"field": {"Name": "shipping_address_city_c"}},
          {"field": {"Name": "shipping_address_state_c"}},
          {"field": {"Name": "shipping_address_zip_code_c"}},
          {"field": {"Name": "shipping_address_email_c"}},
          {"field": {"Name": "shipping_address_phone_c"}},
          {"field": {"Name": "items_product_id_c"}},
          {"field": {"Name": "items_name_c"}},
          {"field": {"Name": "items_quantity_c"}},
          {"field": {"Name": "items_price_c"}},
          {"field": {"Name": "items_selected_variant_color_c"}},
          {"field": {"Name": "items_selected_variant_name_c"}},
          {"field": {"Name": "items_selected_variant_size_c"}},
        ]
      };

      const response = await apperClient.getRecordById(tableName, id, params);
      
      if (!response.success) {
        throw new Error("Order not found");
      }

      return mapFromDatabase(response.data);
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      throw error;
    }
  },

  async create(orderData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const mappedData = mapToDatabase(orderData);
      const params = {
        records: [mappedData]
      };

      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} orders:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
          });
        }
        
        return successful.length > 0 ? mapFromDatabase(successful[0].data) : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const mappedData = mapToDatabase(updateData);
      mappedData.Id = id;
      
      const params = {
        records: [mappedData]
      };

      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} orders:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
          });
        }
        
        return successful.length > 0 ? mapFromDatabase(successful[0].data) : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = { 
        RecordIds: [id] 
      };

      const response = await apperClient.deleteRecord(tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} orders:`, failed);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  }
};