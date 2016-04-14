<template>
  <div class="widget">
    <h3 class="title">Snelheid {{ auto.subtitle }}</h3>
    <h1 class="value">{{ parseFloat(auto.value).toFixed(2) }} kts</h1>
  </div>
</template>

<script>
  export default {
    props: ['data', 'type'],

    computed: {
      auto () {
        return {
          subtitle: this.type === 'speedOverGround' ? '(over de grond)' : '(door het water)',
          value: (parseFloat(this.data.value) * 1.94384)
        }
      }
    }
  }
</script>
