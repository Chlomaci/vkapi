export function loadVKAPI() {
  return new Promise(function(resolve, reject) {
    var el = document.createElement("script");
    el.type = "text/javascript";
    el.src = "https://vk.com/js/api/openapi.js?169";
    el.onload = resolve;
    el.onerror = reject;
    document.getElementById("vk_api_transport").appendChild(el);
  });
}

export function initVKAPI(apiId) {
  return new Promise(function(resolve, reject) {
    VK.init({
      apiId: apiId,
      status: true,
      onlyWidgets: true,
      callback: function() {
        resolve();
      }
    });
  });
}

