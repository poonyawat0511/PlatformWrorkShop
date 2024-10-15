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
              :rules="[
                (v) => !!v || 'Quantity is required',
                (v) => v > 0 || 'Quantity must be positive',
              ]"
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
          <v-btn
            color="blue darken-1"
            @click="dialog = false"
            variant="outlined"
            rounded=""
          >Cancel</v-btn>
          <v-btn
            color="blue darken-1"
            @click="submitForm"
            :disabled="!valid"
            variant="flat"
            class="px-8"
            rounded=""
          >
            <v-icon class="mdi mdi-pencil" align-center></v-icon> Save
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

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

// Form data
const valid = ref(false);
const formData = ref({
  name: "",
  description: "",
  quantity: 0,
  image: "",
});

// Initialize form data when dialog opens
watch(
  () => dialog.value,
  (newVal) => {
    if (newVal) {
      if (props.product && props.product.documentId) {
        formData.value = { ...props.product };
      } else {
        console.error("Product data is invalid:", props.product);
        // Reset form if product doesn't have documentId
        resetForm();
      }
    }
  }
);

// Reset form function
const resetForm = () => {
  formData.value = {
    name: "",
    description: "",
    quantity: 0,
    image: "",
  };
};

const submitForm = async () => {
  if (!formData.value.documentId) {
    console.error("No documentId found for the product.");
    return;
  }

  if (valid.value) {
    try {
      // Create a new payload without the id, createdAt, updatedAt, and publishedAt fields
      const { id, documentId, createdAt, updatedAt, publishedAt, ...payloadData } = formData.value; // Destructure to exclude unnecessary fields

      const payload = {
        data: payloadData // Only include the necessary fields
      };

      console.log('Payload to update:', JSON.stringify(payload)); // Log the payload

      const response = await fetch(
        `http://localhost:1337/api/products/${formData.value.documentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text(); // Get error text from response
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log('Update result:', result); // Log for debugging
      emit("update-product", result.data);
      dialog.value = false;
      resetForm();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  }
};
</script>

