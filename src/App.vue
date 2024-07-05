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
let simpleExp = ref()
let sidebar = ref([])
let generalRes = ref([])
let contentRes = ref([])

function isChinese(text) {
    return /[\u4e00-\u9fa5]/.test(text);
}
 
function isEnglish(text) {
    return /^[A-Za-z]+$/.test(text);
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

const closeMsg = function(){
  if(document.loadingMsg){
    document.loadingMsg()
    document.loadingMsg = null
  }
}

const transFunc = function(text){
  if (chkIdx) {
    clearTimeout(chkIdx)
  }

  if(text.length == 0){
    closeMsg()
  }

  if((isChinese(text) && text.length > 6) || (isEnglish(text) && text.length > 15) ){
    titleClass.value = "main-title"
  } else {
    titleClass.value = ""
  }

  console.log("text.length", text.length)

  if (text.length < 2){
    return
  }

  if(!document.loadingMsg){
    document.loadingMsg = message.loading('翻译中 ...', 0);
  }

  chkIdx = setTimeout(function(){
    let res = `{
    "code": 0,
    "message": "",
    "data": {
        "src": "万物",
        "text": "creation",
        "from": "zh",
        "to": "en",
        "solution": "baidu_fanyi",
        "reading": "/ wàn wù /",
        "trans_list": [
            {
                "src": "万物",
                "text": "all",
                "from": "zh",
                "to": "en",
                "solution": "youdao_cidian",
                "b_type": 2,
                "reading": "/ wàn wù /",
                "cidian": [
                    {
                        "label": "简明释义",
                        "mark": "simple",
                        "cidian_list": [
                            {
                                "words": "all",
                                "explain": "全部；每一个；极度，尽量；无论什么，任何；唯一，仅仅；全部的；每一个的；任何的；尽可能多的；全然是……的，完全表现出……的；（某一体征）显著突出的；完全地；各方，各选手；非常，太；所有，全部；唯一；全部，所有；【名】 （All）（英、美、巴、加）奥尔（人名）；",
                                "voice": "",
                                "dict": ""
                            },
                            {
                                "words": "all things on earth",
                                "explain": "万物，万类；",
                                "voice": "",
                                "dict": ""
                            }
                        ]
                    },
                    {
                        "label": "双语例句",
                        "mark": "sentence",
                        "cidian_list": [
                            {
                                "words": "圆盘似的月亮会高悬在夜空中，将柔和的月光洒向世间万物。",
                                "explain": "The moon's round orb would shine high in the sky, casting its velvety light on everything.",
                                "voice": "",
                                "dict": ""
                            },
                            {
                                "words": "落日的余晖洒在万物之上。",
                                "explain": "The setting sun was shedding a golden light over everything.",
                                "voice": "",
                                "dict": ""
                            },
                            {
                                "words": "夏天万物生长得都很快。",
                                "explain": "Everything grows fast in summer.",
                                "voice": "",
                                "dict": ""
                            }
                        ]
                    },
                    {
                        "label": "网络释义",
                        "mark": "networds",
                        "cidian_list": [
                            {
                                "words": "universe",
                                "explain": "... status 地位，身份，情况，状况 universe 宇宙，万物 agent 代理人(商)，代表 ...",
                                "voice": "",
                                "dict": ""
                            },
                            {
                                "words": "Everything",
                                "explain": "角色放置类挂机放置类日系联机放置类万物万物（Everything）是一款非常独特的放置类休闲游戏，在这里你就..",
                                "voice": "",
                                "dict": ""
                            },
                            {
                                "words": "thing",
                                "explain": "...  thickness 厚度  thing 万物  thinking 思想 ...",
                                "voice": "",
                                "dict": ""
                            },
                            {
                                "words": "all things on earth",
                                "explain": "... [ wealthy；ten million cash ] 一万贯铜钱，形容钱财极多 [ very wealthy；be a millionaire ] 家中广有钱财，尤如腰缠万贯 [ all things on earth ] 万物 ...",
                                "voice": "",
                                "dict": ""
                            }
                        ]
                    },
                    {
                        "label": "短语",
                        "mark": "phrase",
                        "cidian_list": [
                            {
                                "words": "万物理论",
                                "explain": "The Theory of Everything ; TheTheor ; the theory of ; A Theory of Everything",
                                "voice": "",
                                "dict": ""
                            },
                            {
                                "words": "万物有灵论",
                                "explain": "the animism ; Animistic thinking ; animism ; animatism",
                                "voice": "",
                                "dict": ""
                            },
                            {
                                "words": "万物互联",
                                "explain": "Internet of Everything ; IoE ; IOT",
                                "voice": "",
                                "dict": ""
                            }
                        ]
                    }
                ]
            },
            {
                "src": "万物",
                "text": "creation",
                "from": "zh",
                "to": "en",
                "solution": "baidu_fanyi",
                "b_type": 1,
                "reading": "",
                "cidian": null
            }
        ]
    }
}`;

    const cacheData = getTransCache(text)
    if(cacheData){
      console.log("geted", "从缓存中获取了数据", cacheData)
    }else{
      console.log("seted", "设置缓存")
      const jj = JSON.parse(res)
      setTransCache(text, jj.data)
      console.log("afeter", getTransCache(text))
    }

    // http.post('/one', {keywords: text})
    //   .then(response => {
    //     console.log("response.data",response.data);
    //     // let resJson = JSON.parse(res)
    //     let resJson = response
    //   if(resJson.code != 0) {
    //     return
    //   }

    //   sidebar.value = []
    //   generalRes.value = []
    //   contentRes.value = []
    //   let data = resJson.data
    //   let list = data.trans_list
    //   langFrom.value = data.from

    //   console.log('time', resJson.code, resJson.message, resJson.data)

    //   mainTrans.value = data.text
    //   simpleExp.value = data.reading

    //   // console.log(111, list)

    //   for (const key in list) {
    //     let item = list[key]
    //     if (item.b_type == 1){
    //       generalRes.value.push(item)
    //     } else {
    //       let ct = item.cidian
    //       contentRes.value = ct
    //       for (const kk in ct) {
    //         let iitem = ct[kk]
    //         sidebar.value.push(iitem.label)
    //       }
    //     }
    //   }
      
    //   console.log('sidebar', sidebar)
    //   console.log('generalRes', generalRes)
    //   console.log('contentRes', contentRes)

      
      
    //   delayScrollAction()
    // })
    // .catch(error => {
    //   console.error('There was an error!', error);
    // });

    
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
      <!-- <a href="#section1">综合</a>
      <a href="#section2">简明释义</a>
      <a href="#section3">Section 3</a>
      <a href="#section4">Section 4</a> -->
    </div>
    <div class="content">
      <header>
        <h1 :class="titleClass" @click="closeMsg">{{ utoolsStore.keywords }}</h1>
        <!-- <h5 class="simple-exp">{{ simpleExp }}</h5> -->
        <span class="simple-exp">{{ simpleExp }}</span>

        <!-- <h3>{{ mainTrans }}</h3> -->
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
                <li class="word-exp-li" v-for="(chd, idx1) in ct.cidian_list" :key="idx1">
                  <div v-if="langFrom == 'zh'">
                    <span class="express-text">{{ chd.words }}</span>
                  </div>
                  <div>
                    <span class="in-pos" v-if="chd.voice">{{ chd.voice }}</span>
                    <span :class="chd.voice ? 'in-trans in-tran-a' : 'in-trans'">{{ chd.explain }}</span>
                  </div>
                </li>
              </ul>
              <ul v-else>
                <li class="word-exp-li" v-for="(chd, idx1) in ct.cidian_list" :key="idx1">
                  <div v-if="langFrom == 'zh'">
                    <span class="">{{ chd.words }}</span>
                  </div>
                  <div>
                    <span class="in-pos" v-if="chd.voice">{{ chd.voice }}</span>
                    <span :class="chd.voice ? 'in-trans in-trans-a' : 'in-trans'">{{ chd.explain }}</span>
                  </div>
                </li>
              </ul>
              
              <!-- <p><span class="in-pos">adj.</span><span class="in-trans-a">快的，迅速的；系牢的，紧缚的；寻欢作乐的；不褪色的；忠实的，可靠的</span></p>
              <p><span class="in-pos">adv.</span><span class="in-trans-a">快速地；坚定地，牢固地</span></p>
              <p><span class="in-pos">v.</span><span class="in-trans-a">斋戒，禁食</span></p>
              <p><span class="in-pos">n.</span><span class="in-trans-a">斋戒，斋戒期</span></p> -->
            </div>
        </section>
        <!-- <section id="section3">
            <h2>Section 3</h2>
            <p>Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus. Phasellus in felis. Donec semper sapien a libero. Nam dui. Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius. Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.</p>
        </section>
        <section id="section4">
            <h2>Section 4</h2>
            <p>Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque. Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus. In sagittis dui vel nisl.</p>
        </section> -->
    </div>
  </div>
  
</template>
<script>

</script>

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
}

document.addEventListener("DOMContentLoaded", function() {
    // scrollWindow()
});
</script>