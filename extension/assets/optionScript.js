$("#optionSection").hide();
// toOptionsPage();

function toOptionsPage() {
    $("#MainPage").hide()
    $("#optionSection").show()
    $("#emailNotification").hide()
    $("#priceTargetOption").hide()
};

$("#ButtonSetting").click(function () {
    toOptionsPage()
})

$("#emailNotif").click(function () {
    $("#emailNotification").show()
})

$("#pushNotif").click(function () {
    $("#emailNotification").hide()
})

$("#turnOffNotif").click(function () {
    $("#emailNotification").hide()
    $('#priceChangeNotif').attr("checked", false)
    $("#priceTargetOption").hide()
    $("#targetPrice").attr("checked", false)
})

$("#targetPrice").click(function () {
    $("#priceTargetOption").show()
})

$("#priceChangeNotif").click(function () {
    $("#priceTargetOption").hide()
})

let dataDummy = {
    targetPrice: null, // targetPriceInput
    email: null, // emailInput
    emailNotif: false, // emailNotif
    pushNotif: true, // #pushNotif
    priceChangeNotif: true // priceChange
}

// prepareSetting(dataDummy)
function prepareSetting(object) {
    let { targetPrice, email, emailNotif, pushNotif, priceChangeNotif } = object;
    if (pushNotif) $('#pushNotif').attr("checked", pushNotif);
    else if (emailNotif) $('#emailNotif').attr("checked", emailNotif);
    $('#priceChangeNotif').attr("checked", priceChangeNotif);
    if (emailNotif) $("#emailNotification").show();
    else $("#emailNotification").hide();
    $("#emailInput").val(email);
    if (targetPrice > 0) {
        $("#targetPrice").attr("checked", true);
        $("#priceTargetOption").show();
    } else {
        $("#targetPrice").attr("checked", false);
        $("#priceTargetOption").hide();
    }
    $("#targetPriceInput").val(targetPrice);
    turnOffNotifications(object)
}

function turnOffNotifications(object) {
    let condition
    let { emailNotif, pushNotif } = object
    if (emailNotif || pushNotif) condition = false
    else condition = true
    if (condition) {
        object.targetPrice = null
        $('#priceChangeNotif').attr("checked", false)
        $("#priceTargetOption").hide()
        $("#targetPrice").attr("checked", false)
    }
    $("#turnOffNotif").attr("checked", condition)
};

$("#applySetting").click(function () {
    let currentItemId = "5f1c80902676be4cc7e6a97a"
    let data = {
        targetPrice: Number($("#targetPriceInput").val()),
        email: String($("#emailInput").val()),
        emailNotif: $('#emailNotif').prop("checked"),
        pushNotif: $('#pushNotif').prop("checked"),
        priceChangeNotif: $('#priceChangeNotif').prop("checked")
    }
    if (!data.emailNotif) data.email = null
    if (data.priceChangeNotif) data.targetPrice = null
    prepareSetting(data)

    console.log(data)

    $.ajax({
        method: "PUT",
        url: `http://localhost:3001/tracks/${currentItemId}`,
        data,
    })
        .done((response) => {
            console.log('PUT done', response)
        })
        .fail((err) => {
            console.log('PUT err', err)
        })

})
