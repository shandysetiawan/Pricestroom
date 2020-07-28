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
    let { _id, targetPrice, email, emailNotif, priceChangeNotif } = object;
    $("#currentItemId").text(_id)
    $('#emailNotif').attr("checked", emailNotif);
    $('#pushNotif').attr("checked", !emailNotif);
    $('#priceChangeNotif').attr("checked", priceChangeNotif);
    if (emailNotif) $("#emailNotification").show();
    else $("#emailNotification").hide();
    $("#emailInput").val(email);
    if (targetPrice > 0) {
        $("#targetPrice").attr("checked", (targetPrice));
        $("#priceTargetOption").show();
    } else {
        $("#targetPrice").attr("checked", (targetPrice));
        $("#priceTargetOption").hide();
    }
    $("#targetPriceInput").val(targetPrice);
}

$("#applySetting").click(function () {
    let data = {
        targetPrice: Number($("#targetPriceInput").val()),
        email: String($("#emailInput").val()),
        priceChangeNotif: $('#priceChangeNotif').prop("checked"),
        pushNotif: false
    }
    if (data.priceChangeNotif) data.targetPrice = null

    console.log('applySetting', data)
    let currentItemId = $("#currentItemId").text()

    $.ajax({
        method: "PUT",
        url: `${url}/${currentItemId}`,
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
