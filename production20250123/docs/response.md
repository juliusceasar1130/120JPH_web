const loadHistoryData = async () => {
  loading.value = true
  try {
    const params: CleanHistoryQueryParams = {
      skidId: skidId.value,
      page: currentPage.value,
      size: pageSize.value,
      cleanStatus: filters.cleanStatus || undefined,
      timeRange: filters.timeRange.length === 2 ? filters.timeRange : undefined
    }
    
    const res = await getSkidCleanHistory(params)
    
    if (res.ok && res.data) {
      historyList.value = res.data.records.map(item => ({
        id: item.id,
        inspectionTime: item.inspectionTime,
        cleanStatus: item.cleanStatus,
        inspector: item.inspector,
        inspectionMethod: item.inspectionMethod,
        remarks: item.remarks || '',
        photos: item.photos || []
      }))
      total.value = res.data.total
    } else {
      console.error('获取历史数据失败:', res.message)
      historyList.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('获取历史数据出错:', error)
    // 移除使用模拟数据的代码，只保留错误处理
    historyList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}