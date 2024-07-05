<script setup>
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import http from './http.js';
import CryptoJS from 'crypto-js'
import { Base64 } from 'js-base64';
import { uToolsStore } from './store/utools';

let titleClass = ref()
let chkIdx
let langFrom = ref()
let mainTrans = ref()
let simpleExp = ref('')
let sidebar = ref([])
let generalRes = ref([])
let contentRes = ref([])

function isChinese(text) {
    return /[\u4e00-\u9fa5]/.test(text);
}
 
function isEnglish(text) {
    return /^[A-Za-z]+$/.test(text);
}

function isNumText(text) {
  return /^[0-9]+.*[0-9]*$/.test(text)
}

function randOneStr(){
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const randIndex = Math.floor(Math.random() * characters.length) -1

  return characters[randIndex]
}

function Base64Encode(text) {
  let encode = Base64.encode(text)
  return randOneStr() + encode
}

function Base64Decode(text) {
  text = text.slice(1)
  return Base64.decode(text)
}

function setTransCache(input, data){
  try {
    const inputMd5 = CryptoJS.MD5(input).toString();

    let inData = data
    if (typeof data == "object" ) {
      inData = JSON.stringify(data)
    }

    const toCacheTrans = Base64Encode(inData)
    utoolsStore.iutools.dbStorage.setItem(inputMd5, toCacheTrans)
  } catch (error) {
    console.log("set cache error")
  }
}

function getTransCache(input) {
  try {
    const inputMd5 = CryptoJS.MD5(input).toString();

    const dbData = utoolsStore.iutools.dbStorage.getItem(inputMd5)
    if(!dbData){
      return null
    }
    const dbDataOri = JSON.parse(Base64Decode(dbData))
    return dbDataOri
  } catch (error) {
      return null
  }
}

function highlightStr(str, search){
  const replace = '<span class="light-word">'+search+'</span>'
  str = str.replace(search, replace)
  console.log(str)
  return str
}

window.playAudio = playAudio
function playAudio(){
  console.log(111)
}

const getAudioHtml= function(keywords, type=1){
  let audioHtml = `
    <audio controls>
      <source src="https://dict.youdao.com/dictvoice?type=`+type+`&audio=`+keywords+`" type="audio/mpeg">
    </audio>
    `
  return audioHtml
}

const mainVoice = function(voice, inputText){
  if(!voice || typeof voice == 'undefined'){
    return ''
  }
  
  console.log("inputText", inputText)
  const voices = voice.split('//')
  
  if(voices.length == 2){
    const v1 = '<span class="simple-exp">英 ' + voices[0] + ' /<i class="icon-audio icon-audio-t" onclick="playAudio()"></i> ' + getAudioHtml(inputText, 1) + '</span>'
    const v2 = ' <span class="simple-exp">美 / ' + voices[1] + '<i class="icon-audio icon-audio-t" onclick="playAudio()"></i>' + getAudioHtml(inputText, 2) + '</span>'
    voice = v1 + ' ' + v2
  }else{
    voice = '<span class="simple-exp">' + voice + '</span>'
  }

  

  return voice
}


const closeMsg = function(){
  if(document.loadingMsg){
    document.loadingMsg()
    document.loadingMsg = null
  }
}

const isLongWord = function(text){
  if((isChinese(text) && text.length > 5) || (isEnglish(text) && text.length > 15) ){
    return true
  } else {
    return false
  }
}

const renderingData = function(data){
    sidebar.value = []
    generalRes.value = []
    contentRes.value = []
    let list = data.trans_list
    langFrom.value = data.from

    mainTrans.value = data.text
    simpleExp.value = data.reading

    for (const key in list) {
      let item = list[key]
      if (item.b_type == 1){
        generalRes.value.push(item)
      } else {
        let ct = item.cidian
        contentRes.value = ct
        for (const kk in ct) {
          let iitem = ct[kk]
          sidebar.value.push(iitem.label)
        }
      }
    }

    delayScrollAction()
}


const transFunc = function(text){
  if (chkIdx) {
    clearTimeout(chkIdx)
  }
  
  const textLen = text.length
  console.log("textLen", textLen, document.loadingMsg)

  if (isLongWord(text) ){
    titleClass.value = "main-title"
  } else {
    titleClass.value = ""
  }

  if (textLen < 2 || isNumText(text)){
    closeMsg()
    return
  }

  if(textLen > 501){
    closeMsg()
    document.loadingMsg = message.error('字数超出限制，最多500个字', 2)
    return
  }

  if(!document.loadingMsg){
    document.loadingMsg = message.loading('翻译中 ...', 0);
  }

  chkIdx = setTimeout(function(){
    const cacheData = getTransCache(text)
    if(cacheData){
      console.log("从缓存中获取了数据", cacheData)
      // 渲染数据
      renderingData(cacheData)
      closeMsg()
    }else{
      http.post('/one', {keywords: text})
        .then(response => {
          console.log("异步请求", response.data);
          let resJson = response
        if(resJson.code != 0) {
          return
        }

        // 渲染数据
        renderingData(resJson.data)

        // 存入本地缓存
        if(!isLongWord(text)){
          console.log("seted", "设置缓存")
          setTransCache(text, resJson.data)
          console.log("afeter", getTransCache(text))
        }
        closeMsg()
      })
      .catch(error => {
        message.error('Maybe net has an error', 2)
        console.error('There was an error!', error);
      });
    }
  }, 1100)
}

const utoolsStore = uToolsStore()
utoolsStore.onPluginEnter('', transFunc)
</script>

<template>
  <div class="container">
    <div class="sidebar">
      <!-- <a v-if="mainTrans" href="#section0">综合</a> -->
      <a v-for="(sd, index) in sidebar" :key="index+1" :href="`#section${index+1}`">{{ sd }}</a>
    </div>
    <div class="content">
      <header>
        <h1 :class="titleClass" @click="closeMsg">{{ utoolsStore.keywords }}</h1>
        <div>
          <div v-html="mainVoice(simpleExp, utoolsStore.keywords)"></div>
          <!-- <span class="simple-exp">{{ mainVoice(simpleExp) }}</span>
          <i class="audio-play"></i>
          <audio controls>
            <source src="https://dict.youdao.com/dictvoice?type=1&audio=He%20failed%20his%20driving%20test" type="audio/mpeg">您的浏览器不支持 audio 元素。
          </audio>   -->
        </div>
         <div>
          <span class="main-exp">{{ mainTrans }}</span>
         </div>
      </header>
        <!-- <section v-if="mainTrans" id="section0">
            <h2>综合</h2>
            <p v-for="(gen, index) in generalRes" :key="index">
              <img v-if="gen.solution == 'baidu_fanyi'" src="./assets/img/bd.png"><br/>
              <span>{{ gen.text }}</span>
            </p>
        </section> -->
        <!-- <section id="section0"></section> -->
        <section v-for="(ct, index) in contentRes" :key="index+1" :id="`section${index+1}`">
            <h3>{{ ct.label }}</h3>
            <div>
              <ul v-if="ct.mark == 'simple'">
                <li class="word-exp-li li-sim" v-for="(chd, idx1) in ct.cidian_list" :key="idx1">
                  <div v-if="langFrom == 'zh'">
                    <span class="express-text">{{ chd.words }}</span>
                  </div>
                  <div v-if="langFrom == 'zh'">
                    <span class="in-pos" v-if="chd.voice">{{ chd.voice }}</span>
                    <span :class="chd.voice ? 'in-trans in-tran-a' : 'in-trans'">{{ chd.explain }}</span>
                  </div>
                  <div v-else>
                    <span class="in-pos" v-if="chd.voice">{{ chd.voice }}</span>
                    <span :class="chd.voice ? 'in-trans-a' : 'in-trans'">{{ chd.words }}</span>
                  </div>
                </li>
              </ul>
              <ul v-else>
                <li class="word-exp-li li-oth" v-for="(chd, idx1) in ct.cidian_list" :key="idx1">
                  <div class="word-exp-see">
                    <span class="">{{ idx1+1 }}.</span>
                  </div>
                  <div class="word-exp-content">
                    <div>
                      <span class="" v-html="highlightStr(chd.words, utoolsStore.keywords)"></span>
                    </div>
                    <div>
                      <span class="in-pos" v-if="chd.voice">{{ chd.voice }}</span>
                      <span :class="chd.voice ? 'in-trans in-trans-a' : 'in-trans'" v-html="highlightStr(chd.explain, utoolsStore.keywords)"></span>
                    </div>
                    <div v-if="chd.dict">
                      <span class="word-exp-dict">{{ chd.dict }}</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
        </section>
    </div>
  </div>
  
</template>
<script>
let sidebarLinks;
let contentSections;

function scrollToSection(event) {
    event.preventDefault();
    const targetId = event.target.getAttribute("href").substring(1);
    const targetSection = document.getElementById(targetId);
    targetSection.scrollIntoView({ behavior: 'smooth' });
}

function highlightSidebarLink() {
    let index = contentSections.length;
    while(--index && window.scrollY + 50 < contentSections[index].offsetTop) {}

    sidebarLinks.forEach(link => link.classList.remove('active'));
    sidebarLinks[index].classList.add('active');
}

function scrollWindow(){
  sidebarLinks = document.querySelectorAll('.sidebar a');
  contentSections = document.querySelectorAll('.content section');

  if (sidebarLinks.length == 0){
    return
  }

  sidebarLinks.forEach(link => link.addEventListener('click', scrollToSection));
  window.addEventListener('scroll', highlightSidebarLink);
}

function delayScrollAction(){
    setTimeout(function(){
      scrollWindow()  
    }, 1000)
    console.log("srcoll.......")
}

document.addEventListener("DOMContentLoaded", function() {
    // scrollWindow()
});
</script>