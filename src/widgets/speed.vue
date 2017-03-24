<template>
  <div class="widget" :style="value.style">
    <div class="widget-contents">
      <h3 class="title">Snelheid {{ value.subtitle }}</h3>
      <h1 class="value" v-if="value.type !== 'both'" :class="{'stale':stale}">{{ parseFloat(value.value).toFixed(2) }}</h1>

      <div class="combined-values" v-if="value.type === 'both'">
        <h1 class="value-left" :class="{'stale':stale}">
          {{ parseFloat(value.values.left.value).toFixed(2) }}
          <span>{{ value.values.left.subtitle }}</span>
        </h1>

        <h1 class="value-right" :class="{'stale':stale}">
          {{ parseFloat(value.values.right.value).toFixed(2) }}
          <span>{{ value.values.right.subtitle }}</span>
        </h1>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import convert from '../convert'

  export default {
    props: ['data', 'type'],

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

      value () {
        let value = {
          subtitle: '',
          type: 'both',
          style: {},
          value: 0,
          values: {}
        }

        if (!this.$isObject(this.data.speedOverGround) && this.$isObject(this.data.speedThroughWater)) {
          value.type = 'speedThroughWater'
        }

        if (this.$isObject(this.data.speedOverGround) && !this.$isObject(this.data.speedThroughWater)) {
          value.type = 'speedOverGround'
        }

        if (this.type === 'speedThroughWater' || this.type === 'speedOverGround') {
          value.type = this.type
        }

        this.rows = []

        switch (value.type) {
          case 'both':
            value.style = {
              height: '150px'
            }

            this.options.height = (150 * 0.35)

            value.values = {
              left: {
                subtitle: 'over de grond',
                value: convert.speed(this.data.speedOverGround.value || 0, 'm/s', 'kts')
              },

              right: {
                subtitle: 'door het water',
                value: convert.speed(this.data.speedThroughWater.value || 0, 'm/s', 'kts')
              }
            }
            break

          case 'speedThroughWater':
            value.subtitle = '(door het water)'
            value.value = convert.speed(this.data.speedThroughWater.value || 0, 'm/s', 'kts')
            break

          default: // speedOverGround
            value.subtitle = '(over de grond)'
            value.value = convert.speed(this.data.speedOverGround.value || 0, 'm/s', 'kts')
            break
        }

        return value
        // */
      }
    },

    data () {
      return {
        rows: [],
        last: -1,
        columns: [
          { 'type': 'string', 'label': 'timestamp' },
          { 'type': 'number', 'label': 'speed' }
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
