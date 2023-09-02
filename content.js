console.log('Tab script:');

chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");

        // document.body.style.backgroundColor = "orange";
        function getElementByXpath(path) {
            return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        }

        const inputField = getElementByXpath("/html/body/div[1]/div/div[3]/div/div/div[2]/div/div/div[2]/div/div[1]/div/div[1]/div/div/div/div/input")
        inputField.focus()
        inputField.value = request.attendee.name

        var event = new UIEvent("change", {
            "view": window,
            "bubbles": true,
            "cancelable": true
        });
        inputField.dispatchEvent(event);
        console.log('tunggu')
        // await new Promise(resolve => setTimeout(resolve, 5000));
        // console.log('nah')

        // const checkField = getElementByXpath("/html/body/div[1]/div/div[3]/div/div/div[2]/div/div/div[2]/div/div[2]/div/div/div/div[1]/div[2]/div/div/div/div[5]/div/span/span[1]/input")
        // checkField.checked = true
        // var event = new UIEvent("change", {
        //     "view": window,
        //     "bubbles": true,
        //     "cancelable": true
        // });
        // checkField.dispatchEvent(event);
        // checkField.checked = true
        // simulateMouseClick(checkField);
        // checkField.dispatchEvent(
        //     new MouseEvent(mouseEventType, {
        //         view: window,
        //         bubbles: true,
        //         cancelable: true,
        //         buttons: 1
        //     })
        // )

        const mouseClickEvents = ['mousedown', 'click', 'mouseup'];
        function simulateMouseClick(element) {
            mouseClickEvents.forEach(mouseEventType =>
                element.dispatchEvent(
                    new MouseEvent(mouseEventType, {
                        view: window,
                        bubbles: true,
                        cancelable: true,
                        buttons: 1
                    })
                )
            );
        }

        // if (request.attendee)
        //     sendResponse({ farewell: "goodbye" });
    }

);