<template>
  <div class="widget">
    <div class="widget-contents">
      <h3 class="title">Diepgang {{ auto.subtitle }}</h3>
      <h1 class="value" :class="{ 'stale': stale }">{{ parseFloat(auto.value).toFixed(2) }} m</h1>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  
  export default {
    props: ['data'],

    computed: {
      stale () {
        if (this.last === -1) {
          this.last = moment(this.data.timestamp).valueOf()
          return false
        }

        const age = moment(this.data.timestamp).valueOf() - this.last
        this.last = moment(this.data.timestamp).valueOf()
        return (age > 10000)
      },

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
        this.rows = []

        if (this.belowTransducer.value === -1 && this.belowKeel.value > -1) {
          return this.belowKeel
        }

        return this.belowTransducer
      }
    },

    data () {
      return {
        rows: [],
        last: -1,
        columns: [
          { 'type': 'string', 'label': 'timestamp' },
          { 'type': 'number', 'label': 'depth' }
        ],

        options: {
          width: '100%',
          height: (125 * 0.35),
          showAxisLines: false,
          showValueLabels: false,
          labelPosition: 'none',
          legend: 'none',
          curveType: 'function',
          colors: ['#6DBCDB'],

          chartArea: {
            width: '100%',
            height: '100%'
          },

          backgroundColor: {
            fill: '#304457'
          },

          vAxis: {
            textPosition: 'none',
            baselineColor: '#304457',
            gridlineColor: '#304457'
          },

          hAxis: {
            textPosition: 'none',
            baselineColor: '#304457',
            gridlineColor: '#304457'
          }
        }
      }
    }
  }
</script>
