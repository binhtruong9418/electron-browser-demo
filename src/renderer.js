const urlbar = document.getElementById('urlbar');
const tabsContainer = document.getElementById('tabs');
const webviewsContainer = document.getElementById('webviews-container');
let tabCounter = 0;

document.getElementById('backBtn').addEventListener('click', () => getActiveWebview().goBack());
document.getElementById('forwardBtn').addEventListener('click', () => getActiveWebview().goForward());
document.getElementById('reloadBtn').addEventListener('click', () => getActiveWebview().reload());
document.getElementById('homeBtn').addEventListener('click', () => loadUrl('https://www.google.com'));
document.getElementById('newWindowBtn').addEventListener('click', () => window.electronAPI.newWindow());
document.getElementById('newTabBtn').addEventListener('click', () => addNewTab());

urlbar.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        loadUrl(urlbar.value);
    }
});

function loadUrl(url) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    getActiveWebview().src = url;
}

function getActiveWebview() {
    return document.querySelector('.webview.active');
}

function addNewTab() {
    tabCounter++;
    const tabId = `tab-${tabCounter}`;
    const webviewId = `webview-${tabCounter}`;

    // Create new tab
    const newTab = document.createElement('div');
    newTab.className = 'tab';
    newTab.id = tabId;
    newTab.innerHTML = `
        <span class="tab-title">New Tab</span>
        <span class="tab-close material-icons">close</span>
    `;
    tabsContainer.insertBefore(newTab, document.getElementById('newTabBtn'));

    // Create new webview
    const newWebview = document.createElement('webview');
    newWebview.id = webviewId;
    newWebview.className = 'webview';
    newWebview.src = 'https://www.google.com';
    webviewsContainer.appendChild(newWebview);

    // Set up event listeners
    newTab.addEventListener('click', () => activateTab(tabId));
    newTab.querySelector('.tab-close').addEventListener('click', (e) => {
        e.stopPropagation();
        closeTab(tabId);
    });
    setupWebviewListeners(newWebview, tabId);

    activateTab(tabId);
}

function activateTab(tabId) {
    // Deactivate all tabs and webviews
    document.querySelectorAll('.tab, .webview').forEach(el => el.classList.remove('active'));

    // Activate the selected tab and its corresponding webview
    const tab = document.getElementById(tabId);
    const webview = document.getElementById(tabId.replace('tab', 'webview'));
    tab.classList.add('active');
    webview.classList.add('active');

    // Update URL bar
    urlbar.value = webview.src;
}

function closeTab(tabId) {
    const tab = document.getElementById(tabId);
    const webview = document.getElementById(tabId.replace('tab', 'webview'));
    tab.remove();
    webview.remove();

    // If the closed tab was active, activate another tab
    if (tab.classList.contains('active')) {
        const remainingTabs = document.querySelectorAll('.tab');
        if (remainingTabs.length > 0) {
            activateTab(remainingTabs[remainingTabs.length - 1].id);
        }
    }

    // If no tabs left, create a new one
    if (document.querySelectorAll('.tab').length === 0) {
        addNewTab();
    }
}

function setupWebviewListeners(webview, tabId) {
    webview.addEventListener('did-start-loading', () => {
        urlbar.value = webview.src;
    });

    webview.addEventListener('did-navigate', (event) => {
        urlbar.value = event.url;
    });

    webview.addEventListener('page-title-updated', (event) => {
        const tab = document.getElementById(tabId);
        tab.querySelector('.tab-title').textContent = event.title;
    });

    webview.addEventListener('page-favicon-updated', (event) => {
        // You can add favicon support here if desired
    });
}

// Initialize the first tab
addNewTab();