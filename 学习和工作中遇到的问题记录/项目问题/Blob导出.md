```js
exportFile() {
  console.log('导出')
  eamEquipmentTypeExport().then((res) => {
    let fileName = '规格型号'
    let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
    let link = document.createElement('a')
    link.download = fileName + '.xlsx'
    link.href = URL.createObjectURL(blob)
    link.style.display = 'none' //
    document.body.appendChild(link)
    link.click()
    URL.revokeObjectURL(link.href)
    document.body.removeChild(link)
  })
},
```
