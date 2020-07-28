$("#optionSection").hide();
$("#currentItemId").hide();

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

function prepareSetting(object) {
    let { _id, targetPrice, email, emailNotif, priceChangeNotif } = object;
    $("#currentItemId").text(_id);

    $("#emailInput").val(email);
    if (emailNotif) {
        $("#emailNotification").show();
        $('#emailNotif').attr("checked", true);
    } else {
        $('#pushNotif').attr("checked", true);
        $("#emailNotification").hide();
    }

    $('#priceChangeNotif').attr("checked", priceChangeNotif);

    $("#targetPriceInput").val(targetPrice);
    if (targetPrice > 0) {
        $("#targetPrice").attr("checked", true);
        $("#priceTargetOption").show();
    } else {
        $("#targetPrice").attr("checked", false);
        $("#priceTargetOption").hide();
    }
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
