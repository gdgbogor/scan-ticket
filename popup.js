
const statusEl = document.getElementById("status")
const elName = document.getElementById("name")

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}
const currentTab = await getCurrentTab();
console.log(currentTab.url)
console.log(currentTab.id)

const tabId = currentTab.id

var isChecking = false;
const attendees = []
async function getData() {
    const xs = [];
    const ys = [];
    const response = await fetch('attendees.csv');
    const data = await response.text();
    const table = data.split(/\n/).slice(1);
    table.forEach(row => {
        // console.log(row)
        const columns = row.split(',');
        attendees.push({
            "ticket": columns[1],
            "name": columns[2] + ' ' + columns[3],
            "date": columns[18]
        })
    })

    console.log('attendees', attendees)
}

getData();

// When scan is successful function will produce data
async function onScanSuccess(qrCodeMessage) {
    console.log(qrCodeMessage)

    if (isChecking) return
    isChecking = true;
    // status.style.display = "block";
    console.log('siniii')
    const id = qrCodeMessage.split(":")[1]
    const attendee = findAttendees(id)
    console.log(attendee)
    statusEl.style.display = "block"
    if (attendee === undefined) {
        elName.innerText = ""
        statusEl.innerText = "Peserta tidak ditemukan.\nPeriksa kembali tiket peserta atau daftar manual di bawah. Pastikan CSV sudah paling update."
        statusEl.style.backgroundColor = "red"

    } else {
        elName.innerText = attendee.name
        statusEl.innerText = "Peserta Terdeteksi. Tandai Check-in di bawah"
        statusEl.style.backgroundColor = "green"


        await chrome.tabs.sendMessage(tabId, { message: "checkAttendance", attendee: attendee });
        await new Promise(resolve => setTimeout(resolve, 3000));
        statusEl.style.display = "none"
        console.log('dah')
    }
    // var date = new Date(attendee.date);
    // // var dateRegis = new Date('Mar 15, 2023 - 11:15 pm');
    // console.log(date)
    // console.log(moment(date).format('MMM D, yyyy - hh:mm a'))
    // // console.log(dateRegis)
    // // date.toString()
    // console.log('attendee', attendee)
    // console.log('tabId', tabId)
    // status.style.display = "none"
    isChecking = false;
}

function findAttendees(id) {
    // console.log('sinikkk', attendees)
    return attendees.find(el => {
        try {
            return el.ticket.includes(id)
        } catch (error) {
            return null
        }
    })
}

// When scan is unsuccessful fucntion will produce error message
function onScanFailure(errorMessage) {
    // Handle Scan Error
}

let html5QrcodeScanner = new Html5QrcodeScanner(
    "reader",
    { fps: 2, qrbox: { width: 750, height: 750 } },
    /* verbose= */ false);
html5QrcodeScanner.render(onScanSuccess, onScanFailure);