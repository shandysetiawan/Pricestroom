
$("#ButtonSetting").click(function () {
    $("#optionSection").show()
    $("#MainPage").hide()
    $("#emailNotification").hide()
    $("#priceTargetOption").hide()

})

$("#emailNotif").click(function () {
    $("#emailNotification").show()
    $("#MainPage").hide()

})

$("#pushNotif").click(function () {
    $("#emailNotification").hide()
    $("#MainPage").hide()

})

$("#targetPrice").click(function () {
    $("#priceTargetOption").show()
    $("#emailNotification").hide()
    $("#MainPage").hide()

})

$("#priceChange").click(function () {
    $("#priceTargetOption").hide()
    $("#emailNotification").hide()
    $("#MainPage").hide()

})


$("#applySetting").click(function () {

    let selectedOption1 = $("input:radio[name=watcher]:checked").val()
    let selectedOption2 = $("input:radio[name=notif]:checked").val()

    let editSetting = {
        emailNotif: $('#emailNotif').val(),
        pushNotif: $('#pushNotif').val(),
        priceChangeNotif: $('#priceChange').val(),
        email: $('#emailOption').val(),
        targetPrice: $('#targetPrice').val()
    }

    console.log('hit here')
    console.log(editSetting)
    console.log(editSetting)


    // $.ajax({
    //     method: "PUT",
    //     url: `http://localhost:3001/tracks/${currentItemId}`,
    //     data: { email, targetPrice },
    // })
    //     .done((success) => {
    //         console.log(success)

    //         // console.log("ke success ga")

    //     })
    //     .fail((err) => {

    //         console.log(err)
    //     })

})