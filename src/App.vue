<template>
    <el-container class="container">
        <el-header class="header">Stable Diffusion Lora Tranning TagHelper</el-header>
        <el-main class="main">
            <div class="tag-helper-main">
                <el-row :gutter="40">
                    <el-col :span="8">
                        <h3 class="block-header">图片列表</h3>
                        <div class="image-slider">
                            <div class="image-container">
                                <el-carousel
                                    class="image-carousel"
                                    indicator-position="none"
                                    :autoplay="false"
                                    arrow="always"
                                    :loop="false"
                                    :initial-index="imageIdx"
                                    @change="imageSwitchChange"
                                >
                                    <el-carousel-item
                                        class="image-carousel-item"
                                        v-for="(item, src, idx) in images"
                                        :key="item"
                                    >
                                        <div class="image-item">
                                            <span class="no">
                                                {{ idx + 1 }}
                                            </span>
                                            <img :src="src" alt="" />
                                        </div>
                                    </el-carousel-item>
                                </el-carousel>

                                <div class="image-tags">
                                    <h3 class="block-header">已设置的标签：</h3>
                                    <div class="tags-content"></div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="16">
                        <h3 class="block-header">预设Tag标签</h3>
                        <div class="tag-box">
                            <div class="tag-input-box">
                                <el-input
                                    class="tag-input"
                                    v-model="tagInputVal"
                                    :clearable="true"
                                    placeholder="请输入预设标签，可以使用|设置分类，或使用:分割中英文"
                                    @keyup.enter.native="saveTag"
                                >
                                    <template #append>
                                        <el-button @click="saveTag">
                                            <VIcon
                                                icon="ri:check-line"
                                                inline
                                                class="mgr-mini"
                                                width="16"
                                            ></VIcon>
                                            增加
                                        </el-button>
                                    </template>
                                </el-input>

                                <el-button
                                    type="warning"
                                    class="clear-all-btn"
                                    @click="clearAllTags"
                                >
                                    <VIcon
                                        icon="ri:delete-bin-5-line"
                                        inline
                                        width="16"
                                        class="mgr-mini"
                                    ></VIcon>
                                    清空全部</el-button
                                >
                            </div>
                            <div class="tags-wrapper">
                                <div class="color-category">
                                    <el-tag  v-for="color in colorTags" :key="color" class="en-tag" size="large" >
                                        <!-- <i :style="{ background: color.name }"></i>  -->
                                        {{ color.name + color.text }}
                                    </el-tag>
                                </div>
                                <div
                                    class="tag-category"
                                    v-for="(value, key, idx) in tags"
                                    :key="idx"
                                >
                                    <h4>{{ key }} <VIcon icon="ri:chat-upload-fill" class="reuse-category" width="24"
                                    @click="reuseCategory(key)"></VIcon></h4>
                                    <div
                                        :class="[
                                            'tag-item',
                                            tagPicked.includes(item.en) ? 'disable' : ''
                                        ]"
                                        v-for="item in value"
                                        :key="item"
                                        @click="tagHandler(item)"
                                        @dblclick="editAndDeleteTagHandler(key, item)"
                                    >
                                        <el-tag class="en-tag" size="large">
                                            {{ item.en }}
                                        </el-tag>
                                        <el-tag v-if="item.zh" class="zh-tag" size="large">
                                            {{ item.zh }}
                                        </el-tag>
                                        <div class="del-btn" @click="deleteTag(key, item)">
                                            <VIcon icon="ri:close-fill" inline width="12"></VIcon>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tags-picked">
                              <el-card class="box-card">
                                <template #header>
                                  <div class="card-header">
                                      <el-row :gutter="20">
                                        <el-col :span="12">
                                            <span style="line-height: 32px;">已选中的Tag标签</span>
                                        </el-col>
                                        <el-col :span="12" style="text-align: right;">
                                          <el-button plain @click="clearAllPickedTag" class="clear-button">清空全部已选</el-button>
                                          <el-button plain @click="saveToFile" class="save-button">保存到文件</el-button>
                                        </el-col>
                                      </el-row>
                                  </div>
                                </template>

                                <div class="empty-tags" v-if="tagPicked.length <= 0">
                                  <svg t="1692103163905" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10218" width="128" height="128"><path d="M855.6 427.2H168.5c-12.7 0-24.4 6.9-30.6 18L4.4 684.7C1.5 689.9 0 695.8 0 701.8v287.1c0 19.4 15.7 35.1 35.1 35.1H989c19.4 0 35.1-15.7 35.1-35.1V701.8c0-6-1.5-11.8-4.4-17.1L886.2 445.2c-6.2-11.1-17.9-18-30.6-18zM673.4 695.6c-16.5 0-30.8 11.5-34.3 27.7-12.7 58.5-64.8 102.3-127.2 102.3s-114.5-43.8-127.2-102.3c-3.5-16.1-17.8-27.7-34.3-27.7H119c-26.4 0-43.3-28-31.1-51.4l81.7-155.8c6.1-11.6 18-18.8 31.1-18.8h622.4c13 0 25 7.2 31.1 18.8l81.7 155.8c12.2 23.4-4.7 51.4-31.1 51.4H673.4zM819.9 209.5c-1-1.8-2.1-3.7-3.2-5.5-9.8-16.6-31.1-22.2-47.8-12.6L648.5 261c-17 9.8-22.7 31.6-12.6 48.4 0.9 1.4 1.7 2.9 2.5 4.4 9.5 17 31.2 22.8 48 13L807 257.3c16.7-9.7 22.4-31 12.9-47.8zM375.4 261.1L255 191.6c-16.7-9.6-38-4-47.8 12.6-1.1 1.8-2.1 3.6-3.2 5.5-9.5 16.8-3.8 38.1 12.9 47.8L337.3 327c16.9 9.7 38.6 4 48-13.1 0.8-1.5 1.7-2.9 2.5-4.4 10.2-16.8 4.5-38.6-12.4-48.4zM512 239.3h2.5c19.5 0.3 35.5-15.5 35.5-35.1v-139c0-19.3-15.6-34.9-34.8-35.1h-6.4C489.6 30.3 474 46 474 65.2v139c0 19.5 15.9 35.4 35.5 35.1h2.5z" p-id="10219"></path></svg>
                                </div>

                                <el-tag effect="dark" class="mgr-small picked-tag-item" 
                                  v-for="(item, idx) in tagPicked"
                                  @click="removePickedTag(item)"
                                >{{ item }}</el-tag>
                                <p class="picked-zh-tags">
                                    {{ 
                                        pickedTagZhText
                                    }}
                                </p>
                              </el-card>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-main>
    </el-container>
</template>
<script setup>
import { nextTick } from 'vue'
import fs from 'fs'
import { computed } from 'vue'

const images = import.meta.globEager('@/assets/train/**/*.png')
let tags = $ref(JSON.parse(localStorage.getItem('tags-history') || '{}'))
let tagInputVal = $ref('')
let tagPicked = $ref(['avatar','1girl','looking_at_viewer','solo', 'upper_body'])
let imageIdx = $ref((localStorage.getItem("last-used-image-idx") || 0) * 1)
const colorTags = ['red', 'blue', 'yellow', 'black', 'dark blue', 'light blue', 'pink', 'purple', 'orange', 'white', 'green', 'blue-green', 'light green', 'cyan:青色', 'brown'].map(function(c){
    let name = c.split(':')[0],
        text = c.split(":")[1] || '';
    return { name, text }
})

const pickedTagZhText = computed(() => {
    var allTags = Object.values(tags).reduce((t,c,i) => {
        return t.concat(c);
    },[]);
    let texts = tagPicked.map(c => {
        var q = allTags.filter(x => x.en == c)[0]
        if(q){
            return q.zh || q.en
        }else{
            return ''
        }
    })
    return texts.join(',')
})


const imageSwitchChange = (idx, oidx) => {
  imageIdx = idx
  localStorage.setItem("last-used-image-idx", imageIdx)
}
const saveTag = () => {
    if (!tagInputVal) {
        return ElNotification.error('标签输入不能为空!', { duration: 2e3 })
    }
    tagInputVal = tagInputVal.replace('：', ':')

    const category = tagInputVal.indexOf('|') > 0 ? tagInputVal.split(/[\|]/gi)[0] : ''
    const en = (
        !!category
            ? tagInputVal.split(/[\|]/gi)[1].split(/[\:]/gi)[0]
            : tagInputVal.split(/[\:]/gi)[0]
    ).replace(/[\:\|]/gi)
    const zh = (tagInputVal.split(/[\:]/gi)[1] || '').replace(/[\:\|]/gi)
    var currentTags = tags[category || '默认'] || []
    currentTags.push({ en, zh })
    tags[category || '默认'] = currentTags
    localStorage.setItem('tags-history', JSON.stringify(tags))
    tagInputVal = !!category ? category + '|' : ''
}
const tagHandler = (tag) => {
    if (tagPicked.includes(tag.en)) {
        tagPicked.splice(tagPicked.indexOf(tag.en), 1)
    } else {
        tagPicked.push(tag.en)
    }
}
const editAndDeleteTagHandler = (key, item) => {
    var currentTags = tags[key] || []
    if (currentTags && currentTags.length > 0) {
        tagInputVal = (key != '默认' ? key + '|' : '') + item.en + (item.zh ? ':' + item.zh : '');
        currentTags.splice(currentTags.indexOf(item), 1)
        localStorage.setItem('tags-history', JSON.stringify(tags))
    }
}
const deleteTag = (key, item) => {
    var currentTags = tags[key] || []
    if (currentTags && currentTags.length > 0) {
        currentTags.splice(currentTags.indexOf(item), 1)
        localStorage.setItem('tags-history', JSON.stringify(tags))
    }
}
const clearAllTags = () => {
    ElMessageBox.confirm('确定清空所有预设Tag，此操作不可恢复', '提示消息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
    .then(() => {
        localStorage.setItem('tags-history-bak', JSON.stringify(tags))
        nextTick(()=>{
          tags = {}
          localStorage.setItem('tags-history', JSON.stringify(tags))
          ElMessage({
              type: 'success',
              message: '删除成功'
          })
        })
    })
}
const removePickedTag = (item) => {
  tagPicked.splice(tagPicked.indexOf(item), 1)
}

const saveFileToLocal = (content, fileName) => {
    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8"
    })
    const objectURL = URL.createObjectURL(blob);
    const domElement = document.createElement('a')
    domElement.href = objectURL
    domElement.download = fileName 
    domElement.click()
    URL.revokeObjectURL(objectURL)
}
const saveToFile = () => {
    let content = tagPicked.join(',')
    let currentImgPath = Object.keys(images)[imageIdx];
    console.info('currentImgPath', currentImgPath)
    if(!content || content.length <= 0){
        return ElMessage({
            type: 'warning',
            message: '未选中任何需要保存的Tag标签'
        })
    }
  if(!!currentImgPath){
    let saveFilePath = '.' + currentImgPath.replace('.png', '.txt')
    let fileName = saveFilePath.substring(saveFilePath.lastIndexOf('/') + 1);
    saveFileToLocal(content, fileName)
  }else{
    ElMessage({
        type: 'warning',
        message: '未找到对应的图片路径'
    })
  }
}
const clearAllPickedTag = () => {
  tagPicked.length = 0
}
const reuseCategory = (key) => {
    tagInputVal = key + '|'
}
</script>

<style lang="scss" scoped>
.container {
    svg.iconify{
        vertical-align: middle;
    }
    .header {
        text-align: center;
        background: linear-gradient(135deg, #f54ea2, #ff7676);
        height: 60px;
        line-height: 60px;
        font-size: 28px;
        color: #fff;
    }
    .main {
        background-color: #f7f7f7;
        min-height: calc(100vh - 60px);
        padding: 0 5vw;
        .tag-helper-main {
            width: 100%;
            height: 100%;
            background-color: #fff;
            box-shadow: 0 0 24px -12px rgba(0, 0, 0, 0.2);
            padding:2vw 5vw 5vw;
            .block-header {
                height: 42px;
                line-height: 42px;
            }
            .image-slider {
                width: 100%;
                padding-top: 100%;
                background-color: #ff7676;
                position: relative;

                .image-container {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    left: 0;
                    top: 0;
                    background-color: antiquewhite;
                    .image-carousel {
                        width: 100%;
                        height: 100%;
                        :deep(.el-carousel__container) {
                            width: 100%;
                            height: 100%;
                            .el-carousel__arrow {
                                border: 1px solid #fff;
                            }
                            .image-item {
                                width: 100%;
                                height: 100%;
                                position: relative;
                                overflow: hidden;
                                .no {
                                    position: absolute;
                                    width: 60px;
                                    height: 32px;
                                    background-color: rgba(0, 0, 0, 0.42);
                                    color: #fff;
                                    font-size: 16px;
                                    line-height: 32px;
                                    text-align: center;
                                    right: -1px;
                                    top: 30px;
                                    border: 1px solid #fff;
                                }
                                img {
                                    width: 100%;
                                    height: 100%;
                                }
                            }
                        }
                    }
                    .image-tags {
                        .tags-content {
                            width: 100%;
                            min-height: 180px;
                            border: 1px solid #e4e7ed;
                            background-color: aliceblue;
                            // background: linear-gradient(135deg,#f6fffa,#fefff7);
                        }
                    }
                }
            }

            .tag-box {
                .tag-input-box {
                    .tag-input {
                        height: 42px;
                        width: calc(100% - 132px);
                    }
                    .clear-all-btn {
                        height: 42px;
                        width: 120px;
                        border: none;
                        margin-left: 12px;
                        background: linear-gradient(135deg, #f857a6, #ff5858);
                    }
                }
                .tags-wrapper {
                    .color-category{
                        display: none;
                        margin-top: 12px;
                        :deep(.el-tag){
                            display: inline-block;
                            line-height: 30px;
                            height: 30px;
                            margin-right: 8px;
                            margin-bottom: 4px;
                            cursor: pointer;
                            user-select: none;
                            i{
                                width: 16px;
                                height: 16px;
                                display: inline-block;
                                vertical-align: middle;
                                margin-top: -2px;
                                margin-right: 3px;
                            }
                        }
                    }
                    .tag-category {
                        h4 {
                            width: 100%;
                            height: 30px;
                            line-height: 30px;
                            color: #e9592a;
                            margin-top: 8px;
                            .reuse-category{
                                margin-top: -5px;
                                color:#ff7a4d;
                                cursor: pointer;
                                &:hover{
                                    color:#a704bd;
                                }
                            }
                        }
                        .tag-item {
                            display: inline-block;
                            margin-right: 8px;
                            margin-bottom: 4px;
                            cursor: pointer;
                            position: relative;
                            transition: margin-right 0.6s linear;
                            &.disable {
                                filter: grayscale(80);
                                margin-right: 8px !important;
                                .del-btn {
                                    display: none !important;
                                }
                            }
                            .del-btn {
                                position: absolute;
                                right: -10px;
                                top: 50%;
                                width: 20px;
                                height: 20px;
                                transform: translateY(-50%);
                                background: linear-gradient(135deg, #f6ceec, #d939cd);
                                color: #fff;
                                text-align: center;
                                line-height: 20px;
                                border-radius: 100%;
                                display: none;
                                opacity: 0;
                                transition: opacity 0.6s linear;
                                &:hover {
                                    background: linear-gradient(135deg, #ff512f, #dd2476);
                                }
                            }
                            &:hover {
                                margin-right: 20px;
                                .del-btn {
                                    display: block;
                                    opacity: 1;
                                }
                            }
                            :deep(.el-tag) {
                                padding: 0 15px;
                                user-select: none;
                                &.en-tag {
                                    border: 0;
                                    background: linear-gradient(135deg, #abdcff, #0396ff);
                                    color: #fff;
                                    ~ .zh-tag {
                                        margin-left: -3px;
                                        border-top-left-radius: 0;
                                        border-bottom-left-radius: 0;
                                    }
                                }
                                &.zh-tag {
                                    border: 0;
                                    background: linear-gradient(135deg, #fce38a, #f38181);
                                    color: #fff;
                                }
                            }
                        }
                    }
                }
                .tags-picked{
                  margin-top: 30px;
                  .box-card{
                    box-shadow: none;
                    background: linear-gradient(135deg,#f6fffa,#fefff7);
                    background: aliceblue;
                    .save-button{
                      height: 32px;
                      color: #fff;
                      border: none;
                      background: linear-gradient(329deg,#1dd8db,#736eff);
                    }
                    .clear-button{
                      height: 32px;
                      color: #fff;
                      border: none;
                      background: linear-gradient(135deg,#ffb75e,#ed8f03);
                    }
                    .empty-tags{
                      text-align: center;
                      svg{
                        margin: 30px;
                        fill: #d0deff;
                        opacity: 0.64;
                      }
                    }
                    .picked-tag-item{
                      cursor: pointer;
                      border: none;
                      height: 30px;
                      line-height: 30px;
                      margin-bottom: 4px;
                      background: linear-gradient(135deg, #abdcff, #0396ff);
                    }
                    .picked-zh-tags{
                        margin-top: 18px;
                        font-size: 14px;
                    }
                  }
                }
            }
        }
    }
}
</style>
