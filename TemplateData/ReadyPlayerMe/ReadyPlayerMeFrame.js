rpmHideButton.onclick = function () {
    if (document.fullscreenElement) {
        canvasWrapper.requestFullscreen();
    }
    rpmContainer.style.display = "none";
};


function setupRpmFrame(url) {
    rpmFrame.src = url;

    window.addEventListener("message", subscribe);
    document.addEventListener("message", subscribe);
    function subscribe(event) {
        const json = parse(event);
        if (
            unityGame == null ||
            json?.source !== "readyplayerme" ||
            json?.eventName == null
        ) {
            return;
        }

        // Subscribe to all events sent from Ready Player Me once frame is ready
        if (json.eventName === "v1.frame.ready") {
            rpmFrame.contentWindow.postMessage(
                JSON.stringify({
                    target: "readyplayerme",
                    type: "subscribe",
                    eventName: "v1.**",
                }),
                "*"
            );
        }

        // Get avatar GLB URL
        if (json.eventName === "v1.avatar.exported") {
            hideRpm();
            unityGame.SendMessage(
                "WebGLContainer", // Target GameObject name
                "OnAvatarUrlReceived", // Name of function to run
                json.data.url
            );
        }

        if (json.eventName === "v1.user.set") {
            console.log(`User with id ${json.data.id} set: ${JSON.stringify(json)}`);
        }
    }

    function parse(event) {
        try {
            return JSON.parse(event.data);
        } catch (error) {
            return null;
        }
    }
}

function showRpm() {
    rpmContainer.style.display = "block";
}

function hideRpm() {
    rpmContainer.style.display = "none";
    rpmFrame.src = rpmFrame.src;
}
