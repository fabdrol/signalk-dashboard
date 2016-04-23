<template>
  <div class="widget">
    <!--
    <div class="widget-background">
      <vue-chart :columns="columns" :rows="rows" :options="options" chart-type="LineChart"></vue-chart>
    </div>
    -->

    <div class="widget-contents">
      <h3 class="title">Diepgang {{ auto.subtitle }}</h3>
      <h1 class="value">{{ parseFloat(auto.value).toFixed(2) }} m</h1>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['data', 'history'],

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
        this.rows = []

        if (this.belowTransducer.value === -1 && this.belowKeel.value > -1) {
          this.history.forEach((self) => {
            if (this.$isObject(self) && this.$isObject(self.environment) && this.$isObject(self.environment.depth) && this.$isObject(self.environment.depth.belowKeel)) {
              this.rows.push([ self.environment.depth.belowKeel.timestamp, -self.environment.depth.belowKeel.value ])
            }
          })

          return this.belowKeel
        }

        this.history.forEach((self) => {
          if (this.$isObject(self) && this.$isObject(self.environment) && this.$isObject(self.environment.depth) && this.$isObject(self.environment.depth.belowTransducer)) {
            this.rows.push([ self.environment.depth.belowTransducer.timestamp, -self.environment.depth.belowTransducer.value ])
          }
        })

        return this.belowTransducer
      }
    },

    data () {
      return {
        rows: [],
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
