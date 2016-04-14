<template>
  <div class="overlay-background">
    <slot></slot>
  </div>
</template>

<style lang="stylus">
  dark-blue = #2C3E50 // rgb(44, 62, 80)
  bright-red = #FC4349 // rgb(252, 67, 73)
  medium-grey = #D7DADB // rgb(215, 218, 219)
  light-blue = #6DBCDB // rgb(109, 188, 219)
  white = #FFFFFF // rgb(255, 255, 255)

  .overlay-background
    display block
    width 100%
    height 100%
    position fixed
    top 0
    left 0
    text-align center
    background-color rgba(44, 62, 80, .8)
    padding 2em

    .overlay-close
      display block
      width 50px
      height 50px
      line-height 50px
      text-align center
      color bright-red
      font-size 3em
      position absolute
      top 20px
      right 20px
</style>
