<template>
  <div class="ticket">
    {{title}}
  </div>
</template>

<script>
  export default {
    name: 'ticket',
    data(){
      return{
        title: "Ticket"
      }

    }
  }
</script>

<style>
  .ticket{
    width: 100%;
    background-color: #ffdcdb
  }
</style>
