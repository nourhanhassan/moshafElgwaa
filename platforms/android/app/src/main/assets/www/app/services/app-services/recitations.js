app.factory("recitations", [function () {


    var service = {
        currentRecitation:null,
        recitations: [
            //{
            //    id: 1,
            //    name: "Abdul Basit",
            //    defaultMedia: "mp3-64",
            //    media: { "mp3-64": { "path": "\/\/cdn.alquran.cloud\/media\/audio\/ayah\/ar.abdulbasitmurattal\/", "type": "mp3", "kbs": "64", "auz": true }, "ogg-64": { "path": "\/\/cdn.alquran.cloud\/media\/audio\/ayah\/ar.abdulbasitmurattal\/", "type": "ogg", "kbs": "64", "auz": true }, "mp3-192": { "path": "\/\/cdn.alquran.cloud\/media\/audio\/ayah\/ar.abdulbasitmurattal\/", "type": "mp3", "kbs": "192", "auz": true } },
            //    native_name: "عبد الباسط عبد الصمد"

            //},

                       //{
                       //    id: 2,
                       //    name: "Abdul Basit Mujawwad",
                       //    defaultMedia: "mp3-128",
                       //    media: { "ogg-64": { "path": "\/\/audio.globalquran.com\/ar.abdulbasitmujawwad\/ogg\/64kbs\/", "type": "ogg", "kbs": "64", "auz": true }, "mp3-128": { "path": "\/\/audio.globalquran.com\/ar.abdulbasitmujawwad\/mp3\/128kbs\/", "type": "mp3", "kbs": "128", "auz": true } },
                       //    native_name: "عبد الباسط عبد الصمد (مجود)"

                       //},

        {
            id: 1,
            name: "Minshawi",
            defaultMedia: "mp3-128",
            media: { "ogg-64": { "path": "\/\/cdn.alquran.cloud\/media\/audio\/ayah\/ar.minshawi\/", "type": "ogg", "kbs": "64", "auz": true }, "mp3-128": { "path": "\/\/cdn.alquran.cloud\/media\/audio\/ayah\/ar.minshawi\/", "type": "mp3", "kbs": "128", "auz": true } },
            native_name: "محمد صديق المنشاوي "

        },

          {
              id: 4,
              name: "Minshawy Mujawwad",
              defaultMedia: "ogg-64",
              media: { "ogg-64": { "path": "\/\/audio.globalquran.com\/ar.minshawimujawwad\/ogg\/64kbs\/", "type": "ogg", "kbs": "64", "auz": true } },
              native_name: "محمد صديق المنشاوي (مجود) "

          },

            {
                id: 5,
                name: "Maher Al Muaiqly",
                defaultMedia: "mp3-128",
                media: { "mp3-128": { "path": "\/\/cdn.alquran.cloud\/media\/audio\/ayah\/ar.mahermuaiqly\/", "type": "mp3", "kbs": "128", "auz": false } },
                native_name: "ماهر المعيقلي "

            },
                 {
                     id: 6,
                     name: "Abdullah Basfar",
                     defaultMedia: "mp3-64",
                     media: { "mp3-32": { "path": "\/\/cdn.alquran.cloud\/media\/audio\/ayah\/ar.abdullahbasfar\/", "type": "mp3", "kbs": "32", "auz": false }, "mp3-64": { "path": "\/\/cdn.alquran.cloud\/media\/audio\/ayah\/ar.abdullahbasfar\/", "type": "mp3", "kbs": "64", "auz": false }, "mp3-192": { "path": "\/\/cdn.alquran.cloud\/media\/audio\/ayah\/ar.abdullahbasfar\/", "type": "mp3", "kbs": "192", "auz": true } },
                     native_name: "عبد الله بصفر "

                 },

                    {
                        id: 7,
                        name: "Abdurrahmaan As-Sudais",
                        defaultMedia: "mp3-64",
                        media: { "mp3-64": { "path": "\/\/cdn.alquran.cloud\/media\/audio\/ayah\/ar.abdurrahmaansudais\/", "type": "mp3", "kbs": "64", "auz": true }, "ogg-64": { "path": "\/\/cdn.alquran.cloud\/media\/audio\/ayah\/ar.abdurrahmaansudais\/", "type": "ogg", "kbs": "64", "auz": true }, "mp3-192": { "path": "\/\/cdn.alquran.cloud\/media\/audio\/ayah\/ar.abdurrahmaansudais\/", "type": "mp3", "kbs": "192", "auz": true } },
                        native_name: " عبد الرحمن السديس  "

                    },

          

                        {
                            id: 8,
                            name: "Abu Bakr Ash-Shaatree",
                            defaultMedia: "mp3-64",
                            media: { "mp3-64": { "path": "\/\/cdn.alquran.cloud\/media\/audio\/ayah\/ar.shaatree\/", "type": "mp3", "kbs": "64", "auz": true }, "ogg-64": { "path": "\/\/cdn.alquran.cloud\/media\/audio\/ayah\/ar.shaatree\/", "type": "ogg", "kbs": "64", "auz": false }, "mp3-128": { "path": "\/\/cdn.alquran.cloud\/media\/audio\/ayah\/ar.shaatree\/", "type": "mp3", "kbs": "128", "auz": true } },
                            native_name: " ابو بكر الشاطري  "

                        },
                          {
                              id: 9,
                              name: "Ahmed ibn Ali al-Ajamy",
                              defaultMedia: "mp3-64",
                              media: { "mp3-64": { "path": "\/\/cdn.alquran.cloud\/media\/audio\/ayah\/ar.ahmedajamy\/", "type": "mp3", "kbs": "64", "auz": true }, "mp3-128": { "path": "\/\/cdn.alquran.cloud\/media\/audio\/ayah\/ar.ahmedajamy\/", "type": "mp3", "kbs": "128", "auz": false } },
                              native_name: " أحمد بن علي العجمي  "

                          },
                           {
                               id: 10,
                               name: "Alafasy",
                               defaultMedia: "mp3-64",
                               media: { "mp3-64": { "path": "\/\/cdn.alquran.cloud\/media\/audio\/ayah\/ar.alafasy\/", "type": "mp3", "kbs": "64", "auz": true }, "ogg-64": { "path": "\/\/cdn.alquran.cloud\/media\/audio\/ayah\/ar.alafasy\/", "type": "ogg", "kbs": "64", "auz": false }, "mp3-128": { "path": "\/\/cdn.alquran.cloud\/media\/audio\/ayah\/ar.alafasy\/", "type": "mp3", "kbs": "128", "auz": true } },
                               native_name: "مشاري العفاسي  "

                           },

                           //{
                           //    id: 11,
                           //    name: "Ghamadi",
                           //    defaultMedia: "mp3-40",
                           //    media: { "mp3-40": { "path": "\/\/audio.globalquran.com\/ar.ghamadi\/mp3\/40kbs\/", "type": "mp3", "kbs": "40", "auz": true } },
                           //    native_name: "الغامدي  "

                           //},
                              {
                                  id: 12,
                                  name: "Hani Rifai",
                                  defaultMedia: "mp3-64",
                                  media: { "mp3-64": { "path": "\/\/cdn.alquran.cloud\/media\/audio\/ayah\/ar.hanirifai\/", "type": "mp3", "kbs": "64", "auz": true }, "ogg-64": { "path": "\/\/cdn.alquran.cloud\/media\/audio\/ayah\/ar.hanirifai\/", "type": "ogg", "kbs": "64", "auz": false }, "mp3-192": { "path": "\/\/cdn.alquran.cloud\/media\/audio\/ayah\/ar.hanirifai\/", "type": "mp3", "kbs": "192", "auz": false } },
                                  native_name: "هاني الرفاعي  "

                              },

                               {
                                   id: 13,
                                   name: "Husary",
                                   defaultMedia: "mp3-64",
                                   media: { "mp3-64": { "path": "\/\/cdn.alquran.cloud\/media\/audio\/ayah\/ar.husary\/", "type": "mp3", "kbs": "64", "auz": true }, "ogg-64": { "path": "\/\/cdn.alquran.cloud\/media\/audio\/ayah\/ar.husary\/", "type": "ogg", "kbs": "64", "auz": true }, "mp3-128": { "path": "\/\/cdn.alquran.cloud\/media\/audio\/ayah\/ar.husary\/", "type": "mp3", "kbs": "128", "auz": true } },
                                   native_name: "الحصري   "

                               },
                                {
                                    id: 14,
                                    name: "Husary Mujawwad",
                                    defaultMedia: "mp3-64",
                                    media: { "mp3-64": { "path": "\/\/cdn.alquran.cloud\/media\/audio\/ayah\/ar.husarymujawwad\/", "type": "mp3", "kbs": "64", "auz": true }, "ogg-64": { "path": "\/\/cdn.alquran.cloud\/media\/audio\/ayah\/ar.husarymujawwad\/", "type": "ogg", "kbs": "64", "auz": true }, "mp3-128": { "path": "\/\/cdn.alquran.cloud\/media\/audio\/ayah\/ar.husarymujawwad\/", "type": "mp3", "kbs": "128", "auz": true } },
                                    native_name: "  الحصري (مجود)   "

                                },
                                   {
                                       id: 15,
                                       name: "Hudhaify",
                                       defaultMedia: "mp3-32",
                                       media: { "mp3-32": { "path": "\/\/cdn.alquran.cloud\/media\/audio\/ayah\/ar.hudhaify\/", "type": "mp3", "kbs": "32", "auz": true }, "mp3-128": { "path": "\/\/cdn.alquran.cloud\/media\/audio\/ayah\/ar.hudhaify\/", "type": "mp3", "kbs": "128", "auz": true } },
                                       native_name: "الحذيفي"

                                   },
                                     {
                                         id: 16,
                                         name: "Ibrahim Akhdar",
                                         defaultMedia: "mp3-32",
                                         media: { "mp3-32": { "path": "\/\/cdn.alquran.cloud\/media\/audio\/ayah\/ar.ibrahimakhbar\/", "type": "mp3", "kbs": "32", "auz": false } },
                                         native_name: "ابراهيم الاخضر"

                                     },
                                        {
                                            id: 17,
                                            name: "Muhammad Ayyoub",
                                            defaultMedia: "mp3-128",
                                            media: { "mp3-128": { "path": "\/\/cdn.alquran.cloud\/media\/audio\/ayah\/ar.muhammadayyoub\/", "type": "mp3", "kbs": "128", "auz": true } },
                                            native_name: "محمد ايوب"

                                        },
                                            {
                                                id: 18,
                                                name: "Muhammad Jibreel",
                                                defaultMedia: "mp3-128",
                                                media: { "mp3-128": { "path": "\/\/cdn.alquran.cloud\/media\/audio\/ayah\/ar.muhammadjibreel\/", "type": "mp3", "kbs": "128", "auz": true } },
                                                native_name: "محمد جبريل"

                                            },
                                            {
                                                id: 19,
                                                name: "Saood bin Ibraaheem Ash-Shuraym ",
                                                defaultMedia: "ogg-64",
                                                media: { "ogg-64": { "path": "\/\/audio.globalquran.com\/ar.saoodshuraym\/ogg\/64kbs\/", "type": "ogg", "kbs": "64", "auz": false } },
                                                native_name: " سعود بن إبراهيم الشريم"

                                            }
        ]
        ,

        getRecitationById: function (id) {

            return service.recitations.filter(function (r) { return r.id == id })[0];
        },
        setCurrentRecitation: function (id) {
            service.currentRecitation = service.getRecitationById(id); 
        }

        
    }
    return service;
}])