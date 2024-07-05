
import { defineStore } from "pinia"

export const uToolsStore = defineStore("utools", {
    state: () => ({
        iutools : utools,
        keywords: ''
    }),
    actions: {
        onPluginEnter(any, inputCallback) {
            this.iutools.onPluginEnter(({code, type, payload, option}) => {
                console.log('用户进入插件应用', code, type, payload, option)
                
                this.iutools.setSubInput(({ text }) => {
                    this.keywords = text
                    // console.log('here', this.keywords)
                    if (typeof inputCallback  != 'undefined' && typeof inputCallback == 'function') {
                        inputCallback(text)
                    }
                }, '输入翻译词')

                if (code != payload) {
                    this.iutools.setSubInputValue(payload)
                }
                
            })
        }
    }
})
