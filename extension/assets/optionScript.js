$("#optionSection").hide();
$("#currentItemId").hide();
// toOptionsPage();

// Navigation

function toOptionsPage() {
    $("#mainPage").hide()
    $("#optionSection").show()
};

function toMainPage() {
    $("#optionSection").hide()
    $("#mainPage").show()
}

$("#backButton").click(function () {
    toMainPage()
});

$("#cancelButton").click(function () {
    toMainPage()
});

$("#deleteButton").click(function () {
    // confirmation
    console.log('delete')
});

/* Form Logic */
$("#ButtonSetting").click(function () {
    toOptionsPage()
});

$("#emailNotif").click(function () {
    $("#emailNotification").show()
});

$("#pushNotif").click(function () {
    $("#emailNotification").hide()
});

$("#turnOffNotif").click(function () {
    $("#emailNotification").hide()
    $('#priceChangeNotif').attr("checked", false)
    $("#priceTargetOption").hide()
    $("#targetPrice").attr("checked", false)
});

$("#targetPrice").click(function () {
    $("#priceTargetOption").show()
});

$("#priceChangeNotif").click(function () {
    $("#priceTargetOption").hide()
});

// let dataDummy = {
//     targetPrice: null, // targetPriceInput
//     email: null, // emailInput
//     emailNotif: false, // emailNotif
//     pushNotif: true, // #pushNotif
//     priceChangeNotif: true // priceChange
// }

// prepareSetting(dataDummy)
function prepareSetting(object) {
    let { _id, targetPrice, email, emailNotif, pushNotif, priceChangeNotif } = object;
    $("#currentItemId").text(_id)
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
    turnOffNotifications(object);
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
    let currentItemId = $("#currentItemId").text()

    $.ajax({
        method: "PUT",
        url: `http://localhost:3001/tracks/${currentItemId}`,
        data,
    })
        .done((response) => {
            let { value } = response.data
            console.log('PUT done value', value)
            updateItems(value)
            toMainPage()
        })
        .fail((err) => {
            console.log('PUT err', err)
        })

})
