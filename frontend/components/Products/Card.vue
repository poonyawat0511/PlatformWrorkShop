<template>
  <v-card class="mx-auto" max-width="344">
    <v-img height="200px" :src="product.image" cover></v-img>
    {{ product.documentId }}
    <v-card-title>{{ product.name }}</v-card-title>

    <v-card-subtitle>{{ product.quantity }}</v-card-subtitle>

    <v-card-actions>
      <v-btn
        :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        @click="show = !show"
      ></v-btn>
      <v-spacer></v-spacer>
      <v-btn @click="deleteProduct">
        <v-icon class="mdi mdi-delete-empty" color="red"></v-icon>
      </v-btn>
      <v-btn @click="openEditDialog">
        <v-icon class="mdi mdi-pencil-outline"></v-icon>
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>
        <v-card-text>{{ product.description }}</v-card-text>
      </div>
    </v-expand-transition>
    <!-- Include the EditDialog and bind the product and dialog state -->
    <EditDialog
      v-model="showEditDialog"
      :product="product"
      @update-product="updateProduct"
    />
  </v-card>
</template>

<script>
import EditDialog from "./EditDialog.vue";

export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      show: false,
      showEditDialog: false, // State to control the visibility of the EditDialog
    };
  },
  methods: {
    async deleteProduct() {
      try {
        const response = await fetch(
          `http://localhost:1337/api/products/${this.product.documentId}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          this.$emit("product-deleted", this.product.documentId);
        } else {
          console.error("Error deleting product:", response.statusText);
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    },
    openEditDialog() {
      this.showEditDialog = true; // Open the Edit dialog when the button is clicked
    },
    updateProduct(updatedProduct) {
      // Emit the updated product to the parent component
      this.$emit("update-product", updatedProduct);
      this.showEditDialog = false;
    },
  },
  components: {
    EditDialog,
  },
};
</script>
