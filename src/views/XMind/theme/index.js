export default {
  // 彩虹色系
  primary: {
    name: 'primary',
    backgroundColor: '#fff',
    thumbColor: '#FF1493',
    relationStyle: {
      lineColor: '#00CED1',
      textColor: '#00CED1'
    },
    0: {
      getStyle: function () {
        return {
          rx: 4,
          ry: 4,
          fill: '#092933',
          stroke: '#092933',
          strokeWidth: 0,
          textStyle: {
            color: '#fff',
            fontSize: 18,
            fontWeight: 'normal'
          },
          lineStyle: {
            fill: '#092933',
            lineWidth: 2
          },
          margin: {
            _t: 10,
            _r: 20,
            _b: 10,
            _l: 20
          },
          expandColor: '#fff',
          markSize: 20,
          linkSize: 18,
          tagSize: 12,
          tagColors: ['#409eff', '#67c23a', '#e6a23c', '#f56c6c'],
          spacing: 34
        }
      }
    },
    1: {
      getStyle: function () {
        return {
          colors: ['#F9423A', '#F6A04D', '#F3D321', '#00BC7B', '#486AFF', '#4D49BE'],
          textColors: ['#fff', '#000', '#000', '#000', '#fff', '#fff'],
          rx: 4,
          ry: 4,
          stroke: 'rgba(0,0,0,0)',
          strokeWidth: 0,
          textStyle: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'normal'
          },
          lineStyle: {
            lineWidth: 2
          },
          margin: {
            _t: 10,
            _r: 20,
            _b: 10,
            _l: 20
          },
          expandColor: '#fff',
          markSize: 18,
          linkSize: 16,
          tagSize: 10,
          tagColors: ['#3dff03', '#03a3ff', '#e6a23c', '#034fff']
        }
      }
    },
    normal: {
      getStyle: function () {
        return {
          colors: ['#F9423A', '#F6A04D', '#F3D321', '#00BC7B', '#486AFF', '#4D49BE'],
          rx: 4,
          ry: 4,
          stroke: 'rgba(0,0,0,0)',
          strokeWidth: 0,
          textStyle: {
            color: '#620703',
            fontSize: 14
          },
          lineStyle: {
            lineWidth: 2
          },
          margin: {
            _t: 6,
            _r: 8,
            _b: 6,
            _l: 8
          },
          expandColor: '#fff',
          markSize: 15,
          linkSize: 15,
          tagSize: 10,
          tagColors: ['#409eff', '#67c23a', '#e6a23c', '#f56c6c']
        }
      }
    },
    select: {
      strokeWidth: 2,
      stroke: '#2EBDFF'
    },
    summaryLineColor: '#4c4c4c',
    summaryTextColor: '#4c4c4c'
  },

  // 简约系
  simplicity: {
    name: 'simplicity',
    backgroundColor: '#fff',
    thumbColor: '#68a0e5',
    relationStyle: {
      lineColor: '#548FD8',
      textColor: '#548FD8'
    },
    0: {
      getStyle: function () {
        return {
          rx: 6,
          ry: 6,
          fill: '#DCE6F8',
          stroke: '#548FD8',
          strokeWidth: 3,
          textStyle: {
            color: '#406290',
            fontSize: 18,
            fontWeight: 'bold'
          },
          lineStyle: {
            fill: '#548FD8',
            lineWidth: 2
          },
          margin: {
            _t: 10,
            _r: 20,
            _b: 10,
            _l: 20
          },
          expandColor: '#fff',
          markSize: 20,
          linkSize: 18,
          tagSize: 12,
          tagColors: ['#409eff', '#67c23a', '#e6a23c', '#f56c6c'].reverse(),
          spacing: 34
        }
      }
    },
    1: {
      getStyle: function () {
        return {
          rx: 4,
          ry: 4,
          fill: '#DCE6F8',
          stroke: 'rgb(84,143,216)',
          strokeWidth: 2,
          textStyle: {
            color: '#406290',
            fontSize: 14,
            fontWeight: 'bold'
          },
          lineStyle: {
            fill: '#659be7',
            lineWidth: 2
          },
          margin: {
            _t: 10,
            _r: 20,
            _b: 10,
            _l: 20
          },
          expandColor: '#fff',
          markSize: 18,
          linkSize: 16,
          tagSize: 10,
          tagColors: ['#409eff', '#67c23a', '#e6a23c', '#f56c6c'].reverse()
        }
      }
    },
    normal: {
      getStyle: function () {
        return {
          rx: 4,
          ry: 4,
          fill: 'transparent',
          stroke: 'rgba(0,0,0,0)',
          strokeWidth: 0,
          textStyle: {
            color: '#406290',
            fontSize: 14
          },
          lineStyle: {
            fill: '#659be7',
            lineWidth: 2
          },
          margin: {
            _t: 6,
            _r: 8,
            _b: 6,
            _l: 8
          },
          expandColor: '#fff',
          markSize: 15,
          linkSize: 15,
          tagSize: 10,
          tagColors: ['#409eff', '#67c23a', '#e6a23c', '#f56c6c'].reverse()
        }
      }
    },
    select: {
      strokeWidth: 2,
      stroke: 'rgb(46,189,255)'
    },
    summaryLineColor: '#000',
    summaryTextColor: '#000'
  },

  // 浅蓝色系
  lightBlue: {
    name: 'lightBlue',
    backgroundColor: '#fff',
    thumbColor: '#00868B',
    relationStyle: {
      lineColor: '#008B8B',
      textColor: '#008B8B'
    },
    0: {
      getStyle: function () {
        return {
          rx: 4,
          ry: 4,
          fill: '#008B8B',
          stroke: 'rgba(0,0,0,0)',
          strokeWidth: 0,
          textStyle: {
            color: '#fff',
            fontSize: 18,
            fontWeight: 'normal'
          },
          lineStyle: {
            fill: '#00868B',
            lineWidth: 2
          },
          margin: {
            _t: 10,
            _r: 20,
            _b: 10,
            _l: 20
          },
          expandColor: '#fff',
          markSize: 20,
          linkSize: 18,
          tagSize: 12,
          tagColors: ['#409eff', '#67c23a', '#e6a23c', '#f56c6c'],
          spacing: 34
        }
      }
    },
    1: {
      getStyle: function () {
        return {
          colors: ['#008B8B'],
          textColors: ['#fff'],
          rx: 4,
          ry: 4,
          stroke: 'rgba(0,0,0,0)',
          strokeWidth: 0,
          textStyle: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'normal'
          },
          lineStyle: {
            lineWidth: 2
          },
          margin: {
            _t: 10,
            _r: 20,
            _b: 10,
            _l: 20
          },
          expandColor: '#fff',
          markSize: 18,
          linkSize: 16,
          tagSize: 10,
          tagColors: ['#3dff03', '#03a3ff', '#e6a23c', '#034fff']
        }
      }
    },
    normal: {
      getStyle: function () {
        return {
          colors: ['#008B8B'],
          rx: 4,
          ry: 4,
          stroke: 'rgba(0,0,0,0)',
          strokeWidth: 0,
          textStyle: {
            color: '#4c4c4c',
            fontSize: 14
          },
          lineStyle: {
            lineWidth: 2
          },
          margin: {
            _t: 6,
            _r: 8,
            _b: 6,
            _l: 8
          },
          expandColor: '#fff',
          markSize: 15,
          linkSize: 15,
          tagSize: 10,
          tagColors: ['#409eff', '#67c23a', '#e6a23c', '#f56c6c']
        }
      }
    },
    select: {
      strokeWidth: 2,
      stroke: '#00868B'
    },
    summaryLineColor: '#008B8B',
    summaryTextColor: '#008B8B'
  },

  // 深紫色系
  deepPurple: {
    name: 'deepPurple',
    backgroundColor: '#fff',
    thumbColor: '#9370DB',
    relationStyle: {
      lineColor: '#9370DB',
      textColor: '#9370DB'
    },
    0: {
      getStyle: function () {
        return {
          rx: 4,
          ry: 4,
          fill: '#9400D3',
          stroke: 'rgba(0,0,0,0)',
          strokeWidth: 0,
          textStyle: {
            color: '#fff',
            fontSize: 18,
            fontWeight: 'normal'
          },
          lineStyle: {
            fill: '#9400D3',
            lineWidth: 2
          },
          margin: {
            _t: 10,
            _r: 20,
            _b: 10,
            _l: 20
          },
          expandColor: '#fff',
          markSize: 20,
          linkSize: 18,
          tagSize: 12,
          tagColors: ['#409eff', '#67c23a', '#e6a23c', '#f56c6c'],
          spacing: 34
        }
      }
    },
    1: {
      getStyle: function () {
        return {
          colors: ['#9932CC'],
          textColors: ['#fff', '#fff'],
          rx: 4,
          ry: 4,
          stroke: 'rgba(0,0,0,0)',
          strokeWidth: 0,
          textStyle: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'normal'
          },
          lineStyle: {
            lineWidth: 2
          },
          margin: {
            _t: 10,
            _r: 20,
            _b: 10,
            _l: 20
          },
          expandColor: '#fff',
          markSize: 18,
          linkSize: 16,
          tagSize: 10,
          tagColors: ['#3dff03', '#03a3ff', '#e6a23c', '#034fff']
        }
      }
    },
    normal: {
      getStyle: function () {
        return {
          colors: ['#9932CC'],
          rx: 4,
          ry: 4,
          stroke: 'rgba(0,0,0,0)',
          strokeWidth: 0,
          textStyle: {
            color: '#4c4c4c',
            fontSize: 14
          },
          lineStyle: {
            lineWidth: 2
          },
          margin: {
            _t: 6,
            _r: 8,
            _b: 6,
            _l: 8
          },
          expandColor: '#fff',
          markSize: 15,
          linkSize: 14,
          tagSize: 10,
          tagColors: ['#409eff', '#67c23a', '#e6a23c', '#f56c6c']
        }
      }
    },
    select: {
      strokeWidth: 2,
      stroke: '#9400D3'
    },
    summaryLineColor: '#9370DB',
    summaryTextColor: '#9370DB'
  },

  // 黑色单色
  singleBlack: {
    name: 'singleBlack',
    backgroundColor: '#fff',
    thumbColor: '#1c1212',
    relationStyle: {
      lineColor: '#1c1212',
      textColor: '#1c1212'
    },
    0: {
      getStyle: function () {
        return {
          rx: 4,
          ry: 4,
          fill: '#1c1212',
          stroke: '#1c1212',
          strokeWidth: 0,
          textStyle: {
            color: '#fff',
            fontSize: 18,
            fontWeight: 'normal'
          },
          lineStyle: {
            fill: '#1c1212',
            lineWidth: 2
          },
          margin: {
            _t: 10,
            _r: 20,
            _b: 10,
            _l: 20
          },
          expandColor: '#fff',
          markSize: 20,
          linkSize: 18,
          tagSize: 12,
          tagColors: ['#409eff', '#67c23a', '#e6a23c', '#f56c6c'],
          spacing: 34
        }
      }
    },
    1: {
      getStyle: function () {
        return {
          colors: ['#fff'],
          textColors: ['#1c1212'],
          rx: 4,
          ry: 4,
          stroke: '#1c1212',
          strokeWidth: 2,
          textStyle: {
            color: '#1c1212',
            fontSize: 16,
            fontWeight: 'normal'
          },
          lineStyle: {
            fill: '#1c1212',
            lineWidth: 2
          },
          margin: {
            _t: 10,
            _r: 20,
            _b: 10,
            _l: 20
          },
          expandColor: '#fff',
          markSize: 18,
          linkSize: 16,
          tagSize: 10,
          tagColors: ['#3dff03', '#03a3ff', '#e6a23c', '#034fff']
        }
      }
    },
    normal: {
      getStyle: function () {
        return {
          colors: ['#1c1212'],
          rx: 4,
          ry: 4,
          fill: '#fff',
          stroke: '#1c1212',
          strokeWidth: 2,
          textStyle: {
            color: '#1c1212',
            fontSize: 14
          },
          lineStyle: {
            fill: '#1c1212',
            lineWidth: 2
          },
          margin: {
            _t: 6,
            _r: 8,
            _b: 6,
            _l: 8
          },
          expandColor: '#fff',
          markSize: 15,
          linkSize: 14,
          tagSize: 10,
          tagColors: ['#409eff', '#67c23a', '#e6a23c', '#f56c6c']
        }
      }
    },
    select: {
      strokeWidth: 2,
      stroke: '#2EBDFF'
    },
    summaryLineColor: '#1c1212',
    summaryTextColor: '#1c1212'
  },

  // 蓝黑基础版
  blueBlackBasic: {
    name: 'blueBlackBasic',
    backgroundColor: '#fff',
    thumbColor: '#5d7ad9',
    relationStyle: {
      lineColor: '#000',
      textColor: '#000'
    },
    0: {
      getStyle: function () {
        return {
          rx: 4,
          ry: 4,
          fill: '#5d7ad9',
          stroke: '#5d7ad9',
          strokeWidth: 0,
          textStyle: {
            color: '#fff',
            fontSize: 18,
            fontWeight: 'normal'
          },
          lineStyle: {
            fill: '#5d7ad9',
            lineWidth: 2
          },
          margin: {
            _t: 10,
            _r: 20,
            _b: 10,
            _l: 20
          },
          expandColor: '#fff',
          markSize: 20,
          linkSize: 18,
          tagSize: 12,
          tagColors: ['#409eff', '#67c23a', '#e6a23c', '#f56c6c'],
          spacing: 34
        }
      }
    },
    1: {
      getStyle: function () {
        return {
          colors: ['#eff2f5'],
          textColors: ['#000'],
          rx: 4,
          ry: 4,
          stroke: '#eff2f5',
          strokeWidth: 2,
          textStyle: {
            color: '#1c1212',
            fontSize: 16,
            fontWeight: 'normal'
          },
          lineStyle: {
            fill: '#354359',
            lineWidth: 2
          },
          margin: {
            _t: 10,
            _r: 20,
            _b: 10,
            _l: 20
          },
          expandColor: '#fff',
          markSize: 18,
          linkSize: 16,
          tagSize: 10,
          tagColors: ['#3dff03', '#03a3ff', '#e6a23c', '#034fff']
        }
      }
    },
    normal: {
      getStyle: function () {
        return {
          colors: ['#fff'],
          rx: 4,
          ry: 4,
          fill: '#fff',
          stroke: '#fff',
          strokeWidth: 0,
          textStyle: {
            color: '#000',
            fontSize: 14
          },
          lineStyle: {
            fill: '#354359',
            lineWidth: 2
          },
          margin: {
            _t: 6,
            _r: 8,
            _b: 6,
            _l: 8
          },
          expandColor: '#fff',
          markSize: 15,
          linkSize: 14,
          tagSize: 10,
          tagColors: ['#409eff', '#67c23a', '#e6a23c', '#f56c6c']
        }
      }
    },
    select: {
      strokeWidth: 2,
      stroke: '#2EBDFF'
    },
    summaryLineColor: '#000',
    summaryTextColor: '#000'
  },

  // 卡通版
  cartoon: {
    name: 'cartoon',
    backgroundColor: '#fff',
    thumbColor: '#92B4EC',
    relationStyle: {
      lineColor: '#B1E2FD',
      textColor: '#B1E2FD'
    },
    0: {
      getStyle: function () {
        return {
          rx: 4,
          ry: 4,
          fill: '#92B4EC',
          stroke: '#92B4EC',
          strokeWidth: 0,
          textStyle: {
            color: '#333',
            fontSize: 18,
            fontWeight: 'normal'
          },
          lineStyle: {
            fill: '#92B4EC',
            lineWidth: 2
          },
          margin: {
            _t: 10,
            _r: 20,
            _b: 10,
            _l: 20
          },
          expandColor: '#fff',
          markSize: 20,
          linkSize: 18,
          tagSize: 12,
          tagColors: ['#409eff', '#67c23a', '#e6a23c', '#f56c6c'],
          spacing: 34
        }
      }
    },
    1: {
      getStyle: function () {
        return {
          colors: ['#B1E2FD', '#FFC7C7', '#FFE69A'],
          textColors: ['#333', '#333', '#333'],
          rx: 4,
          ry: 4,
          stroke: 'rgba(0,0,0,0)',
          strokeWidth: 0,
          textStyle: {
            fontSize: 16,
            fontWeight: 'normal'
          },
          lineStyle: {
            lineWidth: 2
          },
          margin: {
            _t: 10,
            _r: 20,
            _b: 10,
            _l: 20
          },
          expandColor: '#fff',
          markSize: 18,
          linkSize: 16,
          tagSize: 10,
          tagColors: ['#3dff03', '#03a3ff', '#e6a23c', '#034fff']
        }
      }
    },
    normal: {
      getStyle: function () {
        return {
          colors: ['#B1E2FD', '#FFC7C7', '#FFE69A'],
          rx: 4,
          ry: 4,
          stroke: 'rgba(0,0,0,0)',
          strokeWidth: 0,
          textStyle: {
            fontSize: 14
          },
          lineStyle: {
            lineWidth: 2
          },
          margin: {
            _t: 6,
            _r: 8,
            _b: 6,
            _l: 8
          },
          expandColor: '#fff',
          markSize: 15,
          linkSize: 15,
          tagSize: 10,
          tagColors: ['#409eff', '#67c23a', '#e6a23c', '#f56c6c']
        }
      }
    },
    select: {
      strokeWidth: 2,
      stroke: '#2EBDFF'
    },
    summaryLineColor: '#B1E2FD',
    summaryTextColor: '#B1E2FD'
  },

  // 深蓝色系
  deepBlue: {
    name: 'deepBlue',
    backgroundColor: '#fff',
    thumbColor: '#3f51b5',
    relationStyle: {
      lineColor: '#3f51b5',
      textColor: '#3f51b5'
    },
    0: {
      getStyle: function () {
        return {
          rx: 4,
          ry: 4,
          fill: '#3f51b5',
          stroke: 'rgba(0,0,0,0)',
          strokeWidth: 0,
          textStyle: {
            color: '#fff',
            fontSize: 18,
            fontWeight: 'normal'
          },
          lineStyle: {
            fill: '#3f51b5',
            lineWidth: 2
          },
          margin: {
            _t: 10,
            _r: 20,
            _b: 10,
            _l: 20
          },
          expandColor: '#fff',
          markSize: 20,
          linkSize: 18,
          tagSize: 12,
          tagColors: ['#409eff', '#67c23a', '#e6a23c', '#f56c6c'],
          spacing: 34
        }
      }
    },
    1: {
      getStyle: function () {
        return {
          colors: ['#3f51b5'],
          textColors: ['#fff', '#fff'],
          rx: 4,
          ry: 4,
          stroke: 'rgba(0,0,0,0)',
          strokeWidth: 0,
          textStyle: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'normal'
          },
          lineStyle: {
            lineWidth: 2
          },
          margin: {
            _t: 10,
            _r: 20,
            _b: 10,
            _l: 20
          },
          expandColor: '#fff',
          markSize: 18,
          linkSize: 16,
          tagSize: 10,
          tagColors: ['#3dff03', '#03a3ff', '#e6a23c', '#034fff']
        }
      }
    },
    normal: {
      getStyle: function () {
        return {
          colors: ['#3f51b5'],
          rx: 4,
          ry: 4,
          stroke: 'rgba(0,0,0,0)',
          strokeWidth: 0,
          textStyle: {
            color: '#4c4c4c',
            fontSize: 14
          },
          lineStyle: {
            lineWidth: 2
          },
          margin: {
            _t: 6,
            _r: 8,
            _b: 6,
            _l: 8
          },
          expandColor: '#fff',
          markSize: 15,
          linkSize: 14,
          tagSize: 10,
          tagColors: ['#409eff', '#67c23a', '#e6a23c', '#f56c6c']
        }
      }
    },
    select: {
      strokeWidth: 2,
      stroke: '#3f51b5'
    },
    summaryLineColor: '#3f51b5',
    summaryTextColor: '#3f51b5'
  }
}
