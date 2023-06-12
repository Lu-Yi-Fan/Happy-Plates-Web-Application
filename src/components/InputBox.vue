<template>
  <div>
    <label>{{ label }}</label>
    <input v-bind:value="value" @input="$emit('update:value', $event.target.value)" :placeholder="placeholder" :disabled="disabled">
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: ""
    },
    value: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
};
</script>

