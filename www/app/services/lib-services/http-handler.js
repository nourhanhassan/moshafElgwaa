app.factory("httpHandler", ["$http", "$q", "ionicLoading", "network", function ($http, $q, ionicLoading, network) {

    var apiDomainLink = "http://moshafalgwaa.qvtest.com/";
    // var apiDomainLink = "http://192.168.1.10:1234/" //hala
    var CPapiDomainLink = "http://gwaa.doaa.qvtest.com/";
    var defaultLoadingText = "جارِ التحميل الرجاء الانتظار";

    //Common Error Handler
    var errorHandler = function (err, showLoadingFlag) {

        console.log(err);
        if (showLoadingFlag) {
          ionicLoading.hide();
        }
        return $q.reject(err);
    }

    //Common Success Handler
    var successHandler = function (response,showLoadingFlag) {//showLoading
        console.log("Success sending request");
        if (showLoadingFlag) {
           ionicLoading.hide();
        }
        return response.data;
    }

    return {
        apiDomainLink: apiDomainLink,
        baseURL: apiDomainLink,
        CPapiDomainLink:CPapiDomainLink,
        URLDataUpload: apiDomainLink + "/API/FileAPI/UploadFile/",
        getHttpAppendedParameters:function(){
            return {};
        },
        //Send HTTP GET request to the path
        //path: path to send the request to (just the path and the base URL will be appended to it)
        //parameters:  the parameters for the request (JSON format)
        get: function (path, parameters, showLoading, loadingText) {
            network.checkNetwork();
            console.log(this.baseURL + path);
            if (typeof (showLoading) != "undefined" && showLoading==true) {
              

                if (typeof (loadingText) == "undefined") {
                   loadingText = defaultLoadingText;
                }

                ionicLoading.show({ templateText: loadingText });
            }

            if (!parameters) {
                parameters = {};
            }
            var appendedParameters = this.getHttpAppendedParameters();

            for (var prop in appendedParameters) {
                parameters[prop] = appendedParameters[prop];
            }

           
            return $http({
                url: this.baseURL + path ,
                method: "GET",
                params: parameters
            }).then(
                function (response) {
                   // console.log(response);
                    return successHandler(response, showLoading)
                }
            , function (err) {
                return errorHandler(err, showLoading);
            });//function (response) { successHandler(response,showLoading) }

        },
        //Send HTTP POST request to the path
        //path: path to send the request to (just the path and the base URL will be appended to it)
        //parameters:  the parameters for the request (JSON format)
        //showLoading: optional- if set to true, it will show default loading message
        //loadingText: optional- overrides the default loading text
        post: function (path, parameters, showLoading, loadingText) {
            network.checkNetwork()
           // showLoadingFlag = showLoading;
            if (typeof (showLoading) != "undefined" && showLoading == true) {
                

                if (typeof (loadingText) == "undefined") {
                    loadingText = defaultLoadingText;
                }

                ionicLoading.show({ templateText: loadingText });
            }
            

            if (!parameters) {
                parameters = {};
            }
            parameters = angular.extend(parameters, this.getHttpAppendedParameters());


            //we will append the username and the password directly to the querystring because in post request it's hard to extract the post parameters from HttpContext object when the payload is sent as JSON
            return $http({
                url: this.baseURL + path ,
                    method: "POST",
                    data: parameters
            }).then(function (resp) {
                return successHandler(resp, showLoading);
            }, function (err) {
                return errorHandler(err, showLoading);
            });

        }

    };


}]);