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
  export default {
    props: ['data', 'type'],

    computed: {
      value () {
        let value = {
          subtitle: '',
          type: 'both',
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
                value: this.data.headingTrue.value
              },

              right: {
                subtitle: 'koers over de grond',
                value: this.data.courseOverGroundTrue.value
              }
            }
            break

          case 'headingTrue':
            value.subtitle = '(heading)'
            value.value = this.data.headingTrue.value
            break

          default: // courseOverGroundTrue
            value.subtitle = '(over de grond)'
            value.value = this.data.courseOverGroundTrue.value
            break
        }

        return value
      }
    }
  }
</script>
