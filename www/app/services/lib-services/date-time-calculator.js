app.factory("dateTimeCalculator", [
    function () {
        return {

            getCurrentTime: function () {

                return new Date().getTime();
            }


            

        }
    }
]);

