import { defineStore } from 'pinia'
import { reqCPDataVoByQuery } from '@/api/changePoint'
import type { query, cpResultList } from '@/api/changePoint/type'
//参数跟踪全局组件
let useTraceStore = defineStore('Trace', {
    state: () => {
        return {
            query: {
                areaCh: '',
                line: '',
                startTime: '',
                endTime: '',
            },
            cpResult: [],

        }
    },
    actions: {
        async reqCPDataVoByQuery(pageNo: number, pageSize: number, query: query) {
            let result = await reqCPDataVoByQuery(pageNo, pageSize, query)
            if (result.code == 200) {
                this.cpResult = result.data.pageData
            }
        },

    },
    getters: {

    },
})
export default useTraceStore