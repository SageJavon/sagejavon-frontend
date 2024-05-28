import mitter from '../mitt'
export function preventWindowDefault () {
  window.addEventListener('mousewheel', function (event) {
    if (event.ctrlKey === true || event.metaKey) {
      event.preventDefault()
    }
  }, { passive: false })

  window.addEventListener('contextmenu', function (event) {
    event.preventDefault()
  })
}

export function shortcutKeydown () {
  document.onkeydown = function (event) {
    // 全选节点 Ctrl + A
    if (event.ctrlKey && event.code === 'KeyA') {
      event.preventDefault()
      mitter.emit('select-all')
    }

    // 插入同级节点 Enter
    if (event.code === 'Enter') {
      event.preventDefault()
      mitter.emit('insert-brother')
    }

    // 插入子集节点 Tab
    if (event.code === 'Tab') {
      event.preventDefault()
      mitter.emit('insert-child')
    }

    // 上移节点 Ctrl + ↑
    if (event.ctrlKey && event.code === 'ArrowUp') {
      event.preventDefault()
      mitter.emit('move-up')
    }

    // 下移节点 Ctrl + ↓
    if (event.ctrlKey && event.code === 'ArrowDown') {
      event.preventDefault()
      mitter.emit('move-down')
    }

    // 剪切节点 Ctrl + X
    if (event.ctrlKey && event.code === 'KeyX') {
      event.preventDefault()
      mitter.emit('cut')
    }

    // 拷贝节点 Ctrl + C
    if (event.ctrlKey && event.code === 'KeyC') {
      event.preventDefault()
      mitter.emit('copy')
    }

    // 粘贴节点 Ctrl + V
    if (event.ctrlKey && event.code === 'KeyV') {
      event.preventDefault()
      mitter.emit('past')
    }

    // 删除节点 Delete
    if (!event.ctrlKey && event.code === 'Delete') {
      event.preventDefault()
      mitter.emit('delete')
    }

    // 上一步
    if (event.ctrlKey && event.code === 'KeyZ') {
      event.preventDefault()
      mitter.emit('step-prev')
    }

    // 下一步
    if (event.ctrlKey && event.code === 'KeyY') {
      event.preventDefault()
      mitter.emit('step-next')
    }
  }
}

export function resetcutKeydown () {
  document.onkeydown = function () {
    return true
  }
}
