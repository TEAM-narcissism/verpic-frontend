
function getTodayDate() {
    let dateObject = new Date();
    let day = dateObject.getDate();
    let month = dateObject.getMonth() + 1;

    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }


    const year = dateObject.getFullYear();
    console.log(year + '-' + month + '-' + day);
    return year + '-' + month + '-' + day;
}

export default getTodayDate;
