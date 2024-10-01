<template>
    <div>
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="text-h5">Edit Product</span>
          </v-card-title>
  
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="formData.name"
                label="Product Name"
                :rules="[(v) => !!v || 'Name is required']"
                required
                variant="outlined"
                rounded=""
              ></v-text-field>
  
              <v-textarea
                v-model="formData.description"
                label="Product Description"
                :rules="[(v) => !!v || 'Description is required']"
                required
                variant="outlined"
                rounded=""
              ></v-textarea>
  
              <v-text-field
                v-model="formData.quantity"
                label="Quantity"
                type="number"
                :rules="[ (v) => !!v || 'Quantity is required', (v) => v > 0 || 'Quantity must be positive', ]"
                required
                variant="outlined"
                rounded=""
              ></v-text-field>
  
              <v-text-field
                v-model="formData.image"
                label="Product Image URL"
                :rules="[(v) => !!v || 'Image URL is required']"
                required
                variant="outlined"
                rounded=""
              ></v-text-field>
            </v-form>
          </v-card-text>
  
          <v-card-actions class="mt-n9">
            <v-spacer />
            <v-btn color="blue darken-1" @click="dialog = false" variant="outlined" rounded="">Cancel</v-btn>
            <v-btn color="blue darken-1" @click="submitForm" :disabled="!valid" variant="flat" class="px-8" rounded="">
              <v-icon class="mdi mdi-pencil" align-center></v-icon> Save
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script setup lang="ts">
  // Define props for dialog control and product data
  const props = defineProps({
    modelValue: Boolean, // For v-model
    product: {
      type: Object,
      required: true,
    },
  });
  
  // Emit event for v-model
  const emit = defineEmits(["update:modelValue", "update-product"]);
  
  // State for dialog
  const dialog = computed({
    get: () => props.modelValue,
    set: (value) => emit("update:modelValue", value),
  });
  
  // Form data, initialized with product data
  const valid = ref(false);
  const formData = ref({
    name: props.product.name,
    description: props.product.description,
    quantity: props.product.quantity,
    image: props.product.image,
  });
  
  // API URL for updating the product
  const apiUrl = `http://localhost:1337/api/products/${props.product.id}`;
  
  // Submit form
  const submitForm = async () => {
    if (valid.value) {
      try {
        const response = await fetch(apiUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: formData.value,
          }),
        });
        const result = await response.json();
        emit("update-product", result.data);
        dialog.value = false;
      } catch (error) {
        console.error("Error updating product:", error);
      }
    }
  };
  
  </script>
  