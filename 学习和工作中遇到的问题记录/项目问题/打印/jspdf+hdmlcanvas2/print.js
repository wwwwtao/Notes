// 页面导出为pdf格式 //title表示为下载的标题，html表示document.querySelector('#myPrintHtml')

import html2Canvas from 'html2canvas'

import JsPDF from 'jspdf'

const htmlPdf = {
  getPdf(title, html) {
    html2Canvas(html, {
      allowTaint: true,
      useCORS: true,
      dpi: window.devicePixelRatio * 2, // 将分辨率提高到特定的DPI 提高四倍
      background: '#FFFFFF',
    }).then((canvas) => {
      // 未生成pdf的html页面高度
      let leftHeight = canvas.height

      const a4Width = 595.28
      const a4Height = 841.89 // A4大小，210mm x 297mm，四边各保留10mm的边距，显示区域190x277
      // 一页pdf显示html页面生成的canvas高度;
      const a4HeightRef = Math.floor((canvas.width / a4Width) * a4Height)

      // pdf页面偏移
      let position = 0

      const pageData = canvas.toDataURL('image/jpeg', 1.0)

      const pdf = JsPDF('p', 'pt', 'a4') // A4纸，纵向
      let index = 1
      const canvas1 = document.createElement('canvas')
      let height
      pdf.setDisplayMode('fullwidth', 'continuous', 'FullScreen')

      function createImpl(canvas) {
        console.log(leftHeight, a4HeightRef)
        if (leftHeight > 0) {
          index++

          let checkCount = 0
          if (leftHeight > a4HeightRef) {
            let i = position + a4HeightRef
            for (i = position + a4HeightRef; i >= position; i--) {
              let isWrite = true
              for (let j = 0; j < canvas.width; j++) {
                const c = canvas.getContext('2d').getImageData(j, i, 1, 1).data

                if (c[0] != 0xFF || c[1] != 0xFF || c[2] != 0xFF) {
                  isWrite = false
                  break
                }
              }
              if (isWrite) {
                checkCount++
                if (checkCount >= 10) {
                  break
                }
              }
              else {
                checkCount = 0
              }
            }
            height = Math.round(i - position) || Math.min(leftHeight, a4HeightRef)
            if (height <= 0) {
              height = a4HeightRef
            }
          }
          else {
            height = leftHeight
          }

          canvas1.width = canvas.width
          canvas1.height = height

          console.log(index, 'height:', height, 'pos', position)

          const ctx = canvas1.getContext('2d')
          ctx.drawImage(
            canvas,
            0,
            position,
            canvas.width,
            height,
            0,
            0,
            canvas.width,
            height,
          )

          const pageHeight = Math.round((a4Width / canvas.width) * height)
          if (position != 0) {
            // 创建新页面时设置页面大小
            pdf.addPage([a4Width, pageHeight])
          }
          pdf.addImage(
            canvas1.toDataURL('image/jpeg', 1.0),
            'JPEG',
            10,
            10,
            a4Width,
            (a4Width / canvas1.width) * height,
          )
          leftHeight -= height
          position += height
          if (leftHeight > 0) {
            setTimeout(createImpl, 500, canvas)
          }
          else {
            pdf.save(`${title}.pdf`)
          }
        }
      }

      // 当内容未超过pdf一页显示的范围，无需分页
      if (leftHeight < a4HeightRef) {
        pdf.addImage(
          pageData,
          'JPEG',
          0,
          0,
          a4Width,
          (a4Width / canvas.width) * leftHeight,
        )
        pdf.save(`${title}.pdf`)
      }
      else {
        try {
          pdf.deletePage(0)
          setTimeout(createImpl, 500, canvas)
        }
        catch (err) {
          console.log(err)
        }
      }
    })
  },
}

export default htmlPdf
