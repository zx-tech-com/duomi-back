export function TMap() {
  return new Promise(function(resolve, reject) {
    window.init = function() {
      resolve(qq)
    }
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'http://map.qq.com/api/js?v=2.exp&callback=init&key=2WVBZ-ZF2HQ-Z6X5L-GFCRI-JI4P7-THFTW&libraries=geometry'
    script.onerror = reject
    document.head.appendChild(script)
  })
}
