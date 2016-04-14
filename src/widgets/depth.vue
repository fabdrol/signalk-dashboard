<template>
  <div class="widget">
    <h3 class="title">Diepgang {{ auto.subtitle }}</h3>
    <h1 class="value">{{ parseFloat(auto.value).toFixed(2) }} m</h1>
  </div>
</template>

<script>
  export default {
    props: ['data'],

    computed: {
      belowTransducer () {
        return {
          subtitle: '(onder de transducer)',
          value: (typeof this.data.belowTransducer === 'object' && this.data.belowTransducer !== null) ? this.data.belowTransducer.value : -1
        }
      },

      belowKeel () {
        return {
          subtitle: '(onder de kiel)',
          value: (typeof this.data.belowKeel === 'object' && this.data.belowKeel !== null) ? this.data.belowKeel.value : -1
        }
      },

      auto () {
        if (this.belowTransducer.value === -1 && this.belowKeel.value > -1) {
          return this.belowKeel
        }

        return this.belowTransducer
      }
    }
  }
</script>
