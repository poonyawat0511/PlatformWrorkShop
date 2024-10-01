<template>
    <div>
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="text-h5">Create New Product</span>
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
              <v-icon class="mdi mdi-plus-box-outline" align-center></v-icon>
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script setup lang="ts">
  // Define props for dialog control
  const props = defineProps({
    modelValue: Boolean, // ใช้ modelValue สำหรับ v-model
  });
  
  // Emit event for v-model
  const emit = defineEmits(["update:modelValue", "new-product"]);
  
  // state for dialog
  const dialog = computed({
    get: () => props.modelValue,
    set: (value) => emit("update:modelValue", value),
  });
  
  // Form data
  const valid = ref(false);
  const formData = ref({
    name: "",
    description: "",
    quantity: 0,
    image: "",
  });
  
  // API URL
  const apiUrl = "http://localhost:1337/api/products";
  
  // Submit form
  const submitForm = async () => {
    if (valid.value) {
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: formData.value,
          }),
        });
        const result = await response.json();
        emit("new-product", result.data);
        dialog.value = false;
        resetForm();
      } catch (error) {
        console.error("Error creating product:", error);
      }
    }
  };
  
  const resetForm = () => {
    formData.value = {
      name: "",
      description: "",
      quantity: 0,
      image: "",
    };
  };
  </script>
  