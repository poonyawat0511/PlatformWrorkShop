<template>
  <v-container>
    <h1>Products</h1>

    <v-btn
      color="green"
      @click="showDialog = true"
      variant="flat"
      rounded=""
      class="mb-3"
    >
      <v-icon class="mdi mdi-plus-box-multiple"></v-icon> Create New Product
    </v-btn>

    <CreateDialog v-model="showDialog" @new-product="addProduct" />

    <v-app>
      <v-row>
        <v-col
          v-for="product in products"
          :key="product.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <ProductsCard :product="product" @product-deleted="removeProduct" />
        </v-col>
      </v-row>
    </v-app>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import ProductsCard from "~/components/Products/Card.vue";
import CreateDialog from "~/components/Products/CreateDialog.vue";

interface Products {
  id: string;
  documentId: string;
  name: string;
  quantity: number;
  description: string;
  image: string;
}

const apiUrl = "http://localhost:1337/api/products";
const products = ref<Products[]>([]);
const showDialog = ref(false);

// Fetch all products
const fetchProducts = async () => {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    products.value = data.data;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

// Add a new product to the list
const addProduct = (newProduct: Products) => {
  products.value.push(newProduct);
};

// Remove a product from the list after deletion
const removeProduct = (documentId: string) => {
  products.value = products.value.filter(product => product.documentId !== documentId);
};

onMounted(() => {
  fetchProducts();
});
</script>
