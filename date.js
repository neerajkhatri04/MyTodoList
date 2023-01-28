
exports.getDate = function() {

    let date = new Date();

    let options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    let day = date.toLocaleDateString("en-US", options);

    return day;
};