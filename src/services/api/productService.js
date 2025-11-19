import { getApperClient } from "@/services/apperClient";

const tableName = "product_c";

// Map frontend field names to database field names
const mapToDatabase = (product) => {
  if (!product) return product;
  
  const mapped = {
    Name: product.name || product.Name,
    description_c: product.description || product.description_c,
    price_c: product.price || product.price_c,
    rating_c: product.rating || product.rating_c,
    review_count_c: product.reviewCount || product.review_count_c,
    category_c: product.category || product.category_c,
    in_stock_c: product.inStock !== undefined ? product.inStock : product.in_stock_c,
  };

  // Handle specifications mapping
  if (product.specifications) {
    const specs = product.specifications;
    mapped.specifications_battery_life_c = specs.batteryLife;
    mapped.specifications_benefits_c = specs.benefits;
    mapped.specifications_bpa_free_c = specs.bpaFree;
    mapped.specifications_brightness_c = specs.brightness;
    mapped.specifications_capacity_c = specs.capacity;
    mapped.specifications_care_c = specs.care;
    mapped.specifications_charging_c = specs.charging;
    mapped.specifications_charging_time_c = specs.chargingTime;
    mapped.specifications_connectivity_c = specs.connectivity;
    mapped.specifications_cruelty_free_c = specs.crueltyFree;
    mapped.specifications_material_c = specs.material;
    mapped.specifications_size_c = specs.size;
    mapped.specifications_weight_c = specs.weight;
  }

  // Handle variants mapping  
  if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
    const variant = product.variants[0]; // Use first variant for now
    mapped.variants_color_c = variant.color;
    mapped.variants_name_c = variant.name;
    mapped.variants_size_c = variant.size;
  }

  // Remove undefined values
  Object.keys(mapped).forEach(key => {
    if (mapped[key] === undefined) {
      delete mapped[key];
    }
  });

  return mapped;
};

// Map database fields to frontend format
const mapFromDatabase = (dbProduct) => {
  if (!dbProduct) return null;
  
  return {
    id: dbProduct.Id || 0,
    name: dbProduct.Name || 'Unnamed Product',
    description: dbProduct.description_c || '',
    price: dbProduct.price_c || 0,
    rating: dbProduct.rating_c || 0,
    reviewCount: dbProduct.review_count_c || 0,
    category: dbProduct.category_c || 'Uncategorized',
    inStock: dbProduct.in_stock_c !== undefined ? dbProduct.in_stock_c : true,
    images: dbProduct.images_c ? [dbProduct.images_c] : ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"],
    specifications: {
      batteryLife: dbProduct.specifications_battery_life_c || null,
      benefits: dbProduct.specifications_benefits_c || null,
      bpaFree: dbProduct.specifications_bpa_free_c || null,
      brightness: dbProduct.specifications_brightness_c || null,
      capacity: dbProduct.specifications_capacity_c || null,
      care: dbProduct.specifications_care_c || null,
      charging: dbProduct.specifications_charging_c || null,
      chargingTime: dbProduct.specifications_charging_time_c || null,
      connectivity: dbProduct.specifications_connectivity_c || null,
      crueltyFree: dbProduct.specifications_cruelty_free_c || null,
      material: dbProduct.specifications_material_c || null,
      size: dbProduct.specifications_size_c || null,
      weight: dbProduct.specifications_weight_c || null,
    },
    variants: dbProduct.variants_color_c || dbProduct.variants_name_c || dbProduct.variants_size_c ? [{
      color: dbProduct.variants_color_c || null,
      name: dbProduct.variants_name_c || null,
      size: dbProduct.variants_size_c || null,
    }] : []
  };
};
export const productService = {
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
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "specifications_battery_life_c"}},
          {"field": {"Name": "specifications_material_c"}},
          {"field": {"Name": "specifications_size_c"}},
          {"field": {"Name": "variants_color_c"}},
          {"field": {"Name": "variants_name_c"}},
          {"field": {"Name": "variants_size_c"}},
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error("Failed to fetch products:", response.message);
        return [];
}

      const products = (response.data || [])
        .map(mapFromDatabase)
        .filter(product => product !== null); // Filter out any null products
      
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
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
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "specifications_battery_life_c"}},
          {"field": {"Name": "specifications_material_c"}},
          {"field": {"Name": "specifications_size_c"}},
          {"field": {"Name": "variants_color_c"}},
          {"field": {"Name": "variants_name_c"}},
          {"field": {"Name": "variants_size_c"}},
        ]
      };

      const response = await apperClient.getRecordById(tableName, id, params);
      
      if (!response.success) {
        throw new Error("Product not found");
      }

      return mapFromDatabase(response.data);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  async create(productData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const mappedData = mapToDatabase(productData);
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
          console.error(`Failed to create ${failed.length} products:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
          });
        }
        
        return successful.length > 0 ? mapFromDatabase(successful[0].data) : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating product:", error);
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
          console.error(`Failed to update ${failed.length} products:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
          });
        }
        
        return successful.length > 0 ? mapFromDatabase(successful[0].data) : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating product:", error);
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
          console.error(`Failed to delete ${failed.length} products:`, failed);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }
};