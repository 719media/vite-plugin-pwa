<script setup lang="ts">
defineEmits(['toggle'])
</script>

<template>
  <div
      role="button"
      aria-label="Toggle navigation menu"
      tabindex="0"
      class="sidebar-button"
      @keydown.enter="$emit('toggle')"
      @click="$emit('toggle')"
  >
    <svg
      class="icon"
      xmlns="http://www.w3.org/2000/svg"
      focusable="false"
      role="img"
      viewBox="0 0 448 512"
    >
      <path
        fill="currentColor"
        d="M436 124H12c-6.627 0-12-5.373-12-12V80c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12z"
        class
      />
    </svg>
  </div>
</template>

<style>
.sidebar-button {
  position: absolute;
  top: 0.6rem;
  left: 1rem;
  display: none;
  padding: 0.6rem;
  cursor: pointer;
}

.sidebar-button .icon {
  display: block;
  width: 1.25rem;
  height: 1.25rem;
}

@media screen and (max-width: 779px) {
  .sidebar-button {
    display: block;
  }
}
</style>
