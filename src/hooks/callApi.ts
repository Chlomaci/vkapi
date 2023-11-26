import { ref } from 'vue'

export default function callAPI (apiMethod, params, callback) {
  if (typeof VK !== 'undefined') {
    VK.Api.call(apiMethod, params, (response) => {
      callback(response)
    })
  } else {
    console.error('VK API не загружен и не инициализирован.')
  }
}
