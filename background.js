function toggleDebugStylesheet(state) {
  var path = 'turbo-frame/debug.css'
  var href = chrome.runtime.getURL(path)
  var linkElement = document.querySelectorAll('link[href="' + href + '"]')[0]
  var turboFrames = document.querySelectorAll('turbo-frame')

  if (!turboFrames.length) return

  if (state === 'OFF' && linkElement) {
    linkElement.remove()
  }
  else if (state === 'ON') {
    var head = document.getElementsByTagName('head')[0]
    var link = document.createElement('link')
    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.href = chrome.runtime.getURL(path)
    head.appendChild(link)
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url.includes('chrome://')) return;

  const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
  const nextState = prevState === 'ON' ? 'OFF' : 'ON'

  chrome.action.setBadgeText({
    text: nextState,
  });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: toggleDebugStylesheet,
    args: [nextState]
  })
});

