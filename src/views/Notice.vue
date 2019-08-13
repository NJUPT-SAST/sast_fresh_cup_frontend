<template>
  <div>
    <v-card v-for="(notice,i) in noticeArray" :key="i">
       <v-checkbox v-model="checkbox[i]"></v-checkbox>
      <div  @click="check(i)">
      <img src="../assets/NEW.png" alt="" v-if="!noticeArray[i].checked">
      <v-card-title class="card_title">{{notice.title}}<span>{{notice.time}}</span></v-card-title>
      <div class="link-top" v-show="noticeArray[i].checkContent"></div>
      <v-card-text v-show="noticeArray[i].checkContent">{{notice.content}}</v-card-text>
      </div>
    </v-card>
     <v-checkbox v-model="checkbox[0]"></v-checkbox>
     <v-checkbox v-model="checkbox[1]"></v-checkbox>   
    <img src="../assets/rubbish.png" width="50" class="dustbin" @click="clean">
  </div>
</template>
<script>
   import Vue from 'vue'
   export default{
      data () {
        return {
          noticeArray:[],
          checkbox:[]
        }
      },
     computed:{
        notice(){
          return this.$store.state.noticeArray
        },
     },
      mounted(){
        this.noticeArray = this.notice.reverse()
        for(let i=0;i<this.noticeArray.length;i++){
           this.noticeArray[i]['checkContent'] =  false
           this.noticeArray[i]['checked'] =  false
        }
      },
     methods:{
       check: function(i){
         let newItem = this.noticeArray[i]
         newItem.checkContent = !this.noticeArray[i].checkContent
         newItem.checked = true
         this.$store.commit('handleReadNotice',i) 
         console.log(this.$store.state.readNoticeArray)
         Vue.set(this.noticeArray, i, newItem)   //Vue无法检测数组的更改，正确的方法就是调用vue提供的set方法。这样才能触发视图更新(踩坑！)
       },
       clean: function(){

       }
     }
   }
</script>
<style scoped>
  .v-alert{
    display: block!important;
  }
  .v-card{
    max-width:800px;
    margin:20px auto;
    border-left:5px solid #1976d2;
    border-radius:10px;
    position:relative;
  }
  .link-top {
    width: 96%;
    height: 1px;
    border-top: dashed rgb(202, 206, 212) 1px;
    margin:0 auto;
      }
  .card_title{
    display:flex;
    justify-content: space-between;
    font-size:20px;
    text-indent:1em;
  }
  .v-card__title span{
    color:rgb(112, 108, 108);
    font-size:15px;
    padding-right:20px;
  }
  .v-card__text{
    text-indent:1em;
  }
  .v-card img{
    width:50px;
    position:absolute;
    left:-5px;
  }
  .v-input{
    position:absolute;
    left:-50px;
  }
  .dustbin{
    display:block;
    float:right;
    margin-right:25%;
  }
  .dustbin:hover{
    background-color:#e8e9eb;
  }
</style>