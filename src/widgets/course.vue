<template>
  <div class="widget" :style="value.style">
    <div class="widget-contents">
      <h3 class="title">Koers {{ value.subtitle }}</h3>
      <h1 class="value" v-if="value.type !== 'both'">{{ parseFloat(value.value).toFixed(2) }}&deg;</h1>

      <div class="combined-values" v-if="value.type === 'both'">
        <h1 class="value-left">
          {{ parseFloat(value.values.left.value).toFixed(2) }}&deg;
          <span>{{ value.values.left.subtitle }}</span>
        </h1>

        <h1 class="value-right">
          {{ parseFloat(value.values.right.value).toFixed(2) }}&deg;
          <span>{{ value.values.right.subtitle }}</span>
        </h1>
      </div>
    </div>
  </div>
</template>

<script>
  // import moment from 'moment'
  import convert from '../convert'

  export default {
    props: ['data', 'type'],

    computed: {
      value () {
        let value = {
          subtitle: '',
          type: 'courseOverGroundTrue',
          style: {}
        }

        if (this.$isObject(this.data.headingTrue) && !this.$isObject(this.data.courseOverGroundTrue)) {
          value.type = 'headingTrue'
        }

        if (!this.$isObject(this.data.headingTrue) && this.$isObject(this.data.courseOverGroundTrue)) {
          value.type = 'courseOverGroundTrue'
        }

        if (this.type === 'headingTrue' || this.type === 'courseOverGroundTrue') {
          value.type = this.type
        }

        switch (value.type) {
          case 'both':
            value.style = {
              height: '150px'
            }

            value.values = {
              left: {
                subtitle: 'heading (true)',
                value: convert.angle(this.data.headingTrue.value, 'rad', 'deg')
              },

              right: {
                subtitle: 'koers over de grond',
                value: convert.angle(this.data.courseOverGroundTrue.value, 'rad', 'deg')
              }
            }
            break

          case 'headingTrue':
            value.subtitle = '(heading)'
            value.value = convert.angle(this.data.headingTrue.value, 'rad', 'deg')
            break

          default: // courseOverGroundTrue
            value.subtitle = '(over de grond)'
            value.value = convert.angle(this.data.courseOverGroundTrue.value, 'rad', 'deg')
            break
        }

        return value
      }
    }
  }
</script>
