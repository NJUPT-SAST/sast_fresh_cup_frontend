<template>
  <div class="editTopic">
    <v-snackbar
      v-model="isSnackBarShow"
      :color="isSubmitSuccess? 'success' : 'error'"
      right
      top
      :timeout="3000"
    >{{isSubmitSuccess? "修改成功！" : "修改失败，服务异常！"}}</v-snackbar>
    <!-- <v-btn
      fab
      dark
      color="success"
      fixed
      bottom
      right
      :loading="isSubmiting"
      :disable="isSubmiting"
    >
      <v-icon dark>check</v-icon>
    </v-btn>-->
    <v-toolbar color="cyan" dark tabs>
      <v-toolbar-title>题目编辑</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>search</v-icon>
      </v-btn>
      <v-btn icon @click="handleEditClick">
        <v-icon>{{isEditing? 'check' : 'edit'}}</v-icon>
      </v-btn>
      <v-btn icon v-if="!isEditing">
        <v-icon>delete</v-icon>
      </v-btn>
      <template v-slot:extension>
        <v-tabs v-model="activeTab" color="cyan" show-arrows>
          <v-tabs-slider color="yellow"></v-tabs-slider>
          <v-tab v-for="(question, index) in questionGroups" :key="index">{{ question }}</v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
    <v-tabs-items v-model="activeTab">
      <v-tab-item v-for="(topic, index) in topicGroups" :key="index">
        <v-card flat class="topic elevation-5">
          <v-card-title primary-title>
            <div class="headline">{{topic.title}}</div>
          </v-card-title>
          <v-hover>
            <v-card-text class="grey--text topic-content" slot-scope="{ hover }">
              {{topic.content}}
              <v-expand-transition>
                <div
                  @click="showMoreContent"
                  v-if="hover"
                  style="height: 100%"
                  class="grey d-flex darken-2 display-3 white--text more-content-reveal"
                >
                  <v-icon dark x-large>more_horiz</v-icon>
                </div>
              </v-expand-transition>
            </v-card-text>
          </v-hover>
          <div class="file-part">
            <div class="img-groups">
              <v-card color="cyan lighten-3 img-show">
                <v-card-title style="padding: 0; margin-left: 1rem">
                  <div class="title white--text">图片</div>
                  <v-spacer/>
                  <v-btn icon>
                    <v-icon>add_photo_alternate</v-icon>
                  </v-btn>
                </v-card-title>
                <v-carousel
                  style="width: 100%; height: 82%"
                  hide-delimiters
                  :cycle="false"
                  v-if="imageGroups.length !== 0"
                >
                  <v-carousel-item v-for="(img, index) in imageGroups" :key="index" :src="img.src">
                    <v-btn dark icon>
                      <v-icon>inbox</v-icon>
                    </v-btn>
                    <v-btn dark icon>
                      <v-icon>broken_image</v-icon>
                    </v-btn>
                  </v-carousel-item>
                </v-carousel>
                <div class="no-image" v-else>
                  <div class="display-1">无</div>
                </div>
              </v-card>
            </div>
            <div class="annex-groups">
              <v-card class="cyan lighten-3 annex-show">
                <v-card-title style="padding: 0; margin-left: 1rem">
                  <div class="title white--text">附件</div>
                  <v-spacer/>
                  <v-btn icon>
                    <v-icon>note_add</v-icon>
                  </v-btn>
                </v-card-title>
                <v-list style="overflow-y: auto; height: 220px" v-if="annexGroups.length !== 0">
                  <v-list-tile v-for="(annex, index) in annexGroups" :key="index" @click.stop>
                    <v-list-tile-content>
                      <v-list-tile-title v-html="annex.name"></v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-btn fab ripple icon style="width: 30px; height: 30px;" :id="index">
                        <v-icon dark :id="index">clear</v-icon>
                      </v-btn>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
                <div class="no-image" v-else>
                  <div class="display-1">无</div>
                </div>
              </v-card>
            </div>
          </div>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
export default {
  data: () => ({
    isSnackBarShow: false,
    isSubmitSuccess: false,
    isSubmiting: false,
    isEditing: false,
    activeTab: null,
    // 题目ID/标题数组
    questionGroups: [
      'question1',
      'question2',
      'question3',
      'question1',
      'question2',
      'question3',
      'question1',
      'question2',
      'question3',
      'question1',
      'question2',
      'question3',
      'question1',
      'question2',
      'question3',
    ],
    // 题目内容数组
    topicGroups: [
      {
        title: '题目一标题',
        content:
          '题目一内容，他很长很长很长很长很长很长很长很长很长很，长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
        options: ['A', 'B', 'C', 'D'],
        image: [],
        annex: [],
      },
      {
        title: '题目二标题',
        content: '题目二内容',
        options: ['A', 'B', 'C', 'D'],
        image: [],
        annex: [],
      },
      {
        title: '题目三标题',
        content: '题目三内容',
        options: ['A', 'B', 'C', 'D'],
        image: [],
        annex: [],
      },
    ],
    imageGroups: [
      {
        src: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
      },
      {
        src: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
      },
      {
        src: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg',
      },
      {
        src: 'https://cdn.vuetifyjs.com/images/carousel/planet.jpg',
      },
    ],
    annexGroups: [
      { name: '文件一' },
      { name: '文件二' },
      { name: '文件三' },
      { name: '文件三' },
      { name: '文件三' },
      { name: '文件三' },
    ],
  }),
  methods: {
    handleEditClick() {
      this.isEditing = !this.isEditing;
    },
    showMoreContent() {},
  },
};
</script>

<style lang="stylus">
.editTopic
  width 100%
  height 100%
  margin-left 2rem
  margin-right 2rem
  .topic
    padding 0 2rem 1rem
    height 69vh
    overflow-y auto
    .topic-content
      margin-bottom 2rem
      height 140px
      display -webkit-box
      -webkit-box-orient vertical
      -webkit-line-clamp 6
      overflow hidden
      position relative
      .more-content-reveal
        cursor pointer
        align-items center
        bottom 0
        justify-content center
        opacity 0.5
        position absolute
        width 100%
    .file-part
      display flex
      justify-content space-between
      width 100%
      .img-groups
        width 40%
        margin-left 1rem
        .img-show
          width 100%
          height 268px
      .annex-groups
        width 40%
        margin-right 1rem
        .annex-show
          height 268px
      .no-image
        background-color white
        display flex
        justify-content center
        align-items center
        height 220px
</style>
