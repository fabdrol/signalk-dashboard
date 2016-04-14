<template>
  <div class="widget">
    <h3 class="title">Koers (over de grond)</h3>
    <h1 class="value">{{ parseFloat(auto.value).toFixed(2) }} &deg;</h1>
  </div>
</template>

<script>
  export default {
    props: ['data', 'type'],

    computed: {
      auto () {
        return {
          subtitle: this.type,
          value: parseFloat(this.data.value) * (180 / Math.PI)
        }
      }
    }
  }
</script>
