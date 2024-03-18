<template>
  <div class="loading">
    <div class="loading-wrapper">
      <div class="loading__icon"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "VLoading",
};
</script>
<style>
.loading {
  position: absolute;
  width: 1300px;
  height: 537px;
  background-color: rgba(0, 0, 0, 0.278);
  display: flex;
  justify-content: center;
  align-items: center;
}
.loading-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 4px solid black;
  border-top: 4px solid white;
  animation: spin 0.5s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
