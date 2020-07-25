$("#optionSection").hide();
// editOptionsPage();

function editOptionsPage() {
    $("#MainPage").hide()
    $("#optionSection").show()
    $("#emailNotification").hide()
    $("#priceTargetOption").hide()
};

$("#ButtonSetting").click(function () {
    editOptionsPage()
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

prepareSetting(dataDummy)
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
}

turnOffNotification(dataDummy)
function turnOffNotification(object) {
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
    let currentItemId = "5f1c7ac306968d4315dd400c"
    let data = {
        targetPrice: Number($("#targetPriceInput").val()),
        email: String($("#emailInput").val()),
        emailNotif: Boolean($('#emailNotif').prop("checked")),
        pushNotif: Boolean($('#pushNotif').prop("checked")),
        priceChangeNotif: Boolean($('#priceChangeNotif').prop("checked"))
    }
    if (!data.emailNotif) data.email = null
    if (data.priceChangeNotif) data.targetPrice = null
    prepareSetting(data)
    turnOffNotification(data)

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

    // let selectedOption1 = $("input:radio[name=watcher]:checked").val()
    // let selectedOption2 = $("input:radio[name=notif]:checked").val()

    // let editSetting = {
    //     pushNotif: $('#pushNotif').val(),
    //     priceChangeNotif: $('#priceChange').val(),
    //     email: $('#emailOption').val(),
    //     targetPrice: $('#targetPrice').val()
    // }

    // console.log('hit here')
    // console.log(editSetting)
    // console.log(editSetting)