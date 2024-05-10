let ejs = require('ejs');

// let people = ['geddy', 'neil', 'alex'];
// let html = ejs.render('<%= people.join(", "); %>', {people: people});

// import "/public/import/jquery-3.7.1.min"
// import "/public/import/bootstrap.min"
// import "/public/import/bootstrap.min.css"
const str = "<H3>All Plants</H3>\n" +
    "<div class=\"container\">\n" +
    "    <% for (var i = 0; i < plantList.length; i++) { %>\n" +
    "        <% if (i % 4 === 0) { %>\n" +
    "        <div class=\"row\">\n" +
    "            <% } %>\n" +
    "            <div class=\"col-lg-3 col-md-6\">\n" +
    "                <div class=\"plant-card text-center\">\n" +
    "                    <a href=\"/detail/<%= plantList[i].plantId %>\" class=\"card-link\">\n" +
    "                        <img src=\"<%= plantList[i].photoPath %>\" alt=\"<%= plantList[i].plantName %>\"\n" +
    "                             class=\"img-fluid mx-auto\">\n" +
    "                        <div class=\"mt-3\">\n" +
    "                            <h3><%= plantList[i].plantName %></h3>\n" +
    "                            <p><%= plantList[i].description %></p>\n" +
    "                        </div>\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <% if ((i + 1) % 4 === 0 || i === plantList.length - 1) { %>\n" +
    "        </div>\n" +
    "        <% } %>\n" +
    "    <% } %>\n" +
    "</div>"

let template = ejs.compile(str);
plantList = [
    {
        _id: '660458176ecda8fea171150d',
        plantId: 'jhiuherieuir20240327173207',
        plantName: 'jhiuherieuir',
        description: 'ghuirhuverhibvrnvjkerhbioeruui',
        details: 'wrjggueubieuryv',
        datetime: '2024-03-27T17:34:00.000Z',
        location: 'jdfhuheruhvuier',
        flowers: 'yes',
        sunExposure: 'fullSun',
        flowerColor: 'gsgvgege',
        status: 'Complete',
        nickName: 'gfgeuyfu',
        photoPath: '/public/images/plantImages/1711560727720-dog.gif',
        __v: 0
    },
    {
        _id: '65fd9a0610adb186989b239c',
        plantId: '3gg4h20240322144734',
        plantName: '3gg4h',
        description: 'fgeugreguyre',
        details: 'fegehtrh',
        datetime: '2024-03-22T17:50:00.000Z',
        location: 'f43g4g4',
        flowers: 'yes',
        sunExposure: 'fullSun',
        flowerColor: 'erggh5',
        status: 'Complete',
        nickName: 'grtgrth',
        photoPath: '/images/plantImages/1711118853985-A0HM.gif',
        __v: 0
    },
    {
        _id: '6604747dea9c59ba0f5d7dd3',
        plantId: 'juhua20240327193317',
        plantName: 'juhua',
        description: '3qtrf4wtg',
        details: 'aegvdrsbdtb',
        datetime: '2024-03-27T22:33:00.000Z',
        location: 'wgy5eyh45uh',
        flowers: 'yes',
        sunExposure: 'fullSun',
        flowerColor: '3gh54h4',
        status: 'Complete',
        nickName: 'tommy',
        photoPath: '\\images\\plantImages\\1711567997374-juhua.jfif',
        __v: 0
    },
    {
        _id: '660474bdea9c59ba0f5d7dd7',
        plantId: 'yinhua20240327193421',
        plantName: 'yinhua',
        description: 'lalalalalla',
        details: 'details about hgxhahjahj',
        datetime: '2024-03-27T21:33:00.000Z',
        location: 'wgy5eyh45uh',
        flowers: 'yes',
        sunExposure: 'fullShade',
        flowerColor: 'pink',
        status: 'Complete',
        nickName: 'tommy',
        photoPath: '\\images\\plantImages\\1711568061190-yinhua.jfif',
        __v: 0
    },
    {
        _id: '66055b73c96248e614efb0ff',
        plantId: 'chrysanthemum20240328115843',
        plantName: 'chrysanthemum',
        description: 'hello',
        details: 'lallalal',
        datetime: '2024-03-28T14:47:00.000Z',
        location: 'sheffield',
        flowers: 'yes',
        sunExposure: 'fullSun',
        flowerColor: 'white',
        status: 'Complete',
        nickName: 'tommy',
        photoPath: '\\images\\plantImages\\1711627123029-juhua.jfif',
        __v: 0
    },
    {
        _id: '66194fc7c052a9f222cd0fe3',
        plantId: '120240412231415',
        plantName: '1',
        description: '1',
        details: '1',
        datetime: '2024-04-14T15:13:00.000Z',
        location: '1',
        flowers: 'yes',
        sunExposure: 'fullSun',
        flowerColor: '1',
        status: 'In Progress',
        nickName: '1',
        photoPath: '\\images\\plantImages\\1712934855267-diego-jimenez-A-NVHPka9Rk-unsplash.jpg',
        __v: 0
    },
    {
        _id: '6619536bb04844c0a05b743d',
        plantId: '520240412232947',
        plantName: '5',
        description: '1',
        details: '2',
        datetime: '2024-04-14T15:29:00.000Z',
        location: '3',
        flowers: 'yes',
        sunExposure: 'fullSun',
        flowerColor: '4',
        status: 'In Progress',
        nickName: '6',
        photoPath: '\\images\\plantImages\\1712935787178-diego-jimenez-A-NVHPka9Rk-unsplash.jpg',
        __v: 0
    },
    {
        _id: '661954981595c5fde3be36c1',
        plantId: '520240412233448',
        plantName: '5',
        description: '1',
        details: '2',
        datetime: '2024-04-14T15:29:00.000Z',
        location: '3',
        flowers: 'yes',
        sunExposure: 'fullSun',
        flowerColor: '4',
        status: 'In Progress',
        nickName: '6',
        photoPath: '\\images\\plantImages\\1712936087765-diego-jimenez-A-NVHPka9Rk-unsplash.jpg',
        __v: 0
    },
    {
        _id: '661955850bc040b24d2b75df',
        plantId: '520240412233845',
        plantName: '5',
        description: '1',
        details: '2',
        datetime: '2024-04-14T15:29:00.000Z',
        location: '3',
        flowers: 'yes',
        sunExposure: 'fullSun',
        flowerColor: '4',
        status: 'In Progress',
        nickName: '6',
        photoPath: '\\images\\plantImages\\1712936323812-diego-jimenez-A-NVHPka9Rk-unsplash.jpg',
        __v: 0
    },
    {
        _id: '661955fcc164b8190e0fbc5f',
        plantId: '520240412234044',
        plantName: '5',
        description: '1',
        details: '2',
        datetime: '2024-04-14T15:29:00.000Z',
        location: '3',
        flowers: 'yes',
        sunExposure: 'fullSun',
        flowerColor: '4',
        status: 'In Progress',
        nickName: '6',
        photoPath: '\\images\\plantImages\\1712936443845-diego-jimenez-A-NVHPka9Rk-unsplash.jpg',
        __v: 0
    },
    {
        _id: '661956575d1a362209a53495',
        plantId: '520240412234215',
        plantName: '5',
        description: '1',
        details: '2',
        datetime: '2024-04-14T15:29:00.000Z',
        location: '3',
        flowers: 'yes',
        sunExposure: 'fullSun',
        flowerColor: '4',
        status: 'In Progress',
        nickName: '6',
        photoPath: '\\images\\plantImages\\1712936535119-diego-jimenez-A-NVHPka9Rk-unsplash.jpg',
        __v: 0
    }
]

let renderedHTML = template(plantList);
// 假设你有一个 id 为 "output" 的 div 元素用于显示渲染后的 HTML
document.getElementById('output').innerHTML = renderedHTML;

//放弃这种做法，因为
//1.这样注入和用原生html注入没有区别
//2.生成的bundle.js文件如果想要离线访问必须缓存，每个页面都要有一个bundle，很占用空间