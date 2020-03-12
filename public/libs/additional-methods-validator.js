$.validator.addMethod('notSpaceAllow', function (value) {
    value = value.trim();
    if (value.length < 1) { return false; }
    return /^\S*$/.test(value);
});

$.validator.addMethod('isEmail', function (value) {
    if (!value) {
        return true;
    };
    let filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return filter.test(value) ? true : false;
});

// $.validator.addMethod('isMobile', function (value) {
//     if (!value) {
//         return false;
//     };
//     if (String(value).length < 10 || String(value).length > 11) {
//         return false;
//     };
//     var fistNumber = value.substr(0, 2);
//     var notMobile = /00|10|20|30|40|50|60|70|80|90/i;
//     var checkTwoFirstNumber = !notMobile.test(fistNumber);
//     var regex = /(01|02|03|04|05|06|07|08|09[0|1|2|3|4|5|6|7|8|9])+([0-9]{7,8})/i;
//     var checkMobile = regex.test(value);
//     return checkTwoFirstNumber && checkMobile;
// });

$.validator.addMethod('isMobile', function (value) {
    if(!value) {  return true };
    value = String(value).replace('+', '');
    const regex = /([0-9])\b/;
    if (!regex.test(value)) { return false; }
    const fistNumber = value.substr(0, 2);
    // check phone by area code
    const isMobileAreaCode = /84/i;
    if (isMobileAreaCode.test(fistNumber)) {
        if (value.length < 11 || value.length > 12) { return false; }
        return true;
    }

    if (value.length < 10 || value.length > 11) { return false; }
    const isMobile = /01|02|03|04|05|06|07|08|09/i;
    const checkTwoFirstNumber = isMobile.test(fistNumber);
    return checkTwoFirstNumber;
});