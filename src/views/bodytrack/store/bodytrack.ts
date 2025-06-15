import { defineStore } from 'pinia'
import { reqtraceSearchByFis } from '@/api/bodyTrack'
//参数跟踪全局组件
let useBodyTrack = defineStore('bodytrack', {
    state: () => {
        return {
            query: {
                fis: '',               
            },
            Result:'',

        }
    },
    actions: {
        // async reqCPDataVoByQuery(pageNo: number, pageSize: number, query: query) {
        //     let result = await reqCPDataVoByQuery(pageNo, pageSize, query)
        //     if (result.code == 200) {
        //         this.cpResult = result.data.pageData
        //     }
        // },
        async reqtraceSearchByFis(fis: any) {
            let result = await reqtraceSearchByFis(fis)
            if (result.code == 200) {
                this.Result = result.data.data
            }
        },

    },
    getters: {

    },
})
export default useBodyTrack