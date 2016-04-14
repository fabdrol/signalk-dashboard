<template>
  <div class="widget">
    <h3 class="title">Tijd ({{ type }})</h3>
    <h1 class="value">{{ value }}</h1>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    props: ['type'],

    data () {
      return {
        value: this.type === 'utc' ? moment().utc().format('HH:MM:SS') : moment().format('HH:MM:SS')
      }
    }
  }
</script>
